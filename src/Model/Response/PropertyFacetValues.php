<?php

namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\SolrClient\Response\PropertyResponse;

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