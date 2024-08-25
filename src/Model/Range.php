<?php
namespace DIQA\FacetedSearch2\Model;

class Range {

    public string $from;
    public string $to;

    /**
     * Range constructor.
     * @param string $from
     * @param string $to
     */
    public function __construct(string $from, string $to)
    {
        $this->from = $from;
        $this->to = $to;
    }


}