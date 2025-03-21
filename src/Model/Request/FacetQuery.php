<?php

namespace DIQA\FacetedSearch2\Model\Request;


class FacetQuery extends BaseQuery {

    /**
     * @var PropertyFacet[]
     */
    public $facetQueries = [];

    /**
     * @var \DIQA\FacetedSearch2\Model\Common\PropertyWithConstraint[]
     */
    public $facetProperties = [];

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

    /**
     * @return \DIQA\FacetedSearch2\Model\Common\PropertyWithConstraint[]
     */
    public function getFacetProperties(): array
    {
        return $this->facetProperties;
    }

    /**
     * @param \DIQA\FacetedSearch2\Model\Common\PropertyWithConstraint[] $facetProperties
     * @return FacetQuery
     */
    public function setFacetProperties(array $facetProperties): FacetQuery
    {
        $this->facetProperties = $facetProperties;
        return $this;
    }


}