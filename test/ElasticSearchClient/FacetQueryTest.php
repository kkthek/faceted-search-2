<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseFacetQueryTest;
use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchQueryClient;
use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchUpdateClient;
use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\SolrClient\TestData;

final class FacetQueryTest extends BaseFacetQueryTest {
    /**
     * @throws BackendException
     */
    protected function setUp(): void
    {
        parent::setUp();
        global $fs2gBackendConfig, $fs2gBackend;
        $fs2gBackendConfig = [
            'indexName' => 'testit',
            'pass' => 'pVhvpIHOHp4DHJZcWD*u',
            'host' => '192.168.56.1',
            'ssl' => true,
        ];
        $fs2gBackend = 'elastic';
        $this->client = new ElasticSearchQueryClient();
        $elasticSearchUpdateClient = new ElasticSearchUpdateClient();
        if (!$elasticSearchUpdateClient->existsIndex()) {
            $elasticSearchUpdateClient->initIndex();
            $elasticSearchUpdateClient->refreshIndex();
        }
        $elasticSearchUpdateClient->refreshIndex();
        $elasticSearchUpdateClient->clearAllDocuments();
        $elasticSearchUpdateClient->refreshIndex();
        $elasticSearchUpdateClient->updateDocuments(TestData::generateData());
        $elasticSearchUpdateClient->refreshIndex();
    }
}
