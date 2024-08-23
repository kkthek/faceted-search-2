<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\DocumentQuery;
use DIQA\FacetedSearch2\SolrClient\Client;
use PHPUnit\Framework\TestCase;

final class AlignmentTest extends TestCase {

    public function test1(): void
    {
        $client = new Client();
        $q = new DocumentQuery();
        $q->searchText = "Hallo";
        var_dump($client->request($q));

        $this->assertEquals(
            1,1
        );
    }
}