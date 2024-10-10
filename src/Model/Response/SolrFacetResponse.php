<?php

namespace DIQA\FacetedSearch2\Model\Response;

class SolrFacetResponse
{
    /* @var PropertyValueCount[] */
    public array $valueCounts;

    public function __construct(array $valueCounts)
    {
        $this->valueCounts = $valueCounts;
    }


    /**
     * @return PropertyValueCount[]
     */
    public function getValueCounts(): array
    {
        return $this->valueCounts;
    }


}
