<?php

namespace DIQA\FacetedSearch2\Model\Response;

class PropertyFacetValues
{
    private PropertyResponse $property;
    private $values;

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