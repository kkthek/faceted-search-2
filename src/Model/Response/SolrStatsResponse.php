<?php

namespace DIQA\FacetedSearch2\SolrClient\Response;

class SolrStatsResponse
{
    /* @var RangeValueCounts[] */
    private array $rangeValueCounts;
    /* @var Stats[] */
    private array $stats;

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
