<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Utils\DateTimeClusterer;
use DIQA\FacetedSearch2\Utils\NumericClusterer;

class Stats
{
    public PropertyResponse $property;
    public ?float $min;
    public ?float $max;
    public ?float $count;
    public ?float $sum;
    public array $clusters;

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
        $this->makeClusters($property, $min, $max);
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

    private function makeClusters(PropertyResponse $property, ?float $min, ?float $max)
    {
        switch($property->getType()) {
            case Datatype::DATETIME:
                $clusterer = new DateTimeClusterer();
                $this->clusters = $clusterer->makeClusters($min, $max, 10);
                break;
            case Datatype::NUMBER:
                $clusterer = new NumericClusterer();
                $this->clusters = $clusterer->makeClusters($min, $max, 10);
                break;
            default:
                $this->clusters = [];
        }
    }


}
