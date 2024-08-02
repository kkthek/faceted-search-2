<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch\Proxy\SolrProxy\SolrService;
use MediaWiki\Rest\Handler;
use MediaWiki\Rest\Response;


class DocumentsSearchEndpoint extends Handler
{

    public function execute()
    {

        $jsonBody = $this->getRequest()->getBody();
        $body = json_decode($jsonBody);

        // do something

        return new Response("");
    }

}