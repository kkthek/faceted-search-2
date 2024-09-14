<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Request\Datatype;
use PHPUnit\Framework\TestCase;

class HelperTest extends TestCase {

    public function testGenerateSOLRProperty() {
        $encodedProperty = Helper::generateSOLRProperty("Test Ä und ß test", Datatype::WIKIPAGE);
        list($name, $type) = Helper::parseSOLRProperty($encodedProperty);
        $this->assertEquals("Test Ä und ß test", $name);
        $this->assertEquals(Datatype::WIKIPAGE, $type);
    }
}
