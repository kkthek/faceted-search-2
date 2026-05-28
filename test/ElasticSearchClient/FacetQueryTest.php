<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseFacetQueryTest;
use DIQA\FacetedSearch2\Exceptions\BackendException;

final class FacetQueryTest extends BaseFacetQueryTest {

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
