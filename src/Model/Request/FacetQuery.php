<?php

namespace DIQA\FacetedSearch2\Model\Request;


class FacetQuery extends BaseQuery {

    /**
     * @var PropertyRange[]
     */
    public $facetQueries = [];

    /**
     * @var PropertyValueConstraint[]
     */
    public $propertyValueConstraints = [];

    public static function fromJson($json): FacetQuery
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new FacetQuery());
    }

    /**
     * @return PropertyRange[]
     */
    public function getFacetQueries(): array
    {
        return $this->facetQueries;
    }

    /**
     * @param PropertyRange[] $facetQueries
     * @return FacetQuery
     */
    public function setFacetQueries(array $facetQueries): FacetQuery
    {
        $this->facetQueries = $facetQueries;
        return $this;
    }

    /**
     * @return PropertyValueConstraint[]
     */
    public function getPropertyValueConstraints(): array
    {
        return $this->propertyValueConstraints;
    }

    /**
     * @param PropertyValueConstraint[] $propertyValueConstraints
     * @return FacetQuery
     */
    public function setPropertyValueConstraints(array $propertyValueConstraints): FacetQuery
    {
        $this->propertyValueConstraints = $propertyValueConstraints;
        return $this;
    }


}