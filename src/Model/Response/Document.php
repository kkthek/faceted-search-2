<?php

namespace DIQA\FacetedSearch2\SolrClient\Response;

class Document
{
    private string $id;
    /* @var PropertyFacetValues[] */
    private array $propertyFacets;
    /* @var CategoryFacetValue[] */
    private array $categoryFacets;
    /* @var CategoryFacetValue[] */
    private array $directCategoryFacets;
    /* @var NamespaceFacetValue[] */
    private $namespaceFacet;
    /* @var PropertyResponse[] */
    private array $properties;
    private string $title;
    private string $displayTitle;
    private string $url;
    private int $score;
    private ?string $highlighting;

    /**
     * Document constructor.
     * @param string $id
     * @param PropertyFacetValues[] $propertyFacets
     * @param CategoryFacetValue[] $categoryFacets
     * @param CategoryFacetValue[] $directCategoryFacets
     * @param NamespaceFacetValue[] $namespaceFacet
     * @param PropertyResponse[] $properties
     * @param string $title
     * @param string $displayTitle
     * @param string $url
     * @param int $score
     * @param string|null $highlighting
     */
    public function __construct(string $id, array $propertyFacets, array $categoryFacets, array $directCategoryFacets, array $namespaceFacet, array $properties, string $title, string $displayTitle, string $url, int $score, ?string $highlighting)
    {
        $this->id = $id;
        $this->propertyFacets = $propertyFacets;
        $this->categoryFacets = $categoryFacets;
        $this->directCategoryFacets = $directCategoryFacets;
        $this->namespaceFacet = $namespaceFacet;
        $this->properties = $properties;
        $this->title = $title;
        $this->displayTitle = $displayTitle;
        $this->url = $url;
        $this->score = $score;
        $this->highlighting = $highlighting;
    }


}
