<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Datatype;
use DIQA\FacetedSearch2\Model\DocumentQuery;
use DIQA\FacetedSearch2\Model\Order;
use DIQA\FacetedSearch2\Model\Property;
use DIQA\FacetedSearch2\Model\PropertyFacet;
use DIQA\FacetedSearch2\Model\Sort;

class Client
{


    public function request(DocumentQuery $documentQuery)
    {

    }

    private function getParams(string $searchText,
                               array $propertyFacetConstraints, /* @var PropertyFacet[] */
                               array $categoryFacets, /* @var string [] */
                               array $namespaceFacets, /* @var number[] */
                               array $extraProperties, /* @var PropertyFacet[] */
                               array $sorts, /* @var Sort[] */
                               int $limit,
                               int $offset)
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

        $extraPropertiesAsStrings = array_map(fn(Property $e) => Helper::encodePropertyTitleAsValue($e->property, $e->type), $extraProperties);

        $params = [];
        $params['defType'] = 'edismax';
        $params['boost'] = 'max(smwh_boost_dummy)';
        $params['facet'] = 'true';
        $params['facet.field'] = ['smwh_categories', 'smwh_attributes', 'smwh_properties', 'smwh_namespace_id'];

        $propertyFacetsConstraintsWithNullValue = array_filter($propertyFacetConstraints, fn(PropertyFacet $f) => is_null($f->value));
        foreach ($propertyFacetsConstraintsWithNullValue as $v) {
            /* @var $v PropertyFacet */
            $params['facet.field'] = Helper::encodePropertyTitleAsFacet($v->property, $v->type);
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
        $params['rows'] = $limit;
        $params['start'] = $offset;
        $params['sort'] = self::serializeSorts($sorts);
        $params['wt'] = 'json';


        $propertyFacetsConstraintsWithNotNullValue = array_filter($propertyFacetConstraints, fn(PropertyFacet $f) => !is_null($f->value));
        $fq = self::encodePropertyFacetValues($propertyFacetsConstraintsWithNotNullValue);

        $fq = $fq + self::encodeCategoryFacets($categoryFacets);
        $fq = $fq + self::encodeNamespaceFacets($namespaceFacets);
        $params['fq'] = $fq;

        $params['q.alt'] = $searchText === '' ? 'smwh_search_field:(*)' : self::encodeQuery(preg_split("/\s+/", $searchText));

        return $params;
    }

    private static function encodePropertyFacetValues(array $facets/* @var PropertyFacet[] */): array
    {
        $facetValues = [];

        foreach ($facets as $f) {
            /* @var $f PropertyFacet */
            if ($f->type === Datatype::WIKIPAGE) {
                $pAsValue = 'smwh_properties:' . Helper::encodePropertyTitleAsValue($f->property, Datatype::WIKIPAGE);
                if (!in_array($pAsValue, $facetValues)) {
                    $facetValues[] = $pAsValue;
                }
                $p = Helper::encodePropertyTitleAsProperty($f->property, Datatype::WIKIPAGE);
                $value = Helper::quoteValue($f->mwTitle->title . '|' . $f->mwTitle->displayTitle);
                $facetValues[] = $p . ':' . $value;
            } else {
                $pAsValue = 'smwh_attributes:' . Helper::encodePropertyTitleAsValue($f->property, $f->type);
                if (!in_array($pAsValue, $facetValues)) {
                    $facetValues[] = $pAsValue;
                }
                $p = Helper::encodePropertyTitleAsProperty($f->property, $f->type);
                $value = '';
                if ($f->type === Datatype::STRING || $f->type === Datatype::NUMBER || $f->type === Datatype::BOOLEAN) {
                    $value = Helper::quoteValue($f->value);
                } else if ($f->type === Datatype::DATETIME) {
                    $value = $f->value;
                } else if (!is_null($f->range)) {
                    $value = self::encodeRange($f->range, $f->type);
                }
                $facetValues[] = "$p:$value";
            }
        }
        return $facetValues;
    }

    private static function encodeRange(Range $range, $type): string
    {
        if ($type === Datatype::DATETIME) {
            return Helper::serializeDate($range->from) . " TO " . Helper::serializeDate($range->to);
        }
        return $range->from . " TO " . $range->to;
    }

    private static function encodeCategoryFacets(array $categories/* @var string[] */): array
    {
        $facetValues = [];
        foreach ($categories as $category) {
            $pAsValue = 'smwh_categories:' . Helper::encodeWhitespacesInTitles($category);
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
            $pAsValue = 'smwh_namespace_id:' . Helper::encodeWhitespacesInTitles($namespace);
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
                $property = Helper::encodePropertyTitleAsProperty($s->property->property, $s->property->type);
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

}
