<?php

namespace DIQA\FacetedSearch2\Model\Response;

class Stats
{
    public PropertyResponse $property;
    public ?int $min;
    public ?int $max;
    public ?int $count;
    public ?int $sum;

    /**
     * Stats constructor.
     * @param PropertyResponse $property
     * @param int $min
     * @param int $max
     * @param int $count
     * @param int $sum
     */
    public function __construct(PropertyResponse $property, ?int $min, ?int $max, ?int $count, ?int $sum)
    {
        $this->property = $property;
        $this->min = $min;
        $this->max = $max;
        $this->count = $count;
        $this->sum = $sum;
    }

    /**
     * @return PropertyResponse
     */
    public function getProperty(): PropertyResponse
    {
        return $this->property;
    }

    /**
     * @return int|null
     */
    public function getMin(): ?int
    {
        return $this->min;
    }

    /**
     * @return int|null
     */
    public function getMax(): ?int
    {
        return $this->max;
    }

    /**
     * @return int|null
     */
    public function getCount(): ?int
    {
        return $this->count;
    }

    /**
     * @return int|null
     */
    public function getSum(): ?int
    {
        return $this->sum;
    }


}
