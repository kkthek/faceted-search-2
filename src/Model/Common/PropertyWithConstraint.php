<?php

namespace DIQA\FacetedSearch2\Model\Common;

class PropertyWithConstraint extends Property {

    public ?int $facetLimit = null;
    public ?int $facetOffset = null;
    public ?string $facetContains = null;

    /**
     * PropertyWithConstraint constructor.
     * @param int|null $facetLimit
     * @param int|null $facetOffset
     * @param string|null $facetContains
     */
    public function __construct(string $title, int $type, ?int $facetLimit, ?int $facetOffset, ?string $facetContains)
    {
        parent::__construct($title, $type);
        $this->facetLimit = $facetLimit;
        $this->facetOffset = $facetOffset;
        $this->facetContains = $facetContains;
    }

    /**
     * @return int|null
     */
    public function getFacetLimit(): ?int
    {
        return $this->facetLimit;
    }

    /**
     * @param int|null $facetLimit
     * @return PropertyWithConstraint
     */
    public function setFacetLimit(?int $facetLimit): PropertyWithConstraint
    {
        $this->facetLimit = $facetLimit;
        return $this;
    }

    /**
     * @return int|null
     */
    public function getFacetOffset(): ?int
    {
        return $this->facetOffset;
    }

    /**
     * @param int|null $facetOffset
     * @return PropertyWithConstraint
     */
    public function setFacetOffset(?int $facetOffset): PropertyWithConstraint
    {
        $this->facetOffset = $facetOffset;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getFacetContains(): ?string
    {
        return $this->facetContains;
    }

    /**
     * @param string|null $facetContains
     * @return PropertyWithConstraint
     */
    public function setFacetContains(?string $facetContains): PropertyWithConstraint
    {
        $this->facetContains = $facetContains;
        return $this;
    }

    public function hasConstraints() {
        return !(is_null($this->facetLimit) && is_null($this->facetOffset) && is_null($this->facetContains));
    }
}
