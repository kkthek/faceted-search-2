<?php

namespace DIQA\FacetedSearch2\Model\Request;

class PropertyFacet {

    public string $property;
    public int $type;

    public ?Value $value = null;
    public ?MWTitle $mwTitle = null;
    public ?Range $range = null;

    /**
     * PropertyFacet constructor.
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

    /**
     * @return Value|null
     */
    public function getValue(): ?Value
    {
        return $this->value;
    }

    /**
     * @return MWTitle|null
     */
    public function getMwTitle(): ?MWTitle
    {
        return $this->mwTitle;
    }

    /**
     * @return Range|null
     */
    public function getRange(): ?Range
    {
        return $this->range;
    }

    /**
     * @param Value|null $value
     * @return PropertyFacet
     */
    public function setValue(?Value $value): PropertyFacet
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @param MWTitle|null $mwTitle
     * @return PropertyFacet
     */
    public function setMwTitle(?MWTitle $mwTitle): PropertyFacet
    {
        $this->mwTitle = $mwTitle;
        return $this;
    }

    /**
     * @param Range|null $range
     * @return PropertyFacet
     */
    public function setRange(?Range $range): PropertyFacet
    {
        $this->range = $range;
        return $this;
    }


}