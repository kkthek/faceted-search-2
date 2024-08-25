<?php

namespace DIQA\FacetedSearch2\SolrClient\Response;

class PropertyResponse
{
    private string $title;
    private string $type;
    private string $url;

    /**
     * PropertyResponse constructor.
     * @param string $title
     * @param string $type
     * @param string $url
     */
    public function __construct(string $title, string $type, string $url)
    {
        $this->title = $title;
        $this->type = $type;
        $this->url = $url;
    }


}
