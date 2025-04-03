<?php

namespace DIQA\FacetedSearch2\Model\Request;

use DIQA\FacetedSearch2\Model\Common\Property;

class PropertyValueConstraint {

    public Property $property;

    public ?int $facetLimit = null;
    public ?int $facetOffset = null;
    public ?string $facetContains = null;

    /**
     * Property constructor.
     * @param Property $property
     * @param int|null $facetLimit
     * @param int|null $facetOffset
     * @param string|null $facetContains
     */
    public function __construct(Property $property,
                                ?int $facetLimit = null,
                                ?int $facetOffset = null,
                                ?string $facetContains = null)
    {
        $this->property = $property;
        $this->facetLimit = $facetLimit;
        $this->facetOffset = $facetOffset;
        $this->facetContains = $facetContains;
    }

    /**
     * @return Property
     */
    public function getProperty(): Property
    {
        return $this->property;
    }

    /**
     * @return int|null
     */
    public function getFacetLimit(): ?int
    {
        return $this->facetLimit;
    }

    /**
     * @return int|null
     */
    public function getFacetOffset(): ?int
    {
        return $this->facetOffset;
    }

    /**
     * @return string|null
     */
    public function getFacetContains(): ?string
    {
        return $this->facetContains;
    }

    public function hasConstraints() {
        return !(is_null($this->facetLimit) && is_null($this->facetOffset) && is_null($this->facetContains));
    }

}