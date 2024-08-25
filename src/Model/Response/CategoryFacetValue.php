<?php
namespace DIQA\FacetedSearch2\SolrClient\Response;

class CategoryFacetValue
{
    private int $namespace;
    private string $displayTitle;
    private string $url;

    /**
     * CategoryFacetValue constructor.
     * @param int $namespace
     * @param string $displayTitle
     * @param string $url
     */
    public function __construct(int $namespace, string $displayTitle, string $url)
    {
        $this->namespace = $namespace;
        $this->displayTitle = $displayTitle;
        $this->url = $url;
    }

}
