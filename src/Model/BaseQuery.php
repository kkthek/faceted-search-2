<?php

namespace DIQA\FacetedSearch2\Model;

class BaseQuery {

    public string $searchText;
    public $categoryFacets = [];
    public $namespaceFacets = [];

    /**
     * @var \DIQA\FacetedSearch2\Model\PropertyFacet[]
     */
    public  $propertyFacets = [];


}
