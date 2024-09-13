<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\ChemExtension\Pages\ChemForm;
use DIQA\ChemExtension\Utils\CurlUtil;
use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\Order;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\Sort;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Model\Response\SolrDocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\SolrStatsResponse;
use Exception;

class Client
{


    public function requestDocuments(DocumentQuery $q): SolrDocumentsResponse
    {
        $queryParams = $this->getParams($q->searchText, $q->propertyFacets, $q->categoryFacets,
        $q->namespaceFacets, $q->extraProperties);
        $sortsAndLimits = $this->getSortsAndLimits($q->sorts, $q->limit, $q->offset);
        $queryParams = array_merge($queryParams, $sortsAndLimits);

        $response =  new SolrResponseParser($this->requestSOLR($queryParams));
        return $response->parse();
    }

    public function requestStats(StatsQuery $q): SolrStatsResponse
    {
        $queryParams = $this->getParams($q->searchText, $q->propertyFacets, $q->categoryFacets,
            $q->namespaceFacets, []);
        $queryParams['stats'] = 'true';
        $statsFields = [];
        foreach($q->statsProperties as $p) {
            $statsFields[] = Helper::generateSOLRPropertyForSearch($p->property, $p->type);
        }
        $queryParams['stats.field'] = $statsFields;
        $response =  new SolrResponseParser($this->requestSOLR($queryParams));
        return $response->parseStatsResponse();
    }

    public function requestFacet(FacetQuery $q): SolrStatsResponse
    {
        $queryParams = $this->getParams($q->searchText, $q->propertyFacets, $q->categoryFacets,
            $q->namespaceFacets, []);

        $facetQueries = [];
        foreach($q->facetQueries as $p) {
            $property = Helper::generateSOLRPropertyForSearch($p->property, $p->type);
            $range = self::encodeRange($p->range, $p->type);
            $facetQueries[] = $property .":[" . $range . "]";
        }
        $queryParams['facet.query'] = $facetQueries;
        //print_r($queryParams);die();
        $response =  new SolrResponseParser($this->requestSOLR($queryParams));
        return $response->parseStatsResponse();
    }

    private function getParams(string $searchText,
                               array $propertyFacetConstraints, /* @var PropertyFacet[] */
                               array $categoryFacets, /* @var string [] */
                               array $namespaceFacets, /* @var number[] */
                               array $extraProperties /* @var PropertyFacet[] */
                              )
    {


        $defaultProperties = [
            'smwh__MDAT_datevalue_l',
            'smwh_categories',
            'smwh_directcategories',
            'smwh_attributes',
            'smwh_properties',
            'smwh_title',
            'smwh_namespace_id',
            'id',
            'score',
            'smwh_displaytitle'
        ];

        $extraPropertiesAsStrings = array_map(fn(Property $e) => Helper::generateSOLRProperty($e->property, $e->type), $extraProperties);

        $params = [];
        $params['defType'] = 'edismax';
        //$params['boost'] = 'max(smwh_boost_dummy)';
        $params['facet'] = 'true';
        $params['facet.field'] = ['smwh_categories', 'smwh_attributes', 'smwh_properties', 'smwh_namespace_id'];

        $propertyFacetsConstraintsWithNullValue = array_filter($propertyFacetConstraints, fn(PropertyFacet $f) => is_null($f->value)
        && is_null($f->range) && is_null($f->mwTitle));
        foreach ($propertyFacetsConstraintsWithNullValue as $v) {
            /* @var $v PropertyFacet */
            $params['facet.field'] = Helper::generateSOLRPropertyForSearch($v->property, $v->type);
        }

        $params['facet.mincount'] = '1';
        $params['json.nl'] = 'map';
        $params['fl'] = implode(",", array_merge($defaultProperties, $extraPropertiesAsStrings));
        if ($searchText !== '') {
            $params['hl'] = 'true';
        }
        $params['hl.fl'] = 'smwh_search_field';
        $params['hl.simple-pre'] = '<b>';
        $params['hl.simple-post'] = '</b>';
        $params['hl.fragsize'] = '250';
        $params['searchText'] = $searchText === '' ? '(*)' : $searchText;

        $params['wt'] = 'json';



        $fq = self::encodePropertyFacetValues($propertyFacetConstraints);
        $fq = array_merge($fq, self::encodeCategoryFacets($categoryFacets));
        $fq = array_merge($fq, self::encodeNamespaceFacets($namespaceFacets));
        $params['fq'] = $fq;

        $params['q.alt'] = $searchText === '' ? 'smwh_search_field:(*)' : self::encodeQuery(preg_split("/\s+/", $searchText));

        return $params;
    }

    private function getSortsAndLimits(array $sorts /* @var Sort[] */, $limit, $offset) {
        $params = [];
        $params['rows'] = $limit;
        $params['start'] = $offset;
        $params['sort'] = self::serializeSorts($sorts);
        return $params;
    }

