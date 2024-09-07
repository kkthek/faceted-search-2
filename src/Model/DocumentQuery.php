<?php

namespace DIQA\FacetedSearch2\Model;

class DocumentQuery extends BaseQuery {

    /**
     * @var \DIQA\FacetedSearch2\Model\Property[]
     */
    public $extraProperties = [];

    /**
     * @var \DIQA\FacetedSearch2\Model\Sort[]
     */
    public $sorts = [];

    public ?int $limit = 10;
    public ?int $offset = 0;

    public static function fromJson($json)
    {
        $mapper = new \JsonMapper();
        return $mapper->map(json_decode($json), new DocumentQuery());
    }
}