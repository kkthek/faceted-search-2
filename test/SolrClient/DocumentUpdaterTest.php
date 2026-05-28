<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\BaseDocumentUpdaterTest;

final class DocumentUpdaterTest extends BaseDocumentUpdaterTest {

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
        $this->updateClient = new SolrUpdateClient();
        $this->updateClient->clearAllDocuments();
        $this->updateClient->updateDocuments(TestData::generateData());
    }


}