<?php
namespace DIQA\FacetedSearch2\Model\Request;

class Value {

    public string $value;

    /**
     * Value constructor.
     * @param string $value
     */
    public function __construct(string $value)
    {
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

}