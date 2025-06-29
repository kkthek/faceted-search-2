<?php
namespace DIQA\FacetedSearch2\Model;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use PHPUnit\Framework\TestCase;

final class DocumentQueryDeserializerTest extends TestCase {

    public function testPropertyFacet(): void
    {
        $json = <<<JSON
{
    "propertyFacets": [
        {
          "property": { "title": "Has name", "type": 0 },
          "values": [{ "value": "Markus" }] 
        }
    ]
}
JSON;
        $documentQuery = DocumentQuery::fromJson($json);

        $this->assertEquals(1, count($documentQuery->getPropertyFacets()) );
        $this->assertEquals('Has name', $documentQuery->getPropertyFacets()[0]->getProperty()->getTitle() );
        $this->assertEquals(Datatype::STRING, $documentQuery->getPropertyFacets()[0]->getProperty()->getType() );
        $this->assertEquals('Markus', $documentQuery->getPropertyFacets()[0]->getValues()[0]->getValue() );
        $this->assertNull($documentQuery->getPropertyFacets()[0]->getValues()[0]->getMwTitle() );
        $this->assertNull($documentQuery->getPropertyFacets()[0]->getValues()[0]->getRange() );
    }

    public function testPropertyFacetMwTitle(): void
    {
        $json = <<<JSON
{
    "propertyFacets": [
        {
        "property": { "title": "Lives in", "type": 4 },
         "values": [
              {   "mwTitle": {
                    "title": "Koblenz, RP", 
                    "displayTitle": "Koblenz" 
                  } 
              }
          ] 
        }
    ]
}
JSON;
        $documentQuery = DocumentQuery::fromJson($json);

        $this->assertEquals(1, count($documentQuery->getPropertyFacets()) );
        $this->assertEquals('Lives in', $documentQuery->getPropertyFacets()[0]->getProperty()->getTitle() );
        $this->assertEquals(Datatype::WIKIPAGE, $documentQuery->getPropertyFacets()[0]->getProperty()->getType() );
        $this->assertEquals('Koblenz, RP', $documentQuery->getPropertyFacets()[0]->getValues()[0]->getMwTitle()->getTitle() );
        $this->assertEquals('Koblenz', $documentQuery->getPropertyFacets()[0]->getValues()[0]->getMwTitle()->getDisplayTitle() );
        $this->assertNull($documentQuery->getPropertyFacets()[0]->getValues()[0]->getValue() );
        $this->assertNull($documentQuery->getPropertyFacets()[0]->getValues()[0]->getRange() );
    }
}