<?php

namespace DIQA\FacetedSearch2\Utils;

use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

final class DateTimeClustererTest extends TestCase
{

    public function testDateTimeCluster()
    {
        $clusterer = new DateTimeClusterer();
        $clusters = $clusterer->makeClusters("2024-07-03T14:34:21Z","2024-08-03T12:00:00Z", 10);

        $this->assertEquals("2024-07-03T00:00:00Z", $clusters[0]->from);
        $this->assertEquals("2024-07-06T02:23:59Z", $clusters[0]->to);

        $this->assertEquals("2024-07-30T21:36:00Z", $clusters[9]->from);
        $this->assertEquals("2024-08-03T23:59:59Z", $clusters[9]->to);
    }

    public function testDateTimeSingleValueCluster()
    {
        $clusterer = new DateTimeClusterer();
        $clusters = $clusterer->makeClusters("2024-07-03T14:34:21Z","2024-07-03T14:34:21Z", 10);

        $this->assertEquals("2024-07-03T14:34:21Z", $clusters[0]->from);
        $this->assertEquals("2024-07-03T14:34:21Z", $clusters[0]->to);
    }

}
