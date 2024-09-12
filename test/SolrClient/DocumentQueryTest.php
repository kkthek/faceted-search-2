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
        $p = new PropertyFacet();
        $p->property = 'InChI';
        $p->type = Datatype::STRING;
        $p->value = new Value();
        $p->value->value = '1S/C5H5P/c1-2-4-6-5-3-1/h1-5H';
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
        $p = new PropertyFacet();
        $p->property = 'Turnover frequency HCOOH';
        $p->type = Datatype::NUMBER;
        $p->range = new Range();
        $p->range->from = 0;
        $p->range->to = 600;
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
        $p = new PropertyFacet();
        $p->property = 'Publication date';
        $p->type = Datatype::DATETIME;
        $p->range = new Range();
        $p->range->from = '2015-02-09T00:00:00';
        $p->range->to = '2015-09-10T00:00:00';
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
        $p = new PropertyFacet();
        $p->property = 'Turnover frequency HCOOH';
        $p->type = Datatype::NUMBER;
        $p->value = new Value();
        $p->value->value = '11.5';

        $q->propertyFacets = [$p];
        print_r($client->requestDocuments($q));

        $this->assertEquals(
            1,1
        );
    }
}