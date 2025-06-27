<?php

namespace DIQA\FacetedSearch2\Model\Request;

use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Range;

class PropertyFacet {

    public string $property;
    public int $type;

    /** @var FacetValue[] */
    public array $values;

    /**
     * PropertyFacet constructor.
     * @param string $property
     * @param int $type
     */
    public function __construct(string $property, int $type, array $values)
    {
        $this->property = $property;
        $this->type = $type;
        $this->values = $values;
    }

    /**
     * @return string
     */
    public function getProperty(): string
    {
        return $this->property;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @return FacetValue[]
     */
    public function getValues(): array
    {
        return $this->values;
    }

    /**
     * @param FacetValue[] $values
     * @return PropertyFacet
     */
    public function setValues(array $values): PropertyFacet
    {
        $this->values = $values;
        return $this;
    }

}