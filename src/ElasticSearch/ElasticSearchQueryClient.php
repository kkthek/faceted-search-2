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
use DIQA\FacetedSearch2\Model\Response\Document;
use DIQA\FacetedSearch2\Model\Response\DocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\FacetResponse;
use DIQA\FacetedSearch2\Model\Response\StatsResponse;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\ServerResponseException;
use Exception;
use Smalot\PdfParser\Parser;

class ElasticSearchQueryClient extends AbstractElasticSearchClient implements FacetedSearchClient
{

    private QueryResponseParser $queryResponseParser;

    public function __construct($client = null)
    {
        parent::__construct($client);
        $this->queryResponseParser = new QueryResponseParser();
    }

    /**
     * @throws BackendException
     */
    public function requestDocuments(DocumentQuery $q): DocumentsResponse
    {

        try {
            $params = $this->getParamForIndex();
            $query = $this->getBaseQuery($q);

            $extraProperties = array_map(fn($p) => Helper::toInternalName($p), $q->getExtraProperties());
            $includedProperties = ['__title', '__display', '__fulltext', '__categories', '__namespace', '__directCategories'];
            $includedProperties = array_merge($includedProperties, $extraProperties);
            $sorts = array_map(fn($s) => [
                Helper::toInternalName($s->property) => ['order' => $s->order === Order::ASC ? 'asc' : 'desc']
            ], $q->getSorts());

            $query = $this->fillMustConditionIfNecessary($query);

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
                'sort' => $sorts
            ];


            $response = $this->client->search($params);
            $response = $response->asArray();

            $documentsResponse = $this->queryResponseParser->parseDocumentsResponse($response, $q);
            $this->fillEmptyCategoryFacetCounts($documentsResponse, $q);
            $this->recalculateNamespaceCountsIfNecessary($documentsResponse, $q);
            return $documentsResponse;
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    /**
     * @throws BackendException
     */
    public function requestFacets(FacetQuery $q): FacetResponse
    {
        try {
            $params = $this->getParamForIndex();
            $query = $this->getBaseQuery($q);
            $aggs = [];
            $this->addPropertyValuesConstraints($q, $query, $aggs);
            $this->addClusterRangeConstraints($q, $aggs);
            $query = $this->fillMustConditionIfNecessary($query);
            $params['body'] = [
                'query' => $query,
                'size' => 0
            ];

            if (count($aggs) > 0) {
                $params['body']['aggs'] = $aggs;
            }

            $response = $this->client->search($params);
            $response = $response->asArray();

            $propertyValueCounts = $this->queryResponseParser->parsePropertyValueCounts($q, $response['aggregations']);
            return new FacetResponse($propertyValueCounts);
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    /**
     * @throws BackendException
     */
    public function requestStats(StatsQuery $q): StatsResponse
    {
        try {
            $params = $this->getParamForIndex();
            $query = $this->getBaseQuery($q);
            $query = $this->fillMustConditionIfNecessary($query);
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
            $stats = $this->queryResponseParser->parseStats($q, $response['aggregations']);
            return new StatsResponse($stats);
        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    /**
     * @throws BackendException
     */
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
            return $this->queryResponseParser->parseDocument($doc);

        } catch (ClientResponseException|ServerResponseException $e) {
            throw BackendException::create($e);
        }
    }

    private function getBaseQuery(BaseQuery $q): array
    {
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
                $orConditions = array_map(fn($v) => Helper::mapFacetQueryToESModel($facet->getProperty(), $v), $facet->getValues());
                $andConditions[] = ['bool' => ['should' => $orConditions]];
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
            $andConditions[] = ['bool' => ['should' => $namespaceConditions]];
        }

        if (!empty($q->getSearchText())) {
            $fullTextConditions = ['bool' =>
                ['should' => [
                    ['multi_match' => [
                        'query' => $q->getSearchText(),
                        'fields' => ['__title^3', '__fulltext'],
                        'operator' => 'and',
                        'type' => 'best_fields',  // default; finds the best single field
                    ]],
                ]]
            ];
            $andConditions[] = $fullTextConditions;
        }

        $query = ['bool' => ['must' => $andConditions]];

        $boostConstraints = $this->getBoostConstraints();
        if (count($boostConstraints) > 0) {
            $query['bool']['should'] = $boostConstraints;
        }

        return $query;
    }

    private function getBoostConstraints(): array
    {
        global $fs2gCategoryBoosts, $fs2gNamespaceBoosts, $fs2gTemplateBoosts;
        $boostConstraints = [];
        foreach ($fs2gCategoryBoosts as $category => $boost) {
            $boostConstraints[] = ['terms' => ['__categories' => [$category], 'boost' => $boost]];
        }
        foreach ($fs2gNamespaceBoosts as $namespace => $boost) {
            $boostConstraints[] = ['terms' => ['__namespace' => [$namespace], 'boost' => $boost]];
        }
        foreach ($fs2gTemplateBoosts as $template => $boost) {
            $boostConstraints[] = ['terms' => ['__templates' => [$template], 'boost' => $boost]];
        }
        return $boostConstraints;
    }

    private function fillEmptyCategoryFacetCounts(DocumentsResponse $docResponse, DocumentQuery $q): void
    {
        $categoriesInFacetCounts = array_map(fn($e) => $e->category, $docResponse->categoryFacetCounts);
        foreach ($q->categoryFacets as $c) {
            if (!in_array($c, $categoriesInFacetCounts)) {
                $docResponse->categoryFacetCounts[] = CategoryFacetCount::fromCategory($c, 0);
            }
        }
    }

    /**
     * @throws BackendException
     */
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


    /**
     * @throws BackendException
     */
    public function addClusterRangeConstraints(FacetQuery $q, array &$aggs): void
    {
        if (count($q->getRangeQueries()) === 0) {
            return;
        }
        $statsQuery = new StatsQuery();
        $statsQuery->updateQuery($q);

        $statsQuery->setStatsProperties($q->getRangeQueries());
        $statsResponse = $this->requestStats($statsQuery);

        foreach ($statsResponse->getStats() as $stat) {
            if ($stat->min == '19700101000000' && $stat->max == '19700101000000') {
                continue;
            }
            $toInternalName = Helper::toInternalName($stat->getProperty());
            $clusters = array_map(function (Range $r) use ($stat) {
                $to = $r->getTo();
                $from = $r->getFrom();

                return [
                    'from' => $from,
                    'to' => $from == $to ? Helper::plusOneSecond($to) : $to
                ];
            }, $stat->clusters);

            $aggs[$toInternalName] = [
                'range' => ['field' => $toInternalName,
                    'ranges' => $clusters]

            ];
        }


    }

    public function addPropertyValuesConstraints(FacetQuery $q, array &$query, array &$aggs): void
    {
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
                                'terms' => [
                                    ['field' => $toInternalName . '.title'],
                                    ['field' => $toInternalName . '.display']
                                ],
                                'size' => $pvq->getValueLimit() ?? 1000,
                            ],
                        ]

                    ]
                ];
                if (!is_null($pvq->getValueContains())) {
                    $words = preg_split('/\s+/', trim($pvq->getValueContains()), -1, PREG_SPLIT_NO_EMPTY);
                    $wordClauses = array_map(fn($w) => [
                        'wildcard' => [
                            $toInternalName . '.display' => [
                                'value' => "*{$w}*",
                                'case_insensitive' => true,
                            ],
                        ],
                    ], $words);
                    $andConditions[] = ['nested' => [
                        'path' => $toInternalName,
                        'query' => $wordClauses
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
                    $words = preg_split('/\s+/', trim($pvq->getValueContains()), -1, PREG_SPLIT_NO_EMPTY);

                    $wordClauses = array_map(fn($w) => [
                        'wildcard' => [
                            $toInternalName => [
                                'value' => "*{$w}*",
                                'case_insensitive' => true,
                            ],
                        ],
                    ], $words);

                    $andConditions[] = ['bool' => ['must' => $wordClauses]];
                }
            }
        }


        $query['bool']['must'] = array_merge($andConditions, $query['bool']['must']);
    }

    public function fillMustConditionIfNecessary(array $query): array
    {
        $query['bool']['must'] = count($query['bool']['must']) > 0 ? $query['bool']['must'] : ['match_all' => new \stdClass()];
        return $query;
    }

}
