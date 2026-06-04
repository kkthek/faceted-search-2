<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use Carbon\Carbon;
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

    static function fromInternalName(string $internalName): Property
    {
        list($type, $name) = explode('__', $internalName);
        switch ($type) {
            case 'number':
                $datatype = Datatype::NUMBER;
                break;
            case 'datetime':
                $datatype = Datatype::DATETIME;
                break;
            case 'boolean':
                $datatype = Datatype::BOOLEAN;
                break;
            case 'wikipage':
                $datatype = Datatype::WIKIPAGE;
                break;
            case 'text':
                $datatype = Datatype::STRING;
                break;
            default:
                throw new \InvalidArgumentException(
                    sprintf('Unknown datatype prefix: "%s"', $type)
                );
        }
        return new Property($name, $datatype);
    }

    static function mapValuesToESModel(PropertyValues $values): array
    {
        $result = [];
        switch ($values->getProperty()->getType()) {

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
        switch ($property->getType()) {
            case Datatype::DATETIME:
            case Datatype::NUMBER:
                $from = $value->getRange()->getFrom();
                $to = $value->getRange()->getTo();
                $condition = ['range' => [Helper::toInternalName($property) =>
                    ['gte' => $from, 'lte' => $to]
                ]];

                break;
            case Datatype::WIKIPAGE:
                $condition = [ 'nested' => [
                    'path' => self::toInternalName($property),
                    'query' => ['match' => [
                        self::toInternalName($property).'.title' => $value->getMwTitle()->getTitle()]
                    ]
                ]
                ];
                break;
            case Datatype::BOOLEAN:
                $condition = [ 'match' => [ self::toInternalName($property) => $value->getValue() ? 'true' : 'false'] ];
                break;
            case Datatype::STRING:
            default:
                $condition = ['match' => [self::toInternalName($property) => $value->getValue()]];
        }
        return $condition;

    }

    public static function convertISOToLong($date): string
    {
        $datetime = \DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $date);
        return $datetime->format('YmdHis');
    }

    public static function plusOneSecond($date): string
    {
        $datetime = Carbon::createFromFormat('Y-m-d\TH:i:s+\Z', $date);
        return $datetime->addSecond()->format('Y-m-d\TH:i:s\Z');
    }

}