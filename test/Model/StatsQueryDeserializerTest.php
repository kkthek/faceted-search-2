<?php
namespace DIQA\FacetedSearch2\Model;

use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use PHPUnit\Framework\TestCase;

final class StatsQueryDeserializerTest extends TestCase {

    public function testStatsQuery(): void
    {
        $json = <<<JSON
{
    "statsProperties": [{
        "property": "Modification date",
        "type": 2
    }]
}
JSON;
        $statsQuery = StatsQuery::fromJson($json);

        $this->assertEquals(1, count($statsQuery->getStatsProperties()) );
        $this->assertEquals(Datatype::DATETIME, $statsQuery->getStatsProperties()[0]->getType() );
        $this->assertEquals("Modification date", $statsQuery->getStatsProperties()[0]->getProperty() );

    }


}