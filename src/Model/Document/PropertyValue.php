<?php

namespace DIQA\FacetedSearch2\Model\Document;

use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\MWTitle;
use DIQA\FacetedSearch2\Model\Request\Property;

class PropertyValue {

    private Property $property;
    private $values = []            /* @var Value[] */;
    private $mwTitles = []          /* @var MWTitle[] */;

    /**
     * PropertyValue constructor.
     * @param Property $property
     * @param $values
     */
    public function __construct(Property $property, $values)
    {
        $this->property = $property;
        if ($property->getType() === Datatype::WIKIPAGE) {
            $this->mwTitles = $values ?? [];
        } else {
            $this->values = $values ?? [];
        }
    }

    /**
     * @return Property
     */
    public function getProperty(): Property
    {
        return $this->property;
    }

    /**
     * @return mixed
     */
    public function getValues()
    {
        return $this->values;
    }

    /**
     * @return mixed
     */
    public function getMwTitles()
    {
        return $this->mwTitles;
    }


}
