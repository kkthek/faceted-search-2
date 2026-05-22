<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\FacetedSearchClient;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Order;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\BaseQuery;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetCount;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetValue;
use DIQA\FacetedSearch2\Model\Response\Document;
use DIQA\FacetedSearch2\Model\Response\DocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\FacetResponse;
use DIQA\FacetedSearch2\Model\Response\MWTitleWithURL;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetCount;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetValue;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetCount;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetValues;
use DIQA\FacetedSearch2\Model\Response\PropertyWithURL;
use DIQA\FacetedSearch2\Model\Response\Stats;
use DIQA\FacetedSearch2\Model\Response\StatsResponse;
use DIQA\FacetedSearch2\Model\Response\ValueCount;
use DIQA\FacetedSearch2\Utils\WikiTools;
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
            $query = $this->getBaseQuery($q);

            $includedProperties = ['__title', '__display', '__fulltext', '__categories', '__namespace', '__directCategories'];
            $includedProperties = array_merge($includedProperties, array_map(fn($p) => Helper::toInternalName($p), $q->getExtraProperties()));
            $params['body'] = [
                'query' => $query,
                'aggs' =>
                    [
                        'field_frequency' => ['terms' => ['field' => '__properties', 'size' => 1000]],
                        'namespace_frequency' => ['terms' => ['field' => '__namespace', 'size' => 1000]],
                        'category_frequency' => ['terms' => ['field' => '__categories', 'size' => 1000]],
                    ]
                ,
                '_source' => ['includes' => $includedProperties],
                'size' => $q->limit,
                'from' => $q->offset,
                'highlight' => ['fields' => ['__fulltext' => ['type' => 'plain']]],
                'sort' => array_map(fn($s) => [Helper::toInternalName($s->property) => ['order' => $s->order === Order::ASC ? 'asc' : 'desc']], $q->getSorts())
            ];
