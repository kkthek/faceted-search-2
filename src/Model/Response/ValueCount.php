<?php
namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Common\MWTitle;

class ValueCount
{
    public ?string $value;
    public ?MWTitle $mwTitle;
    public int $count;

    /**
     * ValueCount constructor.
     * @param string $value
     * @param int $count
     */
    public function __construct(?string $value, ?MWTitle $mwTitle, int $count)
    {
        $this->value = $value;
        $this->mwTitle = $mwTitle;
        $this->count = $count;
    }


}
