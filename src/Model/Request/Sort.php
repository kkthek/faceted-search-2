<?php

namespace DIQA\FacetedSearch2\Model\Request;

class Sort {

    public Property $property;
    public int $order;

    /**
     * Sort constructor.
     * @param Property $property
     * @param int $order
     */
    public function __construct(Property $property, int $order)
    {
        $this->property = $property;
        $this->order = $order;
    }

    /**
     * @return Property
     */
    public function getProperty(): Property
    {
        return $this->property;
    }

    /**
     * @return int
     */
    public function getOrder(): int
    {
        return $this->order;
    }


}