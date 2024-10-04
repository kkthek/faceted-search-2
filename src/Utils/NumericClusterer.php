<?php

namespace DIQA\FacetedSearch2\Utils;


class NumericClusterer implements Clusterer
{

    public function makeClusters(int $min, int $max, int $numSteps): array
    {
        $diff = $max - $min;
        $values = [];
        $currVal = $min;
        $incr = $diff / $numSteps;

        for ($i = 0; $i < $numSteps; ++$i) {
            $values[$i] = round($currVal, 2);
            $currVal += $incr;
        }
        $values[$i] = $max + 1;
        for ($i = 0; $i < count($values) - 1; ++$i) {
            $values[$i] = [$values[$i], $values[$i + 1] - 1];
        }
        array_splice($values, count($values) - 1, 1);

        return $values;
    }
}