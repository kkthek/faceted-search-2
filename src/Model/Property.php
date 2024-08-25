<?php

namespace DIQA\FacetedSearch2\Model;

class Property {

    public string $property;
    public int $type;

    /**
     * Property constructor.
     * @param string $property
     * @param int $type
     */
    public function __construct(string $property, int $type)
    {
        $this->property = $property;
        $this->type = $type;
    }

}