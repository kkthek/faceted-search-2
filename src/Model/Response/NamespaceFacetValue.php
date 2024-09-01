<?php
namespace DIQA\FacetedSearch2\Model\Response;

class NamespaceFacetValue
{
    public int $namespace;
    public string $displayTitle;
    public string $url;

    /**
     * NamespaceFacetValue constructor.
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
