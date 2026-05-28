<?php
namespace DIQA\FacetedSearch2\SolrClient;


use DIQA\FacetedSearch2\BaseDocumentQueryTest;
use DIQA\FacetedSearch2\ConfigTools;

final class DocumentQueryTest extends BaseDocumentQueryTest {


    protected function setUp(): void
    {
       parent::setUp();

        global $fs2gBackend, $fs2gBackendConfig;
        $fs2gBackend = 'solr';
        $fs2gBackendConfig = [
            'host' => "localhost",
            'port' => "8983",
            'indexName' => "mw"
        ];
       $this->client = new SolrRequestClient();
       $documentUpdater = new SolrUpdateClient();
       $documentUpdater->clearAllDocuments();
       $documentUpdater->updateDocuments(TestData::generateData());
    }


}