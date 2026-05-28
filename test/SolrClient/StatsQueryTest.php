<?php
namespace DIQA\FacetedSearch2\SolrClient;


use DIQA\FacetedSearch2\BaseStatsQueryTest;


final class StatsQueryTest extends BaseStatsQueryTest {

    use SolrConfig;

    protected function setUp(): void
    {
        parent::setUp();
        $this->initSolrConfig();
    }

}