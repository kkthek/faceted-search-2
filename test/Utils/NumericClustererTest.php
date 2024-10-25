<?php

namespace DIQA\FacetedSearch2\Utils;


use PHPUnit\Framework\TestCase;

final class NumericClustererTest extends TestCase
{

    public function testSmth()
    {
        $clusterer = new NumericClusterer(true);
        $clusters = $clusterer->makeClusters(50, 500, 10);

        $this->assertEquals("50", $clusters[0]->from);
        $this->assertEquals("94", $clusters[0]->to);

        $this->assertEquals("455", $clusters[9]->from);
        $this->assertEquals("500", $clusters[9]->to);

    }
}