//echo print_r($params, true);
            $response = $this->client->search($params);
            $response = $response->asArray();

            $documents = array_map(fn($hit) => $this->readDocument($hit), $response['hits']['hits']);
            $categoryCounts = array_map(fn($b) => new CategoryFacetCount($b['key'], '', $b['doc_count']),
                $response['aggregations']['category_frequency']['buckets']);
            $namespaceCounts = array_map(fn($b) => new NamespaceFacetCount($b['key'], '', $b['doc_count']),
                $response['aggregations']['namespace_frequency']['buckets']);
            $propertyFacetCounts = $this->readPropertyCounts($response['aggregations']['field_frequency']['buckets']);

            $numResults = $response['hits']['total']['value'] ?? 0;

            $documentsResponse = new DocumentsResponse($numResults,
                $documents,
                $categoryCounts,
                $propertyFacetCounts,
                $namespaceCounts,
                WikiTools::titleExists($q->searchText));
            $this->fillEmptyCategoryFacetCounts($documentsResponse, $q);
            $this->recalculateNamespaceCountsIfNecessary($documentsResponse, $q);
            return $documentsResponse;
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    public function requestFacets(FacetQuery $q): FacetResponse
    {
        try {
            $params = $this->getParamForIndex();
            $query = $this->getBaseQuery($q);

            $aggs = [];
            $andConditions = [];
            foreach ($q->getPropertyValueQueries() as $pvq) {
                $toInternalName = Helper::toInternalName($pvq->getProperty());
                if ($pvq->getProperty()->getType() === Datatype::WIKIPAGE) {
                    $aggs[$toInternalName] = [
                        'nested' => [
                            'path' => $toInternalName,

                        ],
                        'aggs' => [
                            'values' => [
                                'multi_terms' => [
                                    'terms' =>[
                                        [ 'field' => $toInternalName . '.title'],
                                        [ 'field' => $toInternalName . '.display']
                                    ],
                                    'size' => $pvq->getValueLimit() ?? 1000,
                                ],
                            ]

                        ]
                    ];
                    if (!is_null($pvq->getValueContains())) {
                        $andConditions[] = ['nested' => [
                            'path' => $toInternalName,
                            'query' => ['wildcard' => [
                                $toInternalName . '.display' => "*{$pvq->getValueContains()}*"]
                            ]
                        ]];
                    }
                } else {
                    $aggs[$toInternalName] = [
                        'terms' => [
                            'field' => $toInternalName,
                            'size' => $pvq->getValueLimit() ?? 1000,
                        ],

                    ];
                    if (!is_null($pvq->getValueContains())) {
                        $andConditions[] = ['wildcard' => [$toInternalName => "*{$pvq->getValueContains()}*"]];
                    }
                }
            }


            $query['bool']['must'] = array_merge($andConditions, $query['bool']['must']);


            $statsQuery = new StatsQuery();
            $statsQuery->updateQuery($q);
            if (count($q->getRangeQueries()) > 0) {
                $statsQuery->setStatsProperties($q->getRangeQueries());
                $statsResponse = $this->requestStats($statsQuery);
                foreach ($statsResponse->getStats() as $stat) {
                    $toInternalName = Helper::toInternalName($stat->getProperty());
                    $clusters = array_map(function (Range $r) use ($stat) {
                        $to = $r->getTo();
                        $from = $r->getFrom();
                        if ($stat->getProperty()->getType() === Datatype::DATETIME) {
                            $from = Helper::convertDateTimeToLong($from);
                            $to = Helper::convertDateTimeToLong($to);
                        }
                        return [
                            'from' => $from,
                            'to' => $to
                        ];
                    }, $stat->clusters);

                    $aggs[$toInternalName] = [
                        'range' => ['field' => $toInternalName,
                            'ranges' => $clusters]

                    ];
                }
            }

            $params['body'] = [
                'query' => $query,
                'size' => 0
            ];

            if (count($aggs) > 0) {
                $params['body']['aggs'] = $aggs;
            }

            $response = $this->client->search($params);
            $response = $response->asArray();

            $propertyValueCounts = [];
            foreach ($q->getPropertyValueQueries() as $pvq) {
                $toInternalName = Helper::toInternalName($pvq->getProperty());
                if ($pvq->getProperty()->getType() === Datatype::WIKIPAGE) {
                    $valueCounts = array_map(fn($b) => new ValueCount(null,
                        new MWTitleWithURL($b['key'][0], $b['key'][1], WikiTools::createURLForPage($b['key'][0])),
                        null, $b['doc_count']),
                        $response['aggregations'][$toInternalName]['values']['buckets']);
                } else {
                    $valueCounts = array_map(fn($b) => new ValueCount($b['key'], null, null, $b['doc_count']),
                        $response['aggregations'][$toInternalName]['buckets']);
                }
                $propertyValueCounts[] = new PropertyFacetValues(new PropertyWithURL(
                    $pvq->getProperty()->getTitle(),
                    WikiTools::getDisplayTitleForProperty($pvq->getProperty()->getTitle()),
                    $pvq->getProperty()->getType(),
                WikiTools::createURLForProperty($pvq->getProperty()->getTitle())), $valueCounts);
            }

            foreach ($q->getRangeQueries() as $property) {
                $toInternalName = Helper::toInternalName($property);
                $valueCounts = array_map(function ($b) use ($property) {
                    $from = $b['from'];
                    $to = $b['to'];
                    if ($property->getType() === Datatype::DATETIME) {
                        $from = Helper::fromLongToDateTime($from);
                        $to = Helper::fromLongToDateTime($to);
                    }
                    return new ValueCount(null, null,
                        new Range($from, $to), $b['doc_count']);
                }, $response['aggregations'][$toInternalName]['buckets']);
                $valueCounts = array_values(array_filter($valueCounts, fn($vc) => $vc->count > 0));
                $propertyValueCounts[] = new PropertyFacetValues(new PropertyWithURL(
                    $property->getTitle(),
                    WikiTools::getDisplayTitleForProperty($property->getTitle()),
                    $property->getType(),
                    WikiTools::createURLForProperty($property->getTitle())), $valueCounts);
            }
            return new FacetResponse($propertyValueCounts);
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        } catch (BackendException $e) {
            throw $e;
        }
    }

    public function requestStats(StatsQuery $q): StatsResponse
    {
        try {
            $params = $this->getParamForIndex();
            $query = $this->getBaseQuery($q);

            $aggs = [];
            foreach ($q->getStatsProperties() as $property) {
                $toInternalName = Helper::toInternalName($property);
                $aggs['min' . $toInternalName] = ['min' => ['field' => $toInternalName]];
                $aggs['max' . $toInternalName] = ['max' => ['field' => $toInternalName]];
                $aggs['sum' . $toInternalName] = ['sum' => ['field' => $toInternalName]];
                $aggs['cardinality' . $toInternalName] = ['cardinality' => ['field' => $toInternalName]];

            }

            $params['body'] = [
                'query' => $query,
                'aggs' => $aggs,
                'size' => 0
            ];
            $response = $this->client->search($params);
            $response = $response->asArray();
            $stats = [];
            foreach ($q->getStatsProperties() as $property) {
                $toInternalName = Helper::toInternalName($property);
                $min = $response['aggregations']['min' . $toInternalName]['value'] ?? 0;
                $max = $response['aggregations']['max' . $toInternalName]['value'] ?? 0;
                $sum = $response['aggregations']['sum' . $toInternalName]['value'] ?? 0;
                $cardinality = $response['aggregations']['cardinality' . $toInternalName]['value'] ?? 0;

                $propertyWithURL = new PropertyWithURL($property->title,
                    WikiTools::getDisplayTitleForProperty($property->title),
                    $property->type,
                    WikiTools::createURLForProperty($property->title));
                $stat = new Stats($propertyWithURL,
                    $min,
                    $max,
                    $cardinality,
                    $sum
                );
                $stats[] = $stat;
            }
            return new StatsResponse($stats);
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    public function requestFileExtraction(string $fileContent, string $contentType): string
    {
        // TODO: Implement requestFileExtraction() method.
        return "";
    }

    public function requestDocument(string $id): Document
    {
        try {
            $params = $this->getParamForIndex();

            $params['body'] = [
                'query' => ['ids' => ['values' => [$id]]],
            ];

            $response = $this->client->search($params);
            $response = $response->asArray();
            $hits = $response['hits']['hits'] ?? [];
            if (count($hits) === 0) {
                throw new BackendException("No document with ID $id found", 400, null);
            }
            $doc = $hits[0];
            return $this->readDocument($doc);

        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    private function readProperties($properties): array
    {
        $results = [];

        foreach ($properties as $propertyWithType => $values) {
            if (strpos($propertyWithType, '__') === 0) {
                continue;
            }

            list($type, $name) = explode('__', $propertyWithType);
            switch ($type) {
                case 'text':
                case 'number':
                    $facetValues = $values;
                    break;
                case 'datetime':
                    $facetValues = array_map(fn($v) => Helper::fromLongToDateTime($v), $values);
                    break;
                case 'boolean':
                    $facetValues = array_map(fn($v) => $v === 'true', $values);
                    break;
                case 'wikipage':
                    $facetValues = array_map(fn($v) => new MWTitleWithURL(
                        $v['title'],
                        $v['display'],
                        WikiTools::createURLForPage($v['title'])), $values);
                    break;
                default:
                    throw new BackendException("Unknown property type $type");
            }
            $results[] = new PropertyFacetValues(
                new PropertyWithURL($name,
                    WikiTools::getDisplayTitleForProperty($name),
                    Helper::getDatatypeFromInternalName($type),
                    WikiTools::createURLForProperty($name)),
                $facetValues);
        }
        return $this->fillEmptyExtraProperties($results);
    }

    private function readPropertyCounts(array $buckets): array
    {
        $counts = [];

        foreach ($buckets as $bucket) {
            list($type, $name) = explode('__', $bucket['key']);
            $counts[] = new PropertyFacetCount(
                new PropertyWithURL($name,
                    WikiTools::getDisplayTitleForProperty($name),
                    Helper::getDatatypeFromInternalName($type),
                    WikiTools::createURLForProperty($name)
                ),
                $bucket['doc_count']);
        }
        return $counts;
    }

    private function getBaseQuery(BaseQuery $q): array
    {
        $orConditions = [];
        $andConditions = [];
        foreach ($q->getPropertyFacets() as $facet) {
            if (count($facet->getValues()) === 1) {
                $value = $facet->getValues()[0];
                if ($value->isAllValues()) {
                    if ($facet->property->getType() === Datatype::WIKIPAGE) {
                        $must = ['nested' => [
                            'path' => Helper::toInternalName($facet->property),
                            'query' => ['match_all' => new \stdClass()]
                        ]];
                    } else {
                        $must = ['exists' => ['field' => Helper::toInternalName($facet->property)]];
                    }
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
            $orConditions = array_merge($namespaceConditions, $orConditions);
        }

        if (!empty($q->getSearchText())) {
            $fullTextConditions = ['bool' =>
                ['should' => [
                    ['match' => ['__title' => $q->getSearchText()]],
                    ['match' => ['__fulltext' => $q->getSearchText()]]
                ]
                ]
            ];
            $andConditions[] = $fullTextConditions;
        }

        $andConditions[] = ['bool' => ['should' => $orConditions]];


        return ['bool' => ['must' => $andConditions]];

    }

    public function readDocument($doc): Document
    {
        return new Document($doc['_id'],
            $this->readProperties($doc['_source']),
            array_map(fn($c) => new CategoryFacetValue($c, WikiTools::getDisplayTitleForCategory($c), WikiTools::createURLForCategory($c)), $doc['_source']['__categories']),
            array_map(fn($c) => new CategoryFacetValue($c, WikiTools::getDisplayTitleForCategory($c), WikiTools::createURLForCategory($c)), $doc['_source']['__directCategories']),
            new NamespaceFacetValue($doc['_source']['__namespace'], WikiTools::getNamespaceName($doc['_source']['__namespace'])),
            $doc['_source']['__title'],
            $doc['_source']['__display'],
            WikiTools::createURLForPage($doc['_source']['__title'], $doc['_source']['__namespace']),
            $doc['_score'] ?? 0,
            $doc['highlight']['__fulltext'][0] ?? '');
    }

    private function fillEmptyExtraProperties(array $propertyFacetValues)
    {
        global $fs2gExtraPropertiesToRequest;

        foreach($fs2gExtraPropertiesToRequest as $extraProperty) {
            if (count(array_filter($propertyFacetValues, fn($p) => $p->property->title === $extraProperty->title)) === 0) {
                $displayTitle = WikiTools::getDisplayTitleForProperty($extraProperty->title);
                $propertyWithUrl = new PropertyWithURL(
                    $extraProperty->title,
                    $displayTitle,
                    $extraProperty->type,
                    WikiTools::createURLForProperty($extraProperty->title)
                );
                $propertyFacetValues[] = new PropertyFacetValues($propertyWithUrl, []);
            }
        }
        return $propertyFacetValues;
    }

    private function fillEmptyCategoryFacetCounts(DocumentsResponse $docResponse, DocumentQuery $q): void
    {
        $categoriesInFacetCounts = array_map(fn($e) => $e->category, $docResponse->categoryFacetCounts);
        foreach ($q->categoryFacets as $c) {
            if (!in_array($c, $categoriesInFacetCounts)) {
                $docResponse->categoryFacetCounts[] = new CategoryFacetCount($c, WikiTools::getDisplayTitleForCategory($c), 0);
            }
        }
    }

    private function recalculateNamespaceCountsIfNecessary(DocumentsResponse $docResponse, DocumentQuery $q): void
    {
        if (count($q->namespaceFacets) === 0) {
            return;
        }
        $baseQuery = clone $q;
        $baseQuery->setNamespaceFacets([]);
        $baseQuery->setLimit(0);
        $documentsResponse = $this->requestDocuments($baseQuery);
        $docResponse->namespaceFacetCounts = $documentsResponse->namespaceFacetCounts;
    }
}
