<?php

namespace DIQA\FacetedSearch2\Model\Request;

class StatsQuery extends BaseQuery {

    /**
     * @var \DIQA\FacetedSearch2\Model\Request\Property[]
     */
    public $statsProperties = [];

    public static function fromJson($json): StatsQuery
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new StatsQuery());
    }
}