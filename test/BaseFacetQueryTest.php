<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\PropertyValueQuery;
use PHPUnit\Framework\TestCase;

abstract class BaseFacetQueryTest extends TestCase {

    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;

    protected function setUp(): void
    {
        require_once 'dev-config.php';
        setConfigForDevContext();
    }
    public function testFacetQuery(): void
    {

        $q = new FacetQuery();

        $p = new Property('Was born at', Datatype::DATETIME);

        $p2 = new Property('Publication date', Datatype::DATETIME);

        $q->setRangeQueries([$p, $p2]);
        $response = $this->client->requestFacets($q);

        $this->assertCount(1, $response->getValueCounts());
        $this->assertEquals(1, $response->getValueCounts()[0]->getValues()[0]->count);

    }

    public function testFacetProperties(): void
    {

        $q = new FacetQuery();

        $p = new PropertyValueQuery(new Property('Has name', Datatype::STRING));

        $q->setPropertyValueQueries([$p]);
        $response = $this->client->requestFacets($q);

        $this->assertCount(1, $response->getValueCounts());
        $this->assertEquals('Markus', $response->getValueCounts()[0]->values[0]->value);
        $this->assertEquals(1, $response->getValueCounts()[0]->values[0]->count);

    }

}