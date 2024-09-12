<?php

namespace DIQA\FacetedSearch2\Endpoints;

use DIQA\FacetedSearch\Proxy\SolrProxy\SolrService;
use DIQA\FacetedSearch2\Model\FacetQuery;
use DIQA\FacetedSearch2\SolrClient\Client;
use MediaWiki\Rest\Handler;
use MediaWiki\Rest\Response;


class FacetQueryEndpoint extends Handler
{

    public function execute()
    {
        $solrClient = new Client();
        $jsonBody = $this->getRequest()->getBody();
        $query = FacetQuery::fromJson($jsonBody);
        $response = $solrClient->requestFacet($query);
        return new Response(json_encode($response));
    }

}
