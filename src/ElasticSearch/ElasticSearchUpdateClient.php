<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
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
        print_r($config);
        $protocol = $config['ssl'] ? 'https' : 'http';
        $this->client = ClientBuilder::create()
            ->setSSLVerification($config['verify-ssl'])
            ->setHosts(["$protocol://" . $config['host'] . ':' . $config['port']])
            ->setBasicAuthentication($config['user'], $config['pass'])
            ->build();

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

    public function deleteIndex()
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

            print_r($params);
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
        $body['__properties'] = array_unique(array_map(fn(PropertyValues $pv) => $pv->getProperty(), $doc->getPropertyValues()));
        foreach ($propertyValues as $propertyValue) {
            $name = Helper::mapName($propertyValue->getProperty());
            $body[$name] = Helper::mapValues($propertyValue);
        }
        try {
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
}