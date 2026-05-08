<?php

namespace DIQA\FacetedSearch2\ElasticSearch;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;

class Helper
{

    static function mapName(Property $property): string
    {
        switch ($property->getType()) {
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

    static function mapValues(PropertyValues $values): array
    {
        $result = [];
        switch ($values->getProperty()->getType()) {
            case Datatype::DATETIME:
                foreach ($values->getValues() as $value) {
                    $value = self::toUnixTimestamp($value);
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

    /**
     * Converts an ISO 8601 date string into a Unix timestamp.
     *
     * @param string $iso8601Date ISO 8601 formatted date (e.g. "2025-05-07T14:30:00+00:00")
     * @return int Unix timestamp (seconds since epoch)
     * @throws \InvalidArgumentException if the input string is not a valid ISO 8601 date
     */
    private static function toUnixTimestamp(string $iso8601Date): int
    {
        $dateTime = \DateTimeImmutable::createFromFormat(\DateTimeInterface::ATOM, $iso8601Date);

        if ($dateTime === false) {
            // Fallback: try a more lenient parser for ISO 8601 variants
            // (e.g. with milliseconds or 'Z' instead of timezone offset)
            try {
                $dateTime = new \DateTimeImmutable($iso8601Date);
            } catch (\Exception $e) {
                throw new \InvalidArgumentException(
                    sprintf('Invalid ISO 8601 date: "%s"', $iso8601Date),
                    0,
                    $e
                );
            }
        }

        return $dateTime->getTimestamp();
    }
}