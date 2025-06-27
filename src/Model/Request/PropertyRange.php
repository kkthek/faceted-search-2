<?php

namespace DIQA\FacetedSearch2\Model\Request;

use DIQA\FacetedSearch2\Model\Common\Range;

class PropertyRange {

    public string $property;
    public int $type;
    public Range $range;

    /**
     * PropertyRange constructor.
     * @param string $title
     * @param int $type
     * @param Range $range
     */
    public function __construct(string $title, int $type, Range $range)
    {
        $this->property = $title;
        $this->type = $type;
        $this->range = $range;
    }

    /**
     * @return string
     */
    public function getProperty(): string
    {
        return $this->property;
    }

    /**
     * @param string $property
     * @return PropertyRange
     */
    public function setProperty(string $property): PropertyRange
    {
        $this->property = $property;
        return $this;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @param int $type
     * @return PropertyRange
     */
    public function setType(int $type): PropertyRange
    {
        $this->type = $type;
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
