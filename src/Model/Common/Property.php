<?php

namespace DIQA\FacetedSearch2\Model\Common;

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

    /**
     * @return string
     */
    public function getProperty(): string
    {
        return $this->property;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

}