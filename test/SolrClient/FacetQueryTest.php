<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\FacetValue;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Model\Request\PropertyRange;
use DIQA\FacetedSearch2\Model\Request\PropertyValueQuery;
use DIQA\FacetedSearch2\Setup;

final class FacetQueryTest extends BaseTest {

    private $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = ConfigTools::getFacetedSearchClient();
        $documentUpdater = ConfigTools::getFacetedSearchUpdateClient();
        $documentUpdater->clearAllDocuments();
        $documentUpdater->updateDocument(TestData::generateData());
    }

    public function testFacetQuery(): void
    {

        $q = new FacetQuery();

        $p = new Property('Was born at', Datatype::DATETIME);

        $p2 = new Property('Publication date', Datatype::DATETIME);

        $q->setRangeQueries([$p, $p2]);
        $response = $this->client->requestFacets($q);

        $this->assertEquals(1, count($response->getValueCounts()));
        $this->assertEquals(1, $response->getValueCounts()[0]->getValues()[0]->count);

    }

    public function testFacetProperties(): void
    {

        $q = new FacetQuery();

        $p = new PropertyValueQuery(new Property('Has name', Datatype::STRING));

        $q->setPropertyValueQueries([$p]);
        $response = $this->client->requestFacets($q);

        $this->assertEquals(1, count($response->getValueCounts()));
        $this->assertEquals('Markus', $response->getValueCounts()[0]->values[0]->value);
        $this->assertEquals(1, $response->getValueCounts()[0]->values[0]->count);

    }


}