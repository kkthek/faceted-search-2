<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Datatype;
use DIQA\FacetedSearch2\Model\MWTitle;
use DIQA\FacetedSearch2\Model\Property;
use DIQA\FacetedSearch2\Model\Range;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetValues;
use DIQA\FacetedSearch2\Model\Response\SolrDocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetCount;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetValue;
use DIQA\FacetedSearch2\Model\Response\Document;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetCount;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetValue;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetCount;
use DIQA\FacetedSearch2\Model\Response\PropertyResponse;
use DIQA\FacetedSearch2\Model\Response\PropertyValueCount;
use DIQA\FacetedSearch2\Model\Response\RangeValueCounts;
use DIQA\FacetedSearch2\Model\Response\SolrStatsResponse;
use DIQA\FacetedSearch2\Model\Response\Stats;
use DIQA\FacetedSearch2\Model\Response\ValueCount;

class SolrResponseParser {

    private const RELATION_REGEX = "/^smwh_(.*)_t$/";
    private const RELATION_FROM_FACET_REGEX = "/^smwh_(.*)_s$/";
    private const ATTRIBUTE_REGEX = "/smwh_(.*)_xsdvalue_(.*)/";

    private $body;

    /**
     * SolrResponseParser constructor.
     * @param $body
     */
    public function __construct($body)
    {
        $this->body = $body;
    }

    public function parse() {
        $docs = [];
        foreach ($this->body->response->docs as $doc) {
            $propertyFacets = []; /* @var PropertyFacetValues[] */
            $categoryFacets = []; /* @var CategoryFacetValue[] */
            $directCategoryFacets = []; /* @var CategoryFacetValue[] */
            $namespace = null;
            $properties = []; /* @var Property[] */;
            foreach ($doc as $property => $value) {
                    if (self::startsWith($property, "smwh_namespace_id")) {
                        $namespace = new NamespaceFacetValue($value, "", "");
                    } else if (self::startsWith($property, "smwh_categories")) {
                        $categoryFacets = array_map(fn($category) => new CategoryFacetValue(
                            Helper::decodeWhitespacesInTitle($category),
                            Helper::decodeWhitespacesInTitle($category),
                            ""
                        ), $value);

                    } else if (self::startsWith($property, "smwh_directcategories")) {
                        $directCategoryFacets = array_map(fn($category) => new CategoryFacetValue(
                            Helper::decodeWhitespacesInTitle($category),
                            Helper::decodeWhitespacesInTitle($category),
                            ""
                        ), $value);

                    } else if (self::startsWith($property, "smwh_attributes")) {
                        $properties = $properties + $this->parseProperties($value);
                    } else if (self::startsWith($property, "smwh_properties")) {
                        $properties = $properties + $this->parseProperties($value);
                    } else if (self::startsWith($property, "smwh_")) {
                        $item = $this->parsePropertyWithValues($property, $value);
                        if (!is_null($item)) {
                            $propertyFacets[] = $item;
                        }
                    }
            }
            $docs[] = new Document(
                $doc->id,
                $propertyFacets,
                $categoryFacets,
                $directCategoryFacets,
                $namespace,
                $properties,
                $doc->smwh_title,
                $doc->smwh_displaytitle,
                "",
                $doc->score,
                isset($this->body->highlighting) ? $this->body->highlighting->{$doc->id}->smwh_search_field[0] : null
            );

        }
        $smwh_categories = $this->body->facet_counts->facet_fields->smwh_categories ?? [];
        $categoryFacetCounts = []; /* @var CategoryFacetCount[] */
        foreach ($smwh_categories as $category => $count) {
            $categoryFacetCounts[] = new CategoryFacetCount($category, $count);
        }
        $smwh_properties = $this->body->facet_counts->facet_fields->smwh_properties ?? [];
        $propertyFacetCounts = []; /* @var PropertyFacetCount[] */
        foreach ($smwh_properties as $property => $count) {
            $propertyFacetCounts[] = new PropertyFacetCount($this->parseProperty($property, self::RELATION_REGEX), $count);
        }
        $smwh_namespaces = $this->body->facet_counts->facet_fields->smwh_namespace_id ?? [];
        $namespaceFacetCounts = []; /* @var NamespaceFacetCount[] */
        foreach ($smwh_namespaces as $namespace => $count) {
            $namespaceFacetCounts[] = new NamespaceFacetCount($namespace, "", $count);
        }

        $propertyValueCount= [] /* @var PropertyValueCount[] */;
        foreach ($this->body->facet_counts->facet_fields as $p => $values) {
                if ($p === 'smwh_categories' || $p === 'smwh_attributes' || $p === 'smwh_properties' || $p === 'smwh_namespace_id') continue;
                $property = $this->parseProperty($p, self::RELATION_FROM_FACET_REGEX);
                $valueCounts = [] /* @var ValueCount[] */;
               foreach($values as $v => $count) {
                $valueCounts[] = new ValueCount($v, $count);
               }
                $propertyValueCount[] = new PropertyValueCount($property, $valueCounts);
        }

        return new SolrDocumentsResponse(
            $this->body->response->numFound,
            $docs,
            $categoryFacetCounts,
            $propertyFacetCounts,
            $namespaceFacetCounts,
            $propertyValueCount
        );

    }

