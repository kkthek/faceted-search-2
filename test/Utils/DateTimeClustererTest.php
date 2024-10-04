<?php

namespace DIQA\FacetedSearch2\Utils;

use PHPUnit\Framework\TestCase;

final class StatsQueryTest extends TestCase
{

    public function testDateTimeCluster()
    {
        $clusterer = new DateTimeClusterer();
        $clusters = $clusterer->makeClusters("20240703143421","20240803120000", 10);

        $this->assertEquals("2024-07-03T00:00:00", $clusters[0]->from);
        $this->assertEquals("2024-07-06T02:23:59", $clusters[0]->to);

        $this->assertEquals("2024-07-30T21:36:00", $clusters[9]->from);
        $this->assertEquals("2024-08-03T23:59:58", $clusters[9]->to);
    }

    public function testDateTimeSingleValueCluster()
    {
        $clusterer = new DateTimeClusterer();
        $clusters = $clusterer->makeClusters("20240703143421","20240703143421", 10);

        $this->assertEquals("2024-07-03T14:34:21", $clusters[0]->from);
        $this->assertEquals("2024-07-03T14:34:21", $clusters[0]->to);
    }
}
