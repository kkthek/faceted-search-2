<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use PHPUnit\Framework\TestCase;

abstract class BaseStatsQueryTest extends TestCase {
    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;
    protected function setUp(): void
    {
        require_once 'dev-config.php';
        setConfigForDevContext();
    }
    public function testStatsQuery(): void
    {

        $q = new StatsQuery();
        $p = new Property('Was born at', Datatype::DATETIME);
        $q->setStatsProperties([$p]);
        $response = $this->client->requestStats($q);

        $this->assertCount(1, $response->getStats());
        $this->assertEquals(1, $response->getStats()[0]->getCount());
        $this->assertEquals('19690610000000', $response->getStats()[0]->getMin());
        $this->assertEquals('19690610000000', $response->getStats()[0]->getMax());

    }
}
