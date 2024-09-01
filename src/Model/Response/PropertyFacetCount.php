<?php
namespace DIQA\FacetedSearch2\Model\Response;

class PropertyFacetCount
{
    public PropertyResponse $property;
    public int $count;

    /**
     * PropertyFacetCount constructor.
     * @param PropertyResponse $property
     * @param int $count
     */
    public function __construct(PropertyResponse $property, int $count)
    {
        $this->property = $property;
        $this->count = $count;
    }


}
