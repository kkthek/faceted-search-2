<?php

namespace DIQA\FacetedSearch2\Utils;


use DIQA\FacetedSearch2\Model\Common\Range;

class NumericClusterer implements Clusterer
{

    private $isInteger;

    public function __construct($isInteger)
    {
        $this->isInteger = $isInteger;
    }


    public function makeClusters(int $min, int $max, int $numSteps): array
    {
        $diff = $max - $min;
        $values = [];
        $currVal = $min;
        $incr = $diff / $numSteps;

        for ($i = 0; $i < $numSteps; ++$i) {
            $values[$i] = round($currVal, $this->isInteger ? 0 : 2);
            $currVal += $incr;
        }
        $values[$i] = $max + 1;
        for ($i = 0; $i < count($values) - 1; ++$i) {
            $values[$i] = new Range($values[$i], $values[$i + 1] - 1);
        }
        array_splice($values, count($values) - 1, 1);

        return $values;
    }
}