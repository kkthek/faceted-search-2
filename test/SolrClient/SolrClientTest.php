<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Datatype;
use DIQA\FacetedSearch2\Model\DocumentQuery;
use DIQA\FacetedSearch2\Model\PropertyFacet;
use DIQA\FacetedSearch2\Model\Value;
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
}