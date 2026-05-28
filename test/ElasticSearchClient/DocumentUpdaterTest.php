<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseDocumentUpdaterTest;
use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchQueryClient;
use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchUpdateClient;
use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\SolrClient\TestData;

final class DocumentUpdaterTest extends BaseDocumentUpdaterTest {

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