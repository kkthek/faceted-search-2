<?php



namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchQueryClient;
use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchUpdateClient;
use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\FacetedSearchClient;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;
use DIQA\FacetedSearch2\SolrClient\TestData;

trait ESConfig {

    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;

    /**
     * @throws BackendException
     */
    public function initESConfig(): void
    {
        global $fs2gBackendConfig, $fs2gBackend;
        $fs2gBackendConfig = array_merge($fs2gBackendConfig, [
            'indexName' => 'test',
        ]);
        $fs2gBackend = 'elastic';
        $this->client = new ElasticSearchQueryClient();
        $this->updateClient = new ElasticSearchUpdateClient();
        if (!$this->updateClient->existsIndex()) {
            $this->updateClient->initIndex();
            $this->updateClient->refreshIndex();
        }
        $this->updateClient->refreshIndex();
        $this->updateClient->clearAllDocuments();
        $this->updateClient->refreshIndex();
        $this->updateClient->updateDocuments(TestData::generateData());
        $this->updateClient->refreshIndex();
    }
}
