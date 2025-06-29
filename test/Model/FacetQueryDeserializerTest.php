<?php
namespace DIQA\FacetedSearch2\Model;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use PHPUnit\Framework\TestCase;

final class FacetQueryDeserializerTest extends TestCase {

    public function testFacetQuery(): void
    {
        $json = <<<JSON
{
    "facetQueries": [
        {
          "property": { "title": "Has name", "type": 0 },
          "range": {
                "from": 1,
                "to": 25 
          }
        }
    ]
}
JSON;
        $facetQuery = FacetQuery::fromJson($json);

        $this->assertEquals(1, count($facetQuery->getRangeQueries()) );
        $this->assertEquals(1, $facetQuery->getRangeQueries()[0]->getRange()->getFrom() );
        $this->assertEquals(25, $facetQuery->getRangeQueries()[0]->getRange()->getTo() );

    }

    public function testFacetProperty(): void
    {
        $json = <<<JSON
{
    "propertyValueConstraints": [
        {
          "property": {
            "title": "Has name",
            "type": 0
          }
        }
    ]
}
JSON;
        $facetQuery = FacetQuery::fromJson($json);

        $this->assertEquals(1, count($facetQuery->getPropertyValueQueries()) );
        $this->assertEquals("Has name", $facetQuery->getPropertyValueQueries()[0]->getProperty()->getTitle() );
        $this->assertEquals(Datatype::STRING, $facetQuery->getPropertyValueQueries()[0]->getProperty()->getType() );

    }


}