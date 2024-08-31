<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Response\Document;

class SolrDocumentsResponse
{
    private int $numResults;
    /* @var Document[] */
    private array $docs;
    /* @var CategoryFacetCount[] */
    private array $categoryFacetCounts;
    /* @var PropertyFacetCount[] */
    private array $propertyFacetCounts;
    /* @var NamespaceFacetCount[] */
    private array $namespaceFacetCounts;
    /* @var PropertyValueCount[] */
    private array $propertyValueCount;

    /**
     * SolrDocumentsResponse constructor.
     * @param int $numResults
     * @param Document[] $docs
     * @param CategoryFacetCount[] $categoryFacetCounts
     * @param PropertyFacetCount[] $propertyFacetCounts
     * @param NamespaceFacetCount[] $namespaceFacetCounts
     * @param PropertyValueCount[] $propertyValueCount
     */
    public function __construct(int $numResults, array $docs, array $categoryFacetCounts, array $propertyFacetCounts, array $namespaceFacetCounts, array $propertyValueCount)
    {
        $this->numResults = $numResults;
        $this->docs = $docs;
        $this->categoryFacetCounts = $categoryFacetCounts;
        $this->propertyFacetCounts = $propertyFacetCounts;
        $this->namespaceFacetCounts = $namespaceFacetCounts;
        $this->propertyValueCount = $propertyValueCount;
    }


}
