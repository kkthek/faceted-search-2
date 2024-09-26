<?php

namespace DIQA\FacetedSearch2\Model\Response;

class Stats
{
    public PropertyResponse $property;
    public ?float $min;
    public ?float $max;
    public ?float $count;
    public ?float $sum;

    /**
     * Stats constructor.
     * @param PropertyResponse $property
     * @param float|null $min
     * @param float|null $max
     * @param float|null $count
     * @param float|null $sum
     */
    public function __construct(PropertyResponse $property, ?float $min, ?float $max, ?float $count, ?float $sum)
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
    public function getMin(): ?float
    {
        return $this->min;
    }

    /**
     * @return int|null
     */
    public function getMax(): ?float
    {
        return $this->max;
    }

    /**
     * @return int|null
     */
    public function getCount(): ?float
    {
        return $this->count;
    }

    /**
     * @return int|null
     */
    public function getSum(): ?float
    {
        return $this->sum;
    }


}
