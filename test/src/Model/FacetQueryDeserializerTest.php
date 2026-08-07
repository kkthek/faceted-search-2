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
    "rangeQueries": [
        {
           "title": "Has name", "type": 0 
        }
    ]
}
JSON;
        $facetQuery = FacetQuery::fromJson($json);

        $this->assertEquals(1, count($facetQuery->getRangeQueries()) );
        $this->assertEquals('Has name', $facetQuery->getRangeQueries()[0]->getTitle());
        $this->assertEquals(0, $facetQuery->getRangeQueries()[0]->getType());


    }

    public function testFacetProperty(): void
    {
        $json = <<<JSON
{
    "propertyValueQueries": [
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