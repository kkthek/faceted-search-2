<?php

namespace DIQA\FacetedSearch2\Model\Request;

use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;

class PropertyRange {

    public Property $property;
    public Range $range;

    /**
     * PropertyRange constructor.
     * @param Property $property
     * @param Range $range
     */
    public function __construct(Property $property, Range $range)
    {
        $this->property = $property;
        $this->range = $range;
    }

    /**
     * @return Property
     */
    public function getProperty(): Property
    {
        return $this->property;
    }

    /**
     * @param Property $property
     * @return PropertyRange
     */
    public function setProperty(Property $property): PropertyRange
    {
        $this->property = $property;
        return $this;
    }

    /**
     * @return Range
     */
    public function getRange(): Range
    {
        return $this->range;
    }

    /**
     * @param Range $range
     * @return PropertyRange
     */
    public function setRange(Range $range): PropertyRange
    {
        $this->range = $range;
        return $this;
    }


}
