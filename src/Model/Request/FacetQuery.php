<?php

namespace DIQA\FacetedSearch2\Model\Request;

class FacetQuery extends BaseQuery {

    /**
     * @var \DIQA\FacetedSearch2\Model\Request\PropertyFacet[]
     */
    public $facetQueries = [];

    public static function fromJson($json)
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new FacetQuery());
    }
}