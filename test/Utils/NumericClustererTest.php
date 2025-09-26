<?php

namespace DIQA\FacetedSearch2\Utils;


use PHPUnit\Framework\TestCase;

final class NumericClustererTest extends TestCase
{

    public function testIntegers()
    {
        $clusterer = new NumericClusterer(true);
        $clusters = $clusterer->makeClusters(50, 500, 10);

        $this->assertEquals("50", $clusters[0]->from);
        $this->assertEquals("94", $clusters[0]->to);

        $this->assertEquals("455", $clusters[9]->from);
        $this->assertEquals("500", $clusters[9]->to);

    }

    public function testFloatValues()
    {
        $clusterer = new NumericClusterer(false);
        $clusters = $clusterer->makeClusters(1296, 1296.9, 10);

        $this->assertEquals("1296", $clusters[0]->from);
        $this->assertEquals("1296.09", $clusters[0]->to);

        $this->assertEquals("1296.81", $clusters[9]->from);
        $this->assertEquals("1296.9", $clusters[9]->to);

    }

    public function testFloatValuesSameMinMax()
    {
        $clusterer = new NumericClusterer(false);
        $clusters = $clusterer->makeClusters(145, 145, 10);

        $this->assertCount(1, $clusters);
        $this->assertEquals("145", $clusters[0]->from);
        $this->assertEquals("145", $clusters[0]->to);

    }
}
