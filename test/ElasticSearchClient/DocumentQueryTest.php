<?php
namespace DIQA\FacetedSearch2\ElasticSearchClient;


use DIQA\FacetedSearch2\BaseDocumentQueryTest;
use DIQA\FacetedSearch2\Exceptions\BackendException;


final class DocumentQueryTest extends BaseDocumentQueryTest {

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