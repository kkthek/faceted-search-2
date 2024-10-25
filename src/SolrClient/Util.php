<?php

namespace DIQA\FacetedSearch2\SolrClient;

class Util {
    public static function splitResponse($res): array
    {
        $bodyBegin = strpos($res, "\r\n\r\n");
        list($header, $res) = $bodyBegin !== false ? array(substr($res, 0, $bodyBegin), substr($res, $bodyBegin + 4)) : array($res, "");
        return array($header, str_replace("%0A%0D%0A%0D", "\r\n\r\n", $res));
    }

    public static function groupArray($array, callable $getKey) {
        $arr = [];
        foreach ($array as $item) {
            if (!array_key_exists($getKey($item), $arr)) {
                $arr[$getKey($item)] = [$item];
            } else {
                $arr[$getKey($item)][] = $item;
            }
        }
        return $arr;
    }
}
