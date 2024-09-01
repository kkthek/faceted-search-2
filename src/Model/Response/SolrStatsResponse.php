<?php

namespace DIQA\FacetedSearch2\Model\Response;

class SolrStatsResponse
{
    /* @var RangeValueCounts[] */
    public array $rangeValueCounts;
    /* @var Stats[] */
    public array $stats;

    /**
     * SolrStatsResponse constructor.
     * @param RangeValueCounts[] $rangeValueCounts
     * @param Stats[] $stats
     */
    public function __construct(array $rangeValueCounts, array $stats)
    {
        $this->rangeValueCounts = $rangeValueCounts;
        $this->stats = $stats;
    }


}
