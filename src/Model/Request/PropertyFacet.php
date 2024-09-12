<?php

namespace DIQA\FacetedSearch2\Model\Request;

class PropertyFacet {

    public string $property;
    public int $type;

    /**
     * @var mixed
     */
    public ?Value $value = null;
    public ?MWTitle $mwTitle = null;
    public ?Range $range = null;


}