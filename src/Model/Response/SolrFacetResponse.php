<?php

namespace DIQA\FacetedSearch2\Model\Response;

class SolrFacetResponse
{
    /* @var RangeValueCounts[] */
    public array $rangeValueCounts;


    public function __construct(array $rangeValueCounts)
    {
        $this->rangeValueCounts = $rangeValueCounts;

    }

    /**
     * @return RangeValueCounts[]
     */
    public function getRangeValueCounts(): array
    {
        return $this->rangeValueCounts;
    }


}
