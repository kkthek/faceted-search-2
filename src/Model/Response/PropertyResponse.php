<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Request\Datatype;

class PropertyResponse
{
    public string $title;
    public int $type;
    public string $url;

    /**
     * PropertyResponse constructor.
     * @param string $title
     * @param int $type
     * @param string $url
     */
    public function __construct(string $title, int $type, string $url)
    {
        $this->title = $title;
        $this->type = $type;
        $this->url = $url;
    }

    /**
     * @return Datatype
     */
    public function getType()
    {
        return $this->type;
    }


}
