<?php

namespace DIQA\FacetedSearch2\SolrClient;

use PHPUnit\Framework\TestCase;

abstract class BaseTest extends TestCase {

    protected function setUp(): void
    {
        require_once 'dev-config.php';
        setConfigForDevContext();
    }
}
