<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Utils\DateTimeClusterer;
use DIQA\FacetedSearch2\Utils\NumericClusterer;

class Stats
{
    public PropertyWithURL $property;
    public ?float $min;
    public ?float $max;
    public ?float $count;
    public ?float $sum;
    public array $clusters;

    /**
     * Stats constructor.
     * @param PropertyWithURL $property
     * @param float|null $min
     * @param float|null $max
     * @param float|null $count
     * @param float|null $sum
     */
    public function __construct(PropertyWithURL $property, ?float $min, ?float $max, ?float $count, ?float $sum)
    {
        $this->property = $property;
        $this->min = $min;
        $this->max = $max;
        $this->count = $count;
        $this->sum = $sum;
        $this->makeClusters($property, $min, $max, $sum);
    }

    /**
     * @return PropertyWithURL
     */
    public function getProperty(): PropertyWithURL
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

    private function makeClusters(PropertyWithURL $property, ?float $min, ?float $max, ?float $sum)
    {
        switch($property->getType()) {
            case Datatype::DATETIME:
                $clusterer = new DateTimeClusterer();
                global $fsg2DateTimePropertyClusters;
                if (array_key_exists($property->getTitle(), $fsg2DateTimePropertyClusters)) {
                    $constraints = $fsg2DateTimePropertyClusters[$property->getTitle()];
                    $min = str_replace([':', '-'], '', $constraints['min']);
                    $max = str_replace([':', '-'], '', $constraints['max']);
                }
                $this->clusters = $clusterer->makeClusters($min, $max, 10);
                break;
            case Datatype::NUMBER:
                $isInteger = ctype_digit((string) abs($sum));
                $clusterer = new NumericClusterer($isInteger);
                global $fsg2NumericPropertyClusters;
                if (array_key_exists($property->getTitle(), $fsg2NumericPropertyClusters)) {
                    $constraints = $fsg2NumericPropertyClusters[$property->getTitle()];
                    $this->clusters = $clusterer->makeClustersWithFixedInterval(
                        $constraints['lowerBound'],
                        $constraints['upperBound'],
                        $constraints['interval'],
                        $constraints['min'] ?? null,
                        $constraints['max'] ?? null);
                } else {
                    $this->clusters = $clusterer->makeClusters($min, $max, 10);
                }
                break;
            default:
                $this->clusters = [];
        }
    }


}
