<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\BaseFacetQueryTest;

final class FacetQueryTest extends BaseFacetQueryTest {

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
        $updateClient = new SolrUpdateClient();
        $updateClient->clearAllDocuments();
        $updateClient->updateDocuments(TestData::generateData());
    }

}