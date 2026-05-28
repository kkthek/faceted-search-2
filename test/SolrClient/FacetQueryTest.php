<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\BaseFacetQueryTest;

final class FacetQueryTest extends BaseFacetQueryTest {

    use SolrConfig;

    protected function setUp(): void
    {
        parent::setUp();
        $this->initSolrConfig();
    }

}