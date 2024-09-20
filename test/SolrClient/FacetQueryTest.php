<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use PHPUnit\Framework\TestCase;

final class FacetQueryTest extends TestCase {

    private $client;

    protected function setUp(): void
    {
        $this->client = new SolrRequestClient();
        $documentUpdater = new SolrUpdateClient();
        $documentUpdater->clearCore();
        $documentUpdater->updateDocument(TestData::generateData());
    }

    public function testFacetQuery(): void
    {

        $q = new FacetQuery();

        $p = new PropertyFacet('Was born at', Datatype::DATETIME);
        $p->setRange(new Range('1969-01-01T00:00:00Z', '1970-01-01T00:00:00Z'));

        $p2 = new PropertyFacet('Publication date', Datatype::DATETIME);
        $p2->setRange(new Range('1970-01-01T00:00:00Z', '1971-01-01T00:00:00Z'));

        $q->setFacetQueries([$p, $p2]);
        $response = $this->client->requestFacet($q);

        $this->assertEquals(0, count($response->getStats()));
        $this->assertEquals(2, count($response->getRangeValueCounts()));
        $this->assertEquals(1, $response->getRangeValueCounts()[0]->getCount());
        $this->assertEquals(0, $response->getRangeValueCounts()[1]->getCount());

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