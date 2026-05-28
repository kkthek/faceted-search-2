<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\BaseDocumentUpdaterTest;

final class DocumentUpdaterTest extends BaseDocumentUpdaterTest {

    use SolrConfig;

    protected function setUp(): void
    {
        parent::setUp();
        $this->initSolrConfig();
    }

}