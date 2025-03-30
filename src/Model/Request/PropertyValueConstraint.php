<?php

namespace DIQA\FacetedSearch2\Model\Request;

class PropertyValueConstraint {

    public string $title;
    public int $type;

    public ?int $facetLimit = null;
    public ?int $facetOffset = null;
    public ?string $facetContains = null;

    /**
     * Property constructor.
     * @param string $title
     * @param int $type
     * @param int|null $facetLimit
     * @param int|null $facetOffset
     * @param string|null $facetContains
     */
    public function __construct(string $title,
                                int $type,
                                ?int $facetLimit = null,
                                ?int $facetOffset = null,
                                ?string $facetContains = null)
    {
        $this->title = $title;
        $this->type = $type;
        $this->facetLimit = $facetLimit;
        $this->facetOffset = $facetOffset;
        $this->facetContains = $facetContains;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
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