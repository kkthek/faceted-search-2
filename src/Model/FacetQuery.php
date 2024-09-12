<?php

namespace DIQA\FacetedSearch2\Model;

class FacetQuery extends BaseQuery {

    /**
     * @var \DIQA\FacetedSearch2\Model\PropertyFacet[]
     */
    public $facetQueries = [];

    public static function fromJson($json)
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new FacetQuery());
    }
}