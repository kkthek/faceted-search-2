<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\FacetedSearchClient;
use DIQA\FacetedSearch2\Model\Request\BaseQuery;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetCount;
use DIQA\FacetedSearch2\Model\Response\Document;
use DIQA\FacetedSearch2\Model\Response\DocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\FacetResponse;
use DIQA\FacetedSearch2\Model\Response\MWTitleWithURL;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetCount;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetValue;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetCount;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetValues;
use DIQA\FacetedSearch2\Model\Response\PropertyWithURL;
use DIQA\FacetedSearch2\Model\Response\StatsResponse;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\ServerResponseException;

class ElasticSearchQueryClient extends AbstractElasticSearchClient implements FacetedSearchClient
{

    public function __construct($client = null)
    {
        parent::__construct($client);
    }

    public function requestDocuments(DocumentQuery $q): DocumentsResponse
    {

        try {
            $params = $this->getParamForIndex();
            $query = $this->getQuery($q);

            $params['body'] = [
                'query' => $query,
                'aggs' =>
                    [
                        'field_frequency' => ['terms' => ['field' => '__properties', 'size' => 1000]],
                        'namespace_frequency' => ['terms' => ['field' => '__namespace', 'size' => 1000]],
                        'category_frequency' => ['terms' => ['field' => '__categories', 'size' => 1000]],
                    ]
                ,
                //'size' => 0
            ];

            $response = $this->client->search($params);
            $response = $response->asArray();

            $documents=[];

            $hits = $response['hits']['hits'];
            foreach ($hits as $doc) {

                $d = new Document($doc['_id'],
                    $this->readProperties($doc['_source']),
                    $doc['_source']['__categories'],
                    $doc['_source']['__directCategories'],
                    new NamespaceFacetValue($doc['_source']['__namespace'], ""),
                    $doc['_source']['__title'],
                    $doc['_source']['__display'],
                    "",
                    $doc['_score'],
                    false);
                $documents[] = $d;
            }
            return new DocumentsResponse($hits['total']['value'] ?? 0,
                $documents,
                $this->readCategoryCounts($response['aggregations']['category_frequency']['buckets']),
                $this->readPropertyCounts($response['aggregations']['field_frequency']['buckets']),
                $this->readNamespaceCounts($response['aggregations']['namespace_frequency']['buckets']),
                false);
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    public function requestFacets(FacetQuery $q): FacetResponse
    {
        // TODO: Implement requestFacets() method.
        return new FacetResponse([]);
    }

    public function requestStats(StatsQuery $q): StatsResponse
    {
        // TODO: Implement requestStats() method.
        return new StatsResponse([]);
    }

    public function requestFileExtraction(string $fileContent, string $contentType): string
    {
        // TODO: Implement requestFileExtraction() method.
        return "";
    }

    public function requestDocument(string $id): Document
    {
        // TODO: Implement requestDocument() method.
        return new Document(0, [], [], [], new NamespaceFacetValue(0, ""), "", "", "", 0, false);
    }

    private function readProperties($properties): array
    {
        $results = [];

        foreach ($properties as $propertyWithType => $values) {
            if (strpos($propertyWithType, '__') === 0) {
                continue;
            }

            $facetValues = [];
            list($type, $name) = explode('__', $propertyWithType);
            switch ($type) {
                case 'text':
                case 'number':
                    $facetValues = $values;
                    break;
                case 'datetime':
                    $facetValues = array_map(fn($v) => Helper::fromUnixTimestamp($v), $values);
                    break;
                case 'boolean':
                    $facetValues = array_map(fn($v) => $v === 'true', $values);
                    break;
                case 'wikipage':
                    $facetValues = array_map(fn($v) => new MWTitleWithURL($v['title'], $v['display'], ''), $values);
                    break;
            }
            $results[] = new PropertyFacetValues(
                new PropertyWithURL($name, '', Helper::getDatatypeFromInternalName($type), ''),
                $facetValues);
        }
        return $results;
    }

    private function readPropertyCounts(array $buckets): array
    {
        $counts = [];

        foreach ($buckets as $bucket) {
            list($type, $name) = explode('__', $bucket['key']);
            $counts[] = new PropertyFacetCount(
                new PropertyWithURL($name,
                    '',
                    Helper::getDatatypeFromInternalName($type), ''),
                $bucket['doc_count']);
        }
        return $counts;
    }

    private function readCategoryCounts(array $buckets): array
    {
        $counts = [];

        foreach ($buckets as $bucket) {

            $counts[] = new CategoryFacetCount(
                $bucket['key'],
                '',
                $bucket['doc_count']);
        }
        return $counts;
    }

    private function readNamespaceCounts(array $buckets): array
    {
        $counts = [];

        foreach ($buckets as $bucket) {

            $counts[] = new NamespaceFacetCount(
                $bucket['key'],
                '',
                $bucket['doc_count']);
        }
        return $counts;
    }

    public function getQuery(BaseQuery $q): array
    {
        $orConditions = [];
        $andConditions = [];
        foreach ($q->getPropertyFacets() as $facet) {
            if (count($facet->getValues()) === 1) {
                $value = $facet->getValues()[0];
                if ($value->isAllValues()) {
                    $must = ['exists' => Helper::toInternalName($facet->property)];
                } else {
                    $must = Helper::mapFacetQueryToESModel($facet->property, $value);
                }
                $andConditions[] = $must;
            } else {
                $orConditions[] = array_map(fn($v) => Helper::mapFacetQueryToESModel($facet->getProperty(), $v), $facet->getValues());
            }

        }

        foreach ($q->getCategoryFacets() as $category) {
            $andConditions[] = ['term' => ['__categories' => $category]];
        }

        $namespaceConditions = [];
        foreach ($q->getNamespaceFacets() as $namespaceFacet) {
            $namespaceConditions[] = ['term' => ['__namespace' => $namespaceFacet]];
        }
        if (count($namespaceConditions) > 0) {
            $orConditions[] = $namespaceConditions;
        }

        if (!empty($q->getSearchText())) {
            $andConditions[] = ['match' => ['__title' => $q->getSearchText()]];
            $andConditions[] = ['match' => ['__fulltext' => $q->getSearchText()]];
        }


        return [
            'bool' => [
                'must' => $andConditions,
                'should' => array_map(fn($cond) => ['bool' => ['should' => $cond]], $orConditions),

            ]
        ];

    }
}
