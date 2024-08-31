<?php

namespace DIQA\FacetedSearch2\Model\Response;

class CategoryFacetCount
{
    private string $category;
    private int $count;

    /**
     * CategoryFacetCount constructor.
     * @param string $category
     * @param int $count
     */
    public function __construct(string $category, int $count)
    {
        $this->category = $category;
        $this->count = $count;
    }

}
