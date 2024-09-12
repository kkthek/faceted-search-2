<?php

namespace DIQA\FacetedSearch2\Model\Request;

class BaseQuery {

    public string $searchText = '';
    public $categoryFacets = [];
    public $namespaceFacets = [];

    /**
     * @var \DIQA\FacetedSearch2\Model\Request\PropertyFacet[]
     */
    public  $propertyFacets = [];


}