    public function parseStatsResponse() {

        $stats = [] /* @var Stats[] */;
        if ( isset($this->body->stats->stats_fields)) {
            foreach($this->body->stats->stats_fields as $p => $info) {
                $property = $this->parsePropertyFromStats($p);
                if (!is_null($property)) {
                    $stat = new Stats($property,
                        $info->max,
                        $info->min,
                        $info->count,
                        $info->sum
                    );
                    $stats[] = $stat;
                }
            }
        }

        $r = null;
        $rangeValueCounts = [] /* @var RangeValueCounts[] */;
        foreach ($this->body->facet_counts->facet_queries as $key => $count) {
            $propertyRange = explode(':', $key);
            $property = $this->parsePropertyFromStats($propertyRange[0]);
            preg_match_all("/\[(.*) TO (.*)\]/", $propertyRange[1], $range);

            if ($property->getType() === Datatype::DATETIME || $property->getType() === Datatype::NUMBER) {
                $r = new Range();
                $r->from = $range[1][0];
                $r->to = $range[2][0];
            } else {
                continue;
            }

            $rangeValueCounts[] = new RangeValueCounts($property, $r, $count);
        }
        return new SolrStatsResponse($rangeValueCounts, $stats);
    }

    private function parsePropertyWithValues(string $property, $values): ?PropertyFacetValues {
        $num = preg_match_all(self::ATTRIBUTE_REGEX, $property, $nameType);
        if ($num === 0) {
            // maybe a relation facet
            preg_match_all(self::RELATION_REGEX, $property, $nameType);
            if ($num > 0) {
                 $name = $nameType[1][0];
                 return $this->parsePropertyValues($name, $values);
            }
            return null;
        }
        $name = $nameType[1][0];
        $type = $nameType[2][0];
        return $this->parseAttributeValues($name, $values, $type);

    }

    private function parsePropertyValues(string $name, array $values /* @var string[] */): PropertyFacetValues {
        return new PropertyFacetValues(
            new PropertyResponse(Helper::decodeWhitespacesInProperty($name),
                Datatype::WIKIPAGE,
                ""
            ),
            array_map(function($e) {
                    $parts = explode("|", $e);
                    return new MWTitle($parts[0], $parts[1]);
                }, $values));

    }

    private function parseAttributeValues(string $name, array $values, string $type): PropertyFacetValues {
        $decodedPropertyName = Helper::decodeWhitespacesInProperty($name);

        switch ($type) {
            case 'd':
            case 'i':
                // numeric
            return new PropertyFacetValues(
                new PropertyResponse($decodedPropertyName,
                    Datatype::NUMBER,
                    ""
                ),
                $values);
            case 'dt':
                // date
                return new PropertyFacetValues(
                    new PropertyResponse($decodedPropertyName,
                        Datatype::DATETIME,
                        ""
                    ),
                    $values);
            case 'b':
                // boolean
                return new PropertyFacetValues(
                    new PropertyResponse($decodedPropertyName,
                        Datatype::BOOLEAN,
                        ""
                    ),
                    $values);
            case 's':
                // string or anything else
            default:
            return new PropertyFacetValues(
                new PropertyResponse($decodedPropertyName,
                    Datatype::STRING,
                    ""
                ),
                $values);
        }

    }

    private function parseProperties(array $propertyList): array
    {
        $properties = [] /* @var Property[] */;
        foreach($propertyList as $property) {
            $properties[] = $this->parseProperty($property, self::RELATION_REGEX);
        }
        return $properties;
    }



    private function parseProperty(string $property, $relationRegex): PropertyResponse {
        $num = preg_match_all(self::ATTRIBUTE_REGEX, $property, $nameType);
        if ($num === 0) {
            // maybe a relation facet
            $num = preg_match_all($relationRegex, $property, $nameType);
            if ($num > 0) {
                $name = $nameType[1][0];
                $name = Helper::decodeWhitespacesInProperty($name);
                return new PropertyResponse($name, Datatype::WIKIPAGE, "");
            }

        }
        $name = $nameType[1][0];
        $type = $nameType[2][0];
        $name = Helper::decodeWhitespacesInProperty($name);

        switch($type) {
            case 'd':
            case 'i':
                $datatype = Datatype::NUMBER;
                break;
            case 'b':
                $datatype = Datatype::BOOLEAN;
                break;
            case 'dt':
                $datatype = Datatype::DATETIME;
                break;
            case 's':
            default:
                $datatype = Datatype::STRING;
        }
        return new PropertyResponse($name, $datatype, "");
    }

    private function parsePropertyFromStats(string $property): ?PropertyResponse {

        $num = preg_match_all("/smwh_(.*)_datevalue_l/", $property, $name);
        if ($num === 0) {
            $num = preg_match_all("/smwh_(.*)_xsdvalue_d/", $property, $name);
            if ($num === 0) {
                return null;
            }
            return new PropertyResponse(Helper::decodeWhitespacesInProperty($name[1][0]), Datatype::DATETIME, "");
        }
        return new PropertyResponse(Helper::decodeWhitespacesInProperty($name[1][0]), Datatype::NUMBER, "");
    }

    private static function startsWith($string, $query){
        return substr($string, 0, strlen($query)) === $query;
    }
}
