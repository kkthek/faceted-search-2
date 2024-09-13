<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Response\Document;

class SolrDocumentsResponse
{
    public int $numResults;
    /* @var Document[] */
    public array $docs;
    /* @var CategoryFacetCount[] */
    public array $categoryFacetCounts;
    /* @var PropertyFacetCount[] */
    public array $propertyFacetCounts;
    /* @var NamespaceFacetCount[] */
    public array $namespaceFacetCounts;
    /* @var PropertyValueCount[] */
    public array $propertyValueCount;

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

    /**
     * @return int
     */
    public function getNumResults(): int
    {
        return $this->numResults;
    }

    /**
     * @return Document[]
     */
    public function getDocs(): array
    {
        return $this->docs;
    }

    /**
     * @return CategoryFacetCount[]
     */
    public function getCategoryFacetCounts(): array
    {
        return $this->categoryFacetCounts;
    }

    /**
     * @return PropertyFacetCount[]
     */
    public function getPropertyFacetCounts(): array
    {
        return $this->propertyFacetCounts;
    }

    /**
     * @return NamespaceFacetCount[]
     */
    public function getNamespaceFacetCounts(): array
    {
        return $this->namespaceFacetCounts;
    }

    /**
     * @return PropertyValueCount[]
     */
    public function getPropertyValueCount(): array
    {
        return $this->propertyValueCount;
    }


}
