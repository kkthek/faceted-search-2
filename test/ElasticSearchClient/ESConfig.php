<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\FacetedSearchClient;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;
use DIQA\FacetedSearch2\SolrClient\TestData;

trait ESConfig {

    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;

    public function initESConfig(): void
    {
        global $fs2gBackendConfig, $fs2gBackend;
        $fs2gBackendConfig = array_merge($fs2gBackendConfig, [
            'indexName' => 'test',
        ]);
        $fs2gBackend = 'elastic';

        $this->client = ConfigTools::getFacetedSearchClient();
        $this->updateClient = ConfigTools::getFacetedSearchUpdateClient();
        if (!$this->updateClient->existsIndex()) {
            $this->updateClient->initIndex();
        }
        $this->updateClient->refreshIndex();
        $this->updateClient->clearAllDocuments();
        $this->updateClient->refreshIndex();
        $this->updateClient->updateDocuments(TestData::generateData());
        $this->updateClient->refreshIndex();
    }
}
