<?php

namespace DIQA\FacetedSearch2\SolrClient;

use Carbon\Carbon;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetCount;
use DIQA\FacetedSearch2\Model\Response\CategoryFacetValue;
use DIQA\FacetedSearch2\Model\Response\Document;
use DIQA\FacetedSearch2\Model\Response\MWTitleWithURL;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetCount;
use DIQA\FacetedSearch2\Model\Response\NamespaceFacetValue;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetCount;
use DIQA\FacetedSearch2\Model\Response\PropertyFacetValues;
use DIQA\FacetedSearch2\Model\Response\PropertyWithURL;
use DIQA\FacetedSearch2\Model\Response\PropertyValueCount;
use DIQA\FacetedSearch2\Model\Response\SolrDocumentsResponse;
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

        return new SolrDocumentsResponse(
            $this->body->response->numFound,
            $docs,
            $categoryFacetCounts,
            $propertyFacetCounts,
            $namespaceFacetCounts
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
        $propertyValueCount = [] /* @var PropertyValueCount[] */;
        $ranges = [];
        $properties = [];
        foreach ($this->body->facet_counts->facet_queries as $key => $count) {
            if ($count === 0) {
                continue;
            }
            $propertyRange = explode(':', $key);
            $property = $this->parsePropertyFromStats($propertyRange[0]);
            preg_match_all("/\[(.*) TO (.*)\]/", $propertyRange[1], $range);

            if ($property->getType() === Datatype::DATETIME) {
                $from = Carbon::createFromIsoFormat('YYYYMMDDHHmmss', $range[1][0]);
                $to = Carbon::createFromIsoFormat('YYYYMMDDHHmmss', $range[2][0]);
                $r = new ValueCount(null, null, new Range($from->toIso8601ZuluString(), $to->toIso8601ZuluString()), $count);
            } else if ($property->getType() === Datatype::NUMBER) {
                $r = new ValueCount(null, null, new Range($range[1][0], $range[2][0]), $count);

            } else {
                continue;
            }
            $ranges[$property->title][] = $r;
            $properties[$property->title] = $property;
        }
        foreach ($properties as $key => $property) {
            $propertyValueCount[] = new PropertyValueCount($property, $ranges[$key]);
        }

        foreach ($this->body->facet_counts->facet_fields as $p => $values) {
            if ($p === 'smwh_categories' || $p === 'smwh_attributes' || $p === 'smwh_properties' || $p === 'smwh_namespace_id') continue;
            $property = $this->parseProperty($p);
            if ($property->getType() === Datatype::DATETIME || $property->getType() === Datatype::NUMBER) {
                continue;
            }
            $valueCounts = [] /* @var ValueCount[] */;
            foreach($values as $v => $count) {
                if ($property->getType() === Datatype::WIKIPAGE) {
                    list($title, $displayTitle) = explode("|", $v);
                    $valueCounts[] = new ValueCount(null, new MWTitleWithURL($title, $displayTitle, WikiTools::createURLForPage($title)), null, $count);
                } else {
                    $valueCounts[] = new ValueCount($v, null, null, $count);
                }
            }
            $propertyValueCount[] = new PropertyValueCount($property, $valueCounts);
        }
        return new SolrFacetResponse($propertyValueCount);

    }

    private function parsePropertyWithValues(string $property, $values): ?PropertyFacetValues {
        list($name, $type) = Helper::parseSOLRProperty($property);
        if (is_null($name)) return null;
        $displayTitle = WikiTools::getDisplayTitleForProperty($name);
        if ($type === Datatype::WIKIPAGE) {
            return new PropertyFacetValues(
                new PropertyWithURL($name, $displayTitle,
                    Datatype::WIKIPAGE,
                    WikiTools::createURLForProperty($name)
                ),
                array_map(function($e) {
                    $parts = explode("|", $e);
                    return new MWTitleWithURL($parts[0], $parts[1], WikiTools::createURLForPage($parts[0]));
                }, $values));
        } else {
            return new PropertyFacetValues(
                new PropertyWithURL($name, $displayTitle,
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

    private function parseProperty(string $property): ?PropertyWithURL {
        list($name, $type) = Helper::parseSOLRProperty($property);
        if (is_null($name)) {
            return null;
        }
        $displayTitle = WikiTools::getDisplayTitleForProperty($name);
        if ($type === Datatype::WIKIPAGE) {
            return new PropertyWithURL($name, $displayTitle, Datatype::WIKIPAGE, WikiTools::createURLForProperty($name));
        } else {
            return new PropertyWithURL($name, $displayTitle, $type, WikiTools::createURLForProperty($name));
        }

    }

    private function parsePropertyFromStats(string $property): ?PropertyWithURL {
        list($name, $type) = Helper::parseSOLRProperty($property);
        if (is_null($name)) {
            return null;
        }
        $displayTitle = WikiTools::getDisplayTitleForProperty($name);
        return new PropertyWithURL($name, $displayTitle, $type, WikiTools::createURLForProperty($name));
    }

    private static function startsWith($string, $query){
        return substr($string, 0, strlen($query)) === $query;
    }
}
