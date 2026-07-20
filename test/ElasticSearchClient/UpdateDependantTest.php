<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseTestUtil;
use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\FacetedSearchClient;
use DIQA\FacetedSearch2\FacetedSearchUpdateClient;
use DIQA\FacetedSearch2\SolrClient\TestData;
use PHPUnit\Framework\TestCase;

class UpdateDependantTest extends TestCase
{

    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;

    protected function setUp(): void
    {
        $this->client = ConfigTools::getFacetedSearchClient();
        $this->updateClient = ConfigTools::getFacetedSearchUpdateClient();
        $this->updateClient->clearAllDocuments();
        $this->updateClient->refreshIndex();
        $this->updateClient->updateDocuments(TestData::generateData(), TestData::generateData7());
        $this->updateClient->refreshIndex();
    }

    public static function setUpBeforeClass(): void
    {
        global $fs2gBackendConfig, $fs2gBackend;
        $fs2gBackendConfig = array_merge($fs2gBackendConfig ?? [], [
            'indexName' => 'test',
        ]);
        $fs2gBackend = 'elastic';
        require_once 'dev/dev-config.php';
        setConfigForDevContext();
        BaseTestUtil::recreateIndexIfExists();
    }

    public function testChangeDependant(): void
    {
        $doc = TestData::generateData();
        $doc->setDisplayTitle("Macki Schumacher");
        $this->updateClient->updateDocumentWithDependant($doc);

        $this->updateClient->refreshIndex();

        $response = $this->client->requestDocument('876');

        $facet = array_filter($response->propertyFacets, fn($facet) => $facet->property->title === 'Knows');
        $this->assertEquals('Macki Schumacher', $facet[0]->values[0]->displayTitle);
    }
}
