<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Range;

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


}
