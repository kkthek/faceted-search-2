<?php

namespace DIQA\FacetedSearch2\Model\Request;


class FacetQuery extends BaseQuery {

    /**
     * @var PropertyRange[]
     */
    public $rangeQueries = [];

    /**
     * @var PropertyValueConstraint[]
     */
    public $propertyValueQueries = [];

    public static function fromJson($json): FacetQuery
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new FacetQuery());
    }

    /**
     * @return PropertyRange[]
     */
    public function getRangeQueries(): array
    {
        return $this->rangeQueries;
    }

    /**
     * @param PropertyRange[] $rangeQueries
     * @return FacetQuery
     */
    public function setRangeQueries(array $rangeQueries): FacetQuery
    {
        $this->rangeQueries = $rangeQueries;
        return $this;
    }

    /**
     * @return PropertyValueConstraint[]
     */
    public function getPropertyValueQueries(): array
    {
        return $this->propertyValueQueries;
    }

    /**
     * @param PropertyValueConstraint[] $propertyValueQueries
     * @return FacetQuery
     */
    public function setPropertyValueQueries(array $propertyValueQueries): FacetQuery
    {
        $this->propertyValueQueries = $propertyValueQueries;
        return $this;
    }


}