    private static function encodePropertyFacetValues(array $facets/* @var PropertyFacet[] */): array
    {
        $facetValues = [];

        foreach ($facets as $f) {
            /* @var $f PropertyFacet */
            if ($f->type === Datatype::WIKIPAGE) {
                $pAsValue = 'smwh_properties:' . Helper::generateSOLRProperty($f->property, Datatype::WIKIPAGE);
                if (!in_array($pAsValue, $facetValues)) {
                    $facetValues[] = $pAsValue;
                }
                $p = Helper::generateSOLRPropertyForSearch($f->property, Datatype::WIKIPAGE);
                $value = Helper::quoteValue($f->mwTitle->title . '|' . $f->mwTitle->displayTitle, Datatype::WIKIPAGE);
                $facetValues[] = $p . ':' . $value;
            } else {
                $pAsValue = 'smwh_attributes:' . Helper::generateSOLRProperty($f->property, $f->type);
                if (!in_array($pAsValue, $facetValues)) {
                    $facetValues[] = $pAsValue;
                }
                $p = Helper::generateSOLRPropertyForSearch($f->property, $f->type);
                $value = '';

                if (!is_null($f->range)) {
                    $value = "[".self::encodeRange($f->range, $f->type)."]";
                    $facetValues[] = "$p:$value";
                } else if (!is_null($f->value) && ($f->type === Datatype::STRING || $f->type === Datatype::NUMBER || $f->type === Datatype::BOOLEAN
                            || $f->type === Datatype::DATETIME)) {
                    $value = Helper::quoteValue($f->value, $f->type);
                    $facetValues[] = "$p:$value";
                }
            }
        }
        return $facetValues;
    }

    private static function encodeRange(Range $range, $type): string
    {
        if ($type === Datatype::DATETIME) {
            return Helper::convertDateTimeToLong($range->from) . " TO " . Helper::convertDateTimeToLong($range->to);
        }
        return $range->from . " TO " . $range->to;
    }

    private static function encodeCategoryFacets(array $categories/* @var string[] */): array
    {
        $facetValues = [];
        foreach ($categories as $category) {
            $pAsValue = 'smwh_categories:' . Helper::quoteValue($category, Datatype::WIKIPAGE);
            if (!in_array($pAsValue, $facetValues)) {
                $facetValues[] = $pAsValue;
            }
        }
        return $facetValues;
    }

    private static function encodeNamespaceFacets(array $namespaces/* @var int[] */): array
    {
        $facetValues = [];
        foreach ($namespaces as $namespace) {
            $pAsValue = 'smwh_namespace_id:' . $namespace;
            if (!in_array($pAsValue, $facetValues)) {
                $facetValues[] = $pAsValue;
            }
        }
        return $facetValues;
    }

    private static function serializeSorts(array $sorts): string
    {
        $arr = array_map(function (Sort $s) {
            $order = $s->order === Order::DESC ? 'desc' : 'asc';
            if ($s->property->type === Datatype::INTERNAL) {
                if ($s->property->property === 'score') {
                    return "score $order";
                } else if ($s->property->property === 'displaytitle') {
                    return "smwh_displaytitle $order";
                }
            } else {
                $property = Helper::generateSOLRPropertyForSearch($s->property->property, $s->property->type);
                return "$property $order";
            }
        }, $sorts);

        return implode(", ", $arr);
    }

    private static function encodeQuery(array $terms): string
    {
        $searchTerms = implode(' AND ', $terms);
        $searchTermsWithPlus = implode(' AND ', array_map(fn($e) => "+$e", $terms));

        return "smwh_search_field:(${searchTermsWithPlus}* ) OR "
            . "smwh_search_field:(${searchTerms}) OR "
            . "smwh_title:(${searchTerms}) OR "
            . "smwh_displaytitle:(${searchTerms})";
    }

    private function requestSOLR(array $queryParams)
    {
        try {
            $headerFields = [];
            $headerFields[] = "Content-Type: application/x-www-form-urlencoded; charset=UTF-8";
            $headerFields[] = "Expect:"; // disables 100 CONTINUE
            $ch = curl_init();
            $queryString = self::buildQueryParams($queryParams);
            $url = "http://localhost:8983/solr/mw/select";  //TODO: make configurable

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $queryString);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headerFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, 20); //timeout in seconds

            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
                throw new Exception("Error on request: $error_msg");
            }
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            list($header, $body) = Util::splitResponse($response);
            if ($httpcode >= 200 && $httpcode <= 299) {

                return json_decode($body);

            }
            throw new Exception("Error on select-request. HTTP status: $httpcode. Message: $body");

        } finally {
            curl_close($ch);
        }
    }



    private static function buildQueryParams(array $params) {
        $encodedParams = [];

        foreach($params as $key => $value) {
            if (is_array($value)) {
                $encodedParams = array_merge($encodedParams, array_map(fn($e) => "$key=".urlencode($e), $value));
            } else {
                $encodedParams[] = "$key=".urlencode($value);
            }
        }

        return implode("&", $encodedParams);
    }

}
