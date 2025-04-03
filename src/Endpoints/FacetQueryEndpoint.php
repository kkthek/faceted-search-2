<?php

namespace DIQA\FacetedSearch2\Endpoints;

use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\SolrClient\SolrRequestClient;
use MediaWiki\Rest\Handler;
use MediaWiki\Rest\Response;


class FacetQueryEndpoint extends Handler
{

    public function execute()
    {
        $solrClient = new SolrRequestClient();
        $jsonBody = $this->getRequest()->getBody();
        $query = FacetQuery::fromJson($jsonBody);
        $response = $solrClient->requestFacets($query);
        $r = new Response(json_encode($response));
        $r->setHeader('Content-Type', 'application/json');
        return $r;
    }

}
