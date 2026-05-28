<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseDocumentUpdaterTest;
use DIQA\FacetedSearch2\Exceptions\BackendException;

final class DocumentUpdaterTest extends BaseDocumentUpdaterTest {

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