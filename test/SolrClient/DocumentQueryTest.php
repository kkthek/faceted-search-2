<?php
namespace DIQA\FacetedSearch2\SolrClient;


use DIQA\FacetedSearch2\BaseDocumentQueryTest;

final class DocumentQueryTest extends BaseDocumentQueryTest {

    use SolrConfig;

    protected function setUp(): void
    {
       parent::setUp();
        $this->initSolrConfig();
    }


}