<?php

namespace DIQA\FacetedSearch2\Utils;

use PHPUnit\Framework\TestCase;

final class StatsQueryTest extends TestCase
{

    public function testDateTimeCluster()
    {
        $clusterer = new DateTimeClusterer();
        $clusters = $clusterer->makeClusters("20240703143421","20240803120000", 10);

        $this->assertEquals("20240703000000", $clusters[0][0]);
        $this->assertEquals("20240706022359", $clusters[0][1]);

        $this->assertEquals("20240730213600", $clusters[9][0]);
        $this->assertEquals("20240803235958", $clusters[9][1]);
    }

    public function testDateTimeSingleValueCluster()
    {
        $clusterer = new DateTimeClusterer();
        $clusters = $clusterer->makeClusters("20240703143421","20240703143421", 10);

        $this->assertEquals("20240703143421", $clusters[0][0]);
        $this->assertEquals("20240703143421", $clusters[0][1]);
    }
}
