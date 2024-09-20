<?php

namespace DIQA\FacetedSearch2\Endpoints;

use DIQA\FacetedSearch\Proxy\SolrProxy\SolrService;
use DIQA\FacetedSearch2\Model\DocumentQuery;
use DIQA\FacetedSearch2\SolrClient\SolrRequestClient;
use MediaWiki\Rest\Handler;
use MediaWiki\Rest\Response;

class DocumentsSearchEndpoint extends Handler
{

    public function execute()
    {
        $solrClient = new SolrRequestClient();
        $jsonBody = $this->getRequest()->getBody();
        $documentQuery = DocumentQuery::fromJson($jsonBody);
        $response = $solrClient->requestDocuments($documentQuery);
        return new Response(json_encode($response));
    }

}