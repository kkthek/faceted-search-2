<?php

namespace DIQA\FacetedSearch2\Model\Response;

class PropertyFacetValues
{
    public PropertyResponse $property;
    public $values;

    /**
     * PropertyFacetValues constructor.
     * @param PropertyResponse $property
     * @param $values
     */
    public function __construct(PropertyResponse $property, $values)
    {
        $this->property = $property;
        $this->values = $values;
    }


}