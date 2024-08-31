<?php
namespace DIQA\FacetedSearch2\Model\Response;

class ValueCount
{
    private string $value;
    private int $count;

    /**
     * ValueCount constructor.
     * @param string $value
     * @param int $count
     */
    public function __construct(string $value, int $count)
    {
        $this->value = $value;
        $this->count = $count;
    }


}
