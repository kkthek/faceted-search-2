<?php
namespace DIQA\FacetedSearch2\Model\Response;

class ValueCount
{
    public string $value;
    public int $count;

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
