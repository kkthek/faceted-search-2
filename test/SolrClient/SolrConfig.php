<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\FacetedSearchClient;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;

trait SolrConfig {

    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;
    public function initSolrConfig(): void
    {
        global $fs2gBackend, $fs2gBackendConfig;
        $fs2gBackend = 'solr';
        $fs2gBackendConfig = [
            'host' => "localhost",
            'port' => "8983",
            'indexName' => "mw"
        ];
        $this->client = ConfigTools::getFacetedSearchClient();
        $this->updateClient = ConfigTools::getFacetedSearchUpdateClient();
        $this->updateClient->clearAllDocuments();
        $this->updateClient->updateDocuments(TestData::generateData());
    }
}
