<?php
namespace DIQA\FacetedSearch2\SolrClient\Response;

class PropertyValueCount
{
    private PropertyResponse $property;
    /* @var ValueCount[] */
    private array $values;

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

}
