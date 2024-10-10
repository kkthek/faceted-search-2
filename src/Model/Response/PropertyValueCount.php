<?php
namespace DIQA\FacetedSearch2\Model\Response;

class PropertyValueCount
{
    public PropertyResponse $property;
    /* @var ValueCount[] */
    public array $values;

    /**
     * PropertyValueCount constructor.
     * @param PropertyResponse $property
     * @param ValueCount[] $values
     */
    public function __construct(PropertyResponse $property, array $values)
    {
        $this->property = $property;
        $this->values = $values;
    }

    /**
     * @return ValueCount[]
     */
    public function getValues(): array
    {
        return $this->values;
    }

}
