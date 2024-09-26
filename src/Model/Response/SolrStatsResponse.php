<?php

namespace DIQA\FacetedSearch2\Model\Response;

class SolrStatsResponse
{

    /* @var Stats[] */
    public array $stats;

    public function __construct(array $stats)
    {
        $this->stats = $stats;
    }

    /**
     * @return Stats[]
     */
    public function getStats(): array
    {
        return $this->stats;
    }


}
