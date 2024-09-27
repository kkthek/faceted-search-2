<?php

namespace DIQA\FacetedSearch2\Model\Response;

class SolrFacetResponse
{
    /* @var RangeValueCounts[] */
    public array $rangeValueCounts;

    /* @var PropertyValueCount[] */
    public array $valueCounts;

    public function __construct(array $rangeValueCounts, array $valueCounts)
    {
        $this->rangeValueCounts = $rangeValueCounts;
        $this->valueCounts = $valueCounts;
    }

    /**
     * @return RangeValueCounts[]
     */
    public function getRangeValueCounts(): array
    {
        return $this->rangeValueCounts;
    }

    /**
     * @return PropertyValueCount[]
     */
    public function getValueCounts(): array
    {
        return $this->valueCounts;
    }


}
