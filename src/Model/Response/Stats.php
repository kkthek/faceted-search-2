<?php

namespace DIQA\FacetedSearch2\Model\Response;

class Stats
{
    public PropertyResponse $property;
    public int $min;
    public int $max;
    public int $count;
    public int $sum;

    /**
     * Stats constructor.
     * @param PropertyResponse $property
     * @param int $min
     * @param int $max
     * @param int $count
     * @param int $sum
     */
    public function __construct(PropertyResponse $property, int $min, int $max, int $count, int $sum)
    {
        $this->property = $property;
        $this->min = $min;
        $this->max = $max;
        $this->count = $count;
        $this->sum = $sum;
    }


}
