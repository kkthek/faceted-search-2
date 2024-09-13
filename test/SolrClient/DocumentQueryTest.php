<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\Property;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Model\Request\Range;
use DIQA\FacetedSearch2\Model\Request\Value;
use DIQA\FacetedSearch2\SolrClient\Client;
use PHPUnit\Framework\TestCase;

final class SolrClientTest extends TestCase {

    public function test1(): void
    {
        $client = new Client();
        $q = new DocumentQuery();
        $q->searchText = '';
        $p = new PropertyFacet('InChI', Datatype::STRING);
        $p->value = new Value('1S/C5H5P/c1-2-4-6-5-3-1/h1-5H');

        $q->propertyFacets = [$p];
        var_dump($client->requestDocuments($q));

        $this->assertEquals(
            1,1
        );
    }

    public function propertyFacetNumberRange(): void
    {
        $client = new Client();
        $q = new DocumentQuery();
        $q->searchText = '';
        $p = new PropertyFacet('Turnover frequency HCOOH', Datatype::NUMBER);
        $p->range = new Range(0, 600);
        $q->propertyFacets = [$p];
        var_dump($client->requestDocuments($q));

        $this->assertEquals(
            1,1
        );
    }

    public function testPropertyFacetDateRange(): void
    {
        $client = new Client();
        $q = new DocumentQuery();
        $q->searchText = '';
        $p = new PropertyFacet('Publication date', Datatype::DATETIME);

        $p->range = new Range('2015-02-09T00:00:00', '2015-09-10T00:00:00');

        $q->propertyFacets = [$p];
        var_dump($client->requestDocuments($q));

        $this->assertEquals(
            1,1
        );
    }

    public function testPropertyFacetNumber(): void
    {
        $client = new Client();
        $q = new DocumentQuery();
        $q->searchText = '';
        $p = new PropertyFacet('Turnover frequency HCOOH', Datatype::NUMBER);
        $p->value = new Value('11.5');

        $q->propertyFacets = [$p];
        print_r($client->requestDocuments($q));

        $this->assertEquals(
            1,1
        );
    }
}