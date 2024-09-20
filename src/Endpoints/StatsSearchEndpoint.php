<?php

namespace DIQA\FacetedSearch2\Endpoints;

use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\SolrClient\SolrRequestClient;
use MediaWiki\Rest\Handler;
use MediaWiki\Rest\Response;


class StatsSearchEndpoint extends Handler
{

    public function execute()
    {
        $solrClient = new SolrRequestClient();
        $jsonBody = $this->getRequest()->getBody();
        $query = StatsQuery::fromJson($jsonBody);
        $response = $solrClient->requestStats($query);
        return new Response(json_encode($response));
    }

}
