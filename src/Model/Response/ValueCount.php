<?php
namespace DIQA\FacetedSearch2\Model\Response;

use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Range;

class ValueCount
{
    public ?string $value;
    public ?MWTitle $mwTitle;
    public ?Range $range;
    public int $count;

    /**
     * ValueCount constructor.
     * @param string $value
     * @param int $count
     */
    public function __construct(?string $value, ?MWTitle $mwTitle, ?Range $range, int $count)
    {
        $this->value = $value;
        $this->mwTitle = $mwTitle;
        $this->range = $range;
        $this->count = $count;
    }


}
