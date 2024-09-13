<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Request\Datatype;

class Helper
{

    /**
     * Helper functions to return implementation specific property/value suffixes.
     * dependant from backend
     */
    private const DatatypeSuffixForSearchMap = [
        Datatype::STRING => 'xsdvalue_s',
        Datatype::NUMBER => 'xsdvalue_d',
        Datatype::BOOLEAN => 'xsdvalue_b',
        Datatype::WIKIPAGE => 's',
        Datatype::DATETIME => 'datevalue_l'
    ];

    private const DatatypeSuffixForPropertyMap = [
        Datatype::STRING => 'xsdvalue_t',
        Datatype::NUMBER => 'xsdvalue_d',
        Datatype::BOOLEAN => 'xsdvalue_b',
        Datatype::WIKIPAGE => 't',
        Datatype::DATETIME => 'xsdvalue_dt'
    ];

    private static function encodeCharsInProperties(string $title)
    {
        $s = $title;
        $s = preg_replace('/_/', '__', $s);
        $s = preg_replace('/\s/', '__', $s);
        return self::encodeSpecialChars($s);
    }

    public static function decodeCharsInProperty(string $title)
    {
        $s = $title;
        $s = self::decodeSpecialChars($s);
        return preg_replace('/__/', ' ', $s);
    }

    public static function generateSOLRProperty(string $title, $type)
    {
        $s = self::encodeCharsInProperties($title);
        return "smwh_{$s}_" . self::DatatypeSuffixForPropertyMap[$type];
    }

    public static function generateSOLRPropertyForSearch(string $title, $type)
    {
        $s = self::encodeCharsInProperties($title);
        return "smwh_{$s}_" . self::DatatypeSuffixForSearchMap[$type];
    }

    private static function encodeSpecialChars($s) {
        return str_replace("%", "_0x", urlencode($s));
    }

    private static function decodeSpecialChars($s) {
        return urldecode(str_replace("_0x", "%", $s));
    }

    public static function quoteValue($v, $type)
    {
        if ($type === Datatype::NUMBER || $type === Datatype::BOOLEAN) {
            return $v;
        }
        return '"' . preg_replace('/"/', '\"', $v) . '"';
    }

    public static function convertDateTimeToLong($date): string
    {
        $datetime = \DateTime::createFromFormat('Y-m-d\TH:i:s+', $date);
        return $datetime->format('YmdHis');
    }


}
