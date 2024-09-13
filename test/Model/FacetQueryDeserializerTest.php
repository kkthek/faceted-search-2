<?php
namespace DIQA\FacetedSearch2\Model;

use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use PHPUnit\Framework\TestCase;

final class FacetQueryDeserializerTest extends TestCase {

    public function testFacetQuery(): void
    {
        $json = <<<JSON
{
    "facetQueries": [
        {
          "property": "Has name",
          "type": 0,
          "range": {
            "from": 1,
            "to": 25 
          }
        }
    ]
}
JSON;
        $statsQuery = FacetQuery::fromJson($json);

        $this->assertEquals(1, count($statsQuery->getFacetQueries()) );
        $this->assertEquals(1, $statsQuery->getFacetQueries()[0]->getRange()->getFrom() );
        $this->assertEquals(25, $statsQuery->getFacetQueries()[0]->getRange()->getTo() );

    }


}