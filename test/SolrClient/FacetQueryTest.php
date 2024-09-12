<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\Property;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Model\Request\Range;
use DIQA\FacetedSearch2\Model\Request\Value;
use DIQA\FacetedSearch2\SolrClient\Client;
use PHPUnit\Framework\TestCase;

final class FacetQueryTest extends TestCase {

    public function test1(): void
    {
        $client = new Client();
        $q = new FacetQuery();

        $p = new PropertyFacet();
        $p->property = 'Publication date';
        $p->type = Datatype::DATETIME;
        $p->range = new Range();
        $p->range->from = '2015-02-09T00:00:00';
        $p->range->to = '2015-09-10T00:00:00';

        $p2 = new PropertyFacet();
        $p2->property = 'Publication date';
        $p2->type = Datatype::DATETIME;
        $p2->range = new Range();
        $p2->range->from = '2016-01-01T00:00:00';
        $p2->range->to = '2016-12-31T00:00:00';

        $q->facetQueries = [$p, $p2];
        print_r($client->requestFacet($q));

        $this->assertEquals(
            1,1
        );
    }


}