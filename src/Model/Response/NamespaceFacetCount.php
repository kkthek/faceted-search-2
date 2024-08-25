<?php
namespace DIQA\FacetedSearch2\SolrClient\Response;

class NamespaceFacetCount
{
    private int $namespace;
    private string $displayTitle;
    private int $count;

    /**
     * NamespaceFacetCount constructor.
     * @param int $namespace
     * @param string $displayTitle
     * @param int $count
     */
    public function __construct(int $namespace, string $displayTitle, int $count)
    {
        $this->namespace = $namespace;
        $this->displayTitle = $displayTitle;
        $this->count = $count;
    }


}
