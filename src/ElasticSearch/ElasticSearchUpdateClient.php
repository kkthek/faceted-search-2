<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;
use DIQA\FacetedSearch2\Model\Update\Document;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\MissingParameterException;
use Elastic\Elasticsearch\Exception\ServerResponseException;

class ElasticSearchUpdateClient extends AbstractElasticSearchClient implements FacetedSearchUpdateClient
{
    public function __construct($client = null)
    {
        parent::__construct($client);
    }

    /**
     * @throws BackendException
     */
    public function updateDocuments(...$docs): void
    {
        foreach ($docs as $doc) {
            $this->updateDocument($doc);
        }
    }

    /**
     * @throws BackendException
     */
    public function deleteDocument(string $id): void
    {
        $params = $this->getParamForIndex();
        $params['id'] = $id;

        try {
            $this->client->delete($params);
        } catch (ClientResponseException
        |MissingParameterException
        |ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    /**
     * @throws BackendException
     */
    public function clearAllDocuments(): void
    {
        $params = $this->getParamForIndex();
        $params['body'] = ['query' => ['match_all' => new \stdClass()]];
        try {
            $this->client->deleteByQuery($params);
        } catch (ClientResponseException
        |MissingParameterException
        |ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    public function deleteIndex(): void
    {
        $params = $this->getParamForIndex();
        try {
            $this->client->indices()->delete($params);
        } catch (ClientResponseException
        |MissingParameterException
        |ServerResponseException $e) {
            throw BackendException::create($e);
        }

    }

    /**
     * @throws BackendException
     */
    public function initIndex(): void
    {
        $params = $this->getParamForIndex();

        try {
            $response = $this->client->indices()->exists($params);
            if ($response->asBool()) {
                return;
            }

            $params['body'] = $this->getSchemaMappings();

            $this->client->indices()->create($params);

        } catch (ClientResponseException
        |MissingParameterException
        |ServerResponseException $e) {
            throw BackendException::create($e);
        }

    }

    /**
     * @param mixed $doc
     * @return void
     * @throws BackendException
     */
    public function updateDocument(Document $doc): void
    {
        $params = $this->getParamForIndex();
        $propertyValues = $doc->getPropertyValues();
        $body = [];
        $body['__categories'] = $doc->getCategories();
        $body['__directCategories'] = $doc->getDirectCategories();
        $body['__templates'] = $doc->getTemplates();
        $properties = array_map(fn(PropertyValues $pv) => Helper::toInternalName($pv->getProperty()), $doc->getPropertyValues());
        $body['__properties'] = array_values(array_unique($properties));
        $body['__fulltext'] = $doc->getFulltext();
        $body['__title'] = $doc->getTitle();
        $body['__namespace'] = $doc->getNamespace();
        $body['__display'] = $doc->getDisplayTitle();
        foreach ($propertyValues as $propertyValue) {
            $name = Helper::toInternalName($propertyValue->getProperty());
            $body[$name] = Helper::mapValuesToESModel($propertyValue);
        }
        try {
            $params['id'] = $doc->getId();
            $params['body'] = $body;
            $this->client->index($params);
        } catch (
        ClientResponseException
        |MissingParameterException
        |ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    /**
     * @return array[]
     */
    public function getSchemaMappings(): array
    {
        $schemaProperties = [];
        $schemaProperties['__categories'] = ['type' => 'keyword'];
        $schemaProperties['__directCategories'] = ['type' => 'keyword'];
        $schemaProperties['__templates'] = ['type' => 'keyword'];
        $schemaProperties['__properties'] = ['type' => 'keyword'];
        $schemaProperties['__fulltext'] = [
            'type' => 'text',
            'analyzer' => 'substring_analyzer',
            'search_analyzer' => 'substring_search_analyzer'];
        $schemaProperties['__title'] = [
            'type' => 'text',
            'analyzer' => 'substring_analyzer',
            'search_analyzer' => 'substring_search_analyzer'
        ];
        $schemaProperties['__namespace'] = ['type' => 'long'];
        $schemaProperties['__display'] = ['type' => 'wildcard'];
        return [
            "settings"=> [
                "analysis"=> [
                    "analyzer"=> [
                        "substring_analyzer"=> [
                            "type"=> "custom",
                            "tokenizer"=> "standard",
                            "filter"=> ["lowercase", "substring_ngram"]
                        ],
                        "substring_search_analyzer"=> [
                            "type"=> "custom",
                            "tokenizer"=> "standard",
                            "filter"=> ["lowercase"]
                        ]
                    ],
                    "filter"=> [
                        "substring_ngram"=> [
                            "type"=> "ngram",
                            "min_gram"=> 2,
                            "max_gram"=> 20
                        ]
                    ]
                ],
                "index"=> [
                    "max_ngram_diff"=> 18
                ]
            ],
            'mappings' => [
                'properties' => $schemaProperties,
                "dynamic_templates" => [
                    [

                        "fs2-number-template" => [
                            "match" => "number_*",
                            "mapping" => [
                                "type" => "double"
                            ]
                        ],
                    ],
                    [

                        "fs2-text-template" => [
                            "match" => "text_*",
                            "mapping" => [
                                "type" => "wildcard"
                            ]
                        ],
                    ],
                    [

                        "fs2-datetime-template" => [
                            "match" => "datetime_*",
                            "mapping" => [
                                "type" => "long"
                            ]
                        ],
                    ],
                    [

                        "fs2-boolean-template" => [
                            "match" => "boolean_*",
                            "mapping" => [
                                "type" => "boolean"
                            ]
                        ],
                    ],
                    [

                        "fs2-wikipage-template" => [
                            "match" => "wikipage_*",
                            "mapping" => [
                                "type" => "nested",
                                "properties" => [
                                    "title" => ["type" => "wildcard"],
                                    "display" => ["type" => "wildcard"]
                                ]
                            ]
                        ],
                    ]
                ]
            ],
        ];
    }

    /**
     * Check if index exists
     * @return bool
     * @throws BackendException
     */
    public function existsIndex(): bool
    {
        try {
            $params = $this->getParamForIndex();
            $response = $this->client->indices()->exists($params);
            return $response->asBool();
        } catch (
        ClientResponseException
        |MissingParameterException
        |ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }
}