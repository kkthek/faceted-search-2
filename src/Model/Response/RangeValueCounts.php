<?php

namespace DIQA\FacetedSearch2\Model\Response;

class RangeValueCounts
{
    public PropertyResponse $property;
    /* @var ValueCount[] */
    public array $values;

    /**
     * RangeValueCounts constructor.
     * @param PropertyResponse $property
     * @param ValueCount[] $values
     */
    public function __construct(PropertyResponse $property, array $values)
    {
        $this->property = $property;
        $this->values = $values;
    }

    /**
     * @return PropertyResponse
     */
    public function getProperty(): PropertyResponse
    {
        return $this->property;
    }

    /**
     * @return ValueCount[]
     */
    public function getValues(): array
    {
        return $this->values;
    }

}
