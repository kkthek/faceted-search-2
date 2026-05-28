<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseStatsQueryTest;
use DIQA\FacetedSearch2\Exceptions\BackendException;

final class StatsQueryTest extends BaseStatsQueryTest {

    use ESConfig;

    /**
     * @throws BackendException
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->initESConfig();
    }
}
