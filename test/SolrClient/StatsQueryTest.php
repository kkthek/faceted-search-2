<?php
namespace DIQA\FacetedSearch2\SolrClient;


use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Setup;


final class StatsQueryTest extends BaseTest {

    private $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = ConfigTools::getFacetedSearchClient();
        $documentUpdater = ConfigTools::getFacetedSearchUpdateClient();
        $documentUpdater->clearAllDocuments();
        $documentUpdater->updateDocuments(TestData::generateData());
    }

    public function testStatsQuery(): void
    {

        $q = new StatsQuery();
        $p = new Property('Was born at', Datatype::DATETIME);
        $q->setStatsProperties([$p]);
        $response = $this->client->requestStats($q);

        $this->assertEquals(1, count($response->getStats()));
        $this->assertEquals(1, $response->getStats()[0]->getCount());
        $this->assertEquals('19690610000000', $response->getStats()[0]->getMin());
        $this->assertEquals('19690610000000', $response->getStats()[0]->getMax());

    }


}