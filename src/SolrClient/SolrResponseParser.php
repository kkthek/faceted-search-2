<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;
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
use DIQA\FacetedSearch2\Model\Response\SolrFacetResponse;
use DIQA\FacetedSearch2\Model\Response\SolrStatsResponse;
use DIQA\FacetedSearch2\Model\Response\Stats;
use DIQA\FacetedSearch2\Model\Response\ValueCount;
use DIQA\FacetedSearch2\Utils\WikiTools;

class SolrResponseParser {

    private $body;

    /**
     * SolrResponseParser constructor.
     * @param $body
     */
    public function __construct($body)
    {
        $this->body = $body;

    }

    public function parse(): SolrDocumentsResponse {
        $docs = [];
        foreach ($this->body->response->docs as $doc) {
            $propertyFacets = []; /* @var PropertyFacetValues[] */
            $categoryFacets = []; /* @var CategoryFacetValue[] */
            $directCategoryFacets = []; /* @var CategoryFacetValue[] */
            $namespace = null;
            $properties = []; /* @var Property[] */;
            foreach ($doc as $property => $value) {
                    if (self::startsWith($property, "smwh_namespace_id")) {
                        $namespace = new NamespaceFacetValue($value, WikiTools::getNamespaceName($value));
                    } else if (self::startsWith($property, "smwh_categories")) {
                        $categoryFacets = array_map(fn($category) => new CategoryFacetValue(
                            $category,
                            WikiTools::getDisplayTitleForCategory($category),
                            WikiTools::createURLForCategory($category)
                        ), $value);

                    } else if (self::startsWith($property, "smwh_directcategories")) {
                        $directCategoryFacets = array_map(fn($category) => new CategoryFacetValue(
                            $category,
                            WikiTools::getDisplayTitleForCategory($category),
                            WikiTools::createURLForCategory($category)
                        ), $value);

                    } else if (self::startsWith($property, "smwh_attributes")) {
                        $properties = array_merge($properties, $this->parseProperties($value));
                    } else if (self::startsWith($property, "smwh_properties")) {
                        $properties = array_merge($properties, $this->parseProperties($value));
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
                WikiTools::createURLForPage($doc->smwh_title, $namespace->namespace),
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
            $propertyFacetCount = new PropertyFacetCount($this->parseProperty($property), $count);
            if (!is_null($propertyFacetCount)) {
                $propertyFacetCounts[] = $propertyFacetCount;
            }
        }
        $smwh_attributes = $this->body->facet_counts->facet_fields->smwh_attributes ?? [];
        foreach ($smwh_attributes as $property => $count) {
            $propertyFacetCount = new PropertyFacetCount($this->parseProperty($property), $count);
            if (!is_null($propertyFacetCount)) {
                $propertyFacetCounts[] = $propertyFacetCount;
            }
        }
        $smwh_namespaces = $this->body->facet_counts->facet_fields->smwh_namespace_id ?? [];
        $namespaceFacetCounts = []; /* @var NamespaceFacetCount[] */
        foreach ($smwh_namespaces as $namespace => $count) {
            $namespaceFacetCounts[] = new NamespaceFacetCount($namespace, WikiTools::getNamespaceName($namespace), $count);
        }

        $propertyValueCount= [] /* @var PropertyValueCount[] */;
        foreach ($this->body->facet_counts->facet_fields as $p => $values) {
                if ($p === 'smwh_categories' || $p === 'smwh_attributes' || $p === 'smwh_properties' || $p === 'smwh_namespace_id') continue;
                $property = $this->parseProperty($p);
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

    public function parseStatsResponse(): SolrStatsResponse {

        $stats = [] /* @var Stats[] */;
        if ( isset($this->body->stats->stats_fields)) {
            foreach($this->body->stats->stats_fields as $p => $info) {
                $property = $this->parsePropertyFromStats($p);
                if (!is_null($property)) {
                    $stat = new Stats($property,
                        $info->min,
                        $info->max,
                        $info->count,
                        $info->sum
                    );
                    $stats[] = $stat;
                }
            }
        }

        return new SolrStatsResponse($stats);
    }

    public function parseFacetResponse(): SolrFacetResponse {
        $r = null;
        $rangeValueCounts = [] /* @var RangeValueCounts[] */;
        foreach ($this->body->facet_counts->facet_queries as $key => $count) {
            $propertyRange = explode(':', $key);
            $property = $this->parsePropertyFromStats($propertyRange[0]);
            preg_match_all("/\[(.*) TO (.*)\]/", $propertyRange[1], $range);

            if ($property->getType() === Datatype::DATETIME || $property->getType() === Datatype::NUMBER) {
                $r = new Range($range[1][0], $range[2][0]);

            } else {
                continue;
            }

            $rangeValueCounts[] = new RangeValueCounts($property, $r, $count);
        }
        return new SolrFacetResponse($rangeValueCounts);

    }

    private function parsePropertyWithValues(string $property, $values): ?PropertyFacetValues {
        list($name, $type) = Helper::parseSOLRProperty($property);
        if (is_null($name)) return null;
        $displayTitle = WikiTools::getDisplayTitleForProperty($name);
        if ($type === Datatype::WIKIPAGE) {
            return new PropertyFacetValues(
                new PropertyResponse($name, $displayTitle,
                    Datatype::WIKIPAGE,
                    WikiTools::createURLForProperty($name)
                ),
                array_map(function($e) {
                    $parts = explode("|", $e);
                    return new MWTitle($parts[0], $parts[1]);
                }, $values));
        } else {
            return new PropertyFacetValues(
                new PropertyResponse($name, $displayTitle,
                    Datatype::NUMBER,
                    WikiTools::createURLForProperty($name)
                ),
                $values);
        }

    }

    private function parseProperties(array $propertyList): array
    {
        $properties = [] /* @var Property[] */;
        foreach($propertyList as $property) {
            $propertyResponse = $this->parseProperty($property);
            if (!is_null($propertyResponse)) {
                $properties[] = $propertyResponse;
            }
        }
        return $properties;
    }

    private function parseProperty(string $property): ?PropertyResponse {
        list($name, $type) = Helper::parseSOLRProperty($property);
        if (is_null($name)) {
            return null;
        }
        $displayTitle = WikiTools::getDisplayTitleForProperty($name);
        if ($type === Datatype::WIKIPAGE) {
            return new PropertyResponse($name, $displayTitle, Datatype::WIKIPAGE, WikiTools::createURLForProperty($name));
        } else {
            return new PropertyResponse($name, $displayTitle, $type, WikiTools::createURLForProperty($name));
        }

    }

    private function parsePropertyFromStats(string $property): ?PropertyResponse {
        list($name, $type) = Helper::parseSOLRProperty($property);
        if (is_null($name)) {
            return null;
        }
        $displayTitle = WikiTools::getDisplayTitleForProperty($name);
        return new PropertyResponse($name, $displayTitle, $type, WikiTools::createURLForProperty($name));
    }

    private static function startsWith($string, $query){
        return substr($string, 0, strlen($query)) === $query;
    }
}
