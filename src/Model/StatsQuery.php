<?php

namespace DIQA\FacetedSearch2\Model;

class StatsQuery extends BaseQuery {

    /**
     * @var \DIQA\FacetedSearch2\Model\Property[]
     */
    public $statsProperties = [];

    public static function fromJson($json)
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new StatsQuery());
    }
}