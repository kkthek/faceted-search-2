<?php

namespace DIQA\FacetedSearch2\Model\Request;

class FacetQuery extends BaseQuery {

    /**
     * @var PropertyFacet[]
     */
    public $facetQueries = [];

    public static function fromJson($json): FacetQuery
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new FacetQuery());
    }

    /**
     * @return PropertyFacet[]
     */
    public function getFacetQueries(): array
    {
        return $this->facetQueries;
    }

    /**
     * @param PropertyFacet[] $facetQueries
     * @return FacetQuery
     */
    public function setFacetQueries(array $facetQueries): FacetQuery
    {
        $this->facetQueries = $facetQueries;
        return $this;
    }


}