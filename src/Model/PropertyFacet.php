<?php

namespace DIQA\FacetedSearch2\Model;

class PropertyFacet {

    public string $property;
    public int $type;

    /**
     * @var mixed
     */
    public ?Value $value;
    public ?MWTitle $mwTitle;
    public ?Range $range;


}