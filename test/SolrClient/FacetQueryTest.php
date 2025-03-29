<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
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

        $this->assertEquals(1, count($response->getValueCounts()));
        $this->assertEquals(1, $response->getValueCounts()[0]->getValues()[0]->count);

    }

    public function testFacetProperties(): void
    {

        $q = new FacetQuery();

        $p = new Property('Has name', Datatype::STRING);

        $q->setFacetProperties([$p]);
        $response = $this->client->requestFacet($q);

        $this->assertEquals(1, count($response->getValueCounts()));
        $this->assertEquals('Markus', $response->getValueCounts()[0]->values[0]->value);
        $this->assertEquals(1, $response->getValueCounts()[0]->values[0]->count);

    }


}