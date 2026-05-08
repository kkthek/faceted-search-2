<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;
use DIQA\FacetedSearch2\Model\Update\Document;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;
use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Elastic\Elasticsearch\Exception\AuthenticationException;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\MissingParameterException;
use Elastic\Elasticsearch\Exception\ServerResponseException;

class ElasticSearchUpdateClient implements FacetedSearchUpdateClient
{

    private Client $client;
    private array $config;
    /**
     * @throws AuthenticationException
     */
    public function __construct()
    {
        global $fs2gBackendConfig;
        $config = [

            'host' => $fs2gBackendConfig['host'] ?? 'localhost',
            'port' => $fs2gBackendConfig['port'] ?? 9200,
            'user' => $fs2gBackendConfig['user'] ?? 'elastic',
            'pass' => $fs2gBackendConfig['pass'] ?? '',
            'ssl' => $fs2gBackendConfig['ssl'] ?? false,
            'verify-ssl' => $fs2gBackendConfig['verify-ssl'] ?? false,

        ];

        $protocol = $config['ssl'] ? 'https' : 'http';
        $this->client = ClientBuilder::create()
            ->setSSLVerification($config['verify-ssl'])
            ->setHosts(["$protocol://" . $config['host'] . ':' . $config['port']])
            ->setBasicAuthentication($config['user'], $config['pass'])
            ->build();
        $this->config = $config;
    }

    public function getConfig(): array
    {
        return $this->config;
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

    private function getParamForIndex(): array
    {
        global $fs2gBackendConfig;

        return [
            'index' => $fs2gBackendConfig['indexName'] ?? 'mw',
        ];
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
        $properties = array_map(fn(PropertyValues $pv) => $pv->getProperty()->getTitle(), $doc->getPropertyValues());
        $body['__properties'] = array_values(array_unique($properties));
        $body['__fulltext'] = $doc->getFulltext();
        $body['__title'] = $doc->getTitle();
        $body['__namespace'] = $doc->getNamespace();
        $body['__display'] = $doc->getDisplayTitle();
        foreach ($propertyValues as $propertyValue) {
            $name = Helper::mapName($propertyValue->getProperty());
            $body[$name] = Helper::mapValues($propertyValue);
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
        $schemaProperties['__properties'] = ['type' => 'keyword'];
        $schemaProperties['__fulltext'] = ['type' => 'text'];
        $schemaProperties['__title'] = ['type' => 'text'];
        $schemaProperties['__namespace'] = ['type' => 'long'];
        $schemaProperties['__display'] = ['type' => 'text'];
        return [
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
                                "type" => "text"
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
                                    "title" => ["type" => "text"],
                                    "display" => ["type" => "text"]
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