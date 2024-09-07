<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Datatype;

class Helper
{

    /**
     * Helper functions to return implementation specific property/value suffixes.
     * dependant from backend
     */
    private const DatatypeSuffixForPropertyMap = [
        Datatype::STRING => 's',
        Datatype::NUMBER => 'xsdvalue_d',
        Datatype::BOOLEAN => 'xsdvalue_b',
        Datatype::WIKIPAGE => 's',
        Datatype::DATETIME => 'datevalue_l'
    ];

    private const DatatypeSuffixForValueMap = [
        Datatype::STRING => 'xsdvalue_t',
        Datatype::NUMBER => 'xsdvalue_d',
        Datatype::BOOLEAN => 'xsdvalue_b',
        Datatype::WIKIPAGE => 't'
    ];

    private const DatatypeSuffixForFacetMap = [
        Datatype::STRING => 'xsdvalue_s',
        Datatype::NUMBER => 'xsdvalue_d',
        Datatype::BOOLEAN => 'xsdvalue_b',
        Datatype::WIKIPAGE => 's'
    ];

    public static function encodeWhitespacesInProperties(string $title)
    {
        $s = $title;
        $s = preg_replace('/_/', '__', $s);
        return preg_replace('/\s/', '__', $s);
    }

    public static function encodeWhitespacesInTitles(string $title)
    {
        return preg_replace('/\s/', '_', $title);
    }

    public static function decodeWhitespacesInTitle(string $title)
    {
        return preg_replace('/_/', ' ', $title);
    }

    public static function decodeWhitespacesInProperty(string $title)
    {
        return preg_replace('/__/', ' ', $title);
    }

    public static function encodePropertyTitleAsValue(string $title, $type)
    {
        $s = self::encodeWhitespacesInProperties($title);
        return "smwh_{$s}_" . self::DatatypeSuffixForValueMap[$type];
    }

    public static function encodePropertyTitleAsProperty(string $title, $type)
    {
        $s = self::encodeWhitespacesInProperties($title);
        return "smwh_{$s}_" . self::DatatypeSuffixForPropertyMap[$type];
    }

    public static function encodePropertyTitleAsFacet(string $title, $type)
    {
        $s = self::encodeWhitespacesInProperties($title);
        return "smwh_{$s}_" . self::DatatypeSuffixForFacetMap[$type];
    }

    public static function encodePropertyTitleAsStatField(string $title, $type)
    {
        $s = self::encodeWhitespacesInProperties($title);
        if ($type === Datatype::DATETIME) {
            return "smwh_{$s}_datevalue_l";
        } else if ($type === Datatype::number) {
            return "smwh_{$s}_xsdvalue_d";
        } else {
            return "smwh_{$s}_xsdvalue_s";
        }
    }

    public static function quoteValue($v)
    {
        if (is_string($v)) {
            return '"' . preg_replace('/"/', '"', $v) . '"';
        }
        return $v;
    }

    public static function serializeDate($date): string
    {
        $datetime = \DateTime::createFromFormat('Y-m-d\TH:i:s+', $date);
        return $datetime->format('YmdHis');
    }

    public static function padNumber($n)
    {
        if ($n < 10) return "0$n";
        else return $n;
    }
}
