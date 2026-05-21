<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Request\FacetValue;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;

class Helper
{

    static function toInternalName(Property $property): string
    {

        switch ($property->getType()) {
            case Datatype::INTERNAL:
                if ($property->getTitle() === 'displaytitle') return '__display';
                if ($property->getTitle() === 'score') return '_score';
                break;
            case Datatype::NUMBER:
                $prefix = "number";
                break;
            case Datatype::DATETIME:
                $prefix = "datetime";
                break;
            case Datatype::BOOLEAN:
                $prefix = "boolean";
                break;
            case Datatype::WIKIPAGE:
                $prefix = "wikipage";
                break;
            case Datatype::STRING:
            default:
                $prefix = "text";
        }
        return "{$prefix}__{$property->getTitle()}";

    }

    static function getDatatypeFromInternalName(string $internalName): int
    {
        $prefix = explode('__', $internalName, 2)[0];

        switch ($prefix) {
            case 'number':
                return Datatype::NUMBER;
            case 'datetime':
                return Datatype::DATETIME;
            case 'boolean':
                return Datatype::BOOLEAN;
            case 'wikipage':
                return Datatype::WIKIPAGE;
            case 'text':
                return Datatype::STRING;
            default:
                throw new \InvalidArgumentException(
                    sprintf('Unknown datatype prefix: "%s"', $prefix)
                );
        }
    }


    static function mapValuesToESModel(PropertyValues $values): array
    {
        $result = [];
        switch ($values->getProperty()->getType()) {
            case Datatype::DATETIME:
                foreach ($values->getValues() as $value) {
                    $value = self::convertDateTimeToLong($value);
                    $result[] = $value;
                }
                break;
            case Datatype::WIKIPAGE:
                foreach ($values->getMwTitles() as $value) {
                    $value = [
                        "title" => $value->getTitle(),
                        "display" => $value->getDisplayTitle()
                    ];
                    $result[] = $value;
                }
                break;
            default:
                foreach ($values->getValues() as $value) {
                    $result[] = $value;
                }
                break;
        }
        return $result;
    }

    static function mapFacetQueryToESModel(Property $property, FacetValue $value): array
    {
        if (!is_null($value->getValue())) {
            $condition = [ 'match' => [ self::toInternalName($property) => $value->getValue() ] ];
        } elseif (!is_null($value->getMwTitle())) {
            $condition = [ 'nested' => [
                'path' => self::toInternalName($property),
                'query' => ['match' => [
                    self::toInternalName($property).'.title' => $value->getMwTitle()->getTitle()]
                ]
                ]
            ];

        } else {
            $condition = ['range' => [Helper::toInternalName($property) =>
                ['gte' => $value->getRange()->getFrom(), 'lte' => $value->getRange()->getTo()]
            ]];
        }
        return $condition;
    }

    public static function fromLongToDateTime(int $longDate): string
    {
        $datetime = \DateTime::createFromFormat('YmdHis', $longDate);
        return $datetime->format('Y-m-d\TH:i:s\Z');
    }

    public static function convertDateTimeToLong($date): string
    {
        $datetime = \DateTime::createFromFormat('Y-m-d\TH:i:s\Z', $date);
        return $datetime->format('YmdHis');
    }
}