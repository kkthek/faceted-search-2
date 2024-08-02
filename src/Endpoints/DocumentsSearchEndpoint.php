<?php

namespace DIQA\FacetedSearch2\Endpoints;

use DIQA\FacetedSearch\Proxy\SolrProxy\SolrService;
use DIQA\FacetedSearch2\Model\DocumentQuery;
use MediaWiki\Rest\Handler;
use MediaWiki\Rest\Response;
use JsonMapper;

class DocumentsSearchEndpoint extends Handler
{

    public function execute()
    {

        $jsonBody = $this->getRequest()->getBody();
        $body = json_decode($jsonBody);

        $mapper = new JsonMapper();
        $documentQuery = $mapper->map($body, new DocumentQuery());
        return new Response(print_r($documentQuery, true));

    }

}