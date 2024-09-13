<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Common\Range;

class RangeValueCounts
{
    public PropertyResponse $property;
    public Range $range;
    public int $count;

    /**
     * RangeValueCounts constructor.
     * @param PropertyResponse $property
     * @param Range $range
     * @param int $count
     */
    public function __construct(PropertyResponse $property, Range $range, int $count)
    {
        $this->property = $property;
        $this->range = $range;
        $this->count = $count;
    }

    /**
     * @return PropertyResponse
     */
    public function getProperty(): PropertyResponse
    {
        return $this->property;
    }

    /**
     * @return Range
     */
    public function getRange(): Range
    {
        return $this->range;
    }

    /**
     * @return int
     */
    public function getCount(): int
    {
        return $this->count;
    }


}
