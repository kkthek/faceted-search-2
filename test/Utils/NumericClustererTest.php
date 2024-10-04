<?php

namespace DIQA\FacetedSearch2\Utils;


use PHPUnit\Framework\TestCase;

final class NumericClustererTest extends TestCase
{

    public function testSmth()
    {
        $clusterer = new NumericClusterer();
        $clusters = $clusterer->makeClusters(50, 500, 10);

        $this->assertEquals("50", $clusters[0][0]);
        $this->assertEquals("94", $clusters[0][1]);

        $this->assertEquals("455", $clusters[9][0]);
        $this->assertEquals("500", $clusters[9][1]);

    }
}
