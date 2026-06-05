<?php

namespace DIQA\FacetedSearch2;


use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Update\Document;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;
use PHPUnit\Framework\TestCase;

abstract class BaseDocumentUpdaterTest extends TestCase {

    protected FacetedSearchClient $client;
    protected FacetedSearchUpdateClient $updateClient;
    protected function setUp(): void
    {
        $this->client = ConfigTools::getFacetedSearchClient();
        $this->updateClient = ConfigTools::getFacetedSearchUpdateClient();
        BaseTestUtil::clearIndex();
    }

    public static function setUpBeforeClass(): void
    {
        require_once 'dev-config.php';
        setConfigForDevContext();
        BaseTestUtil::recreateIndexIfExists();
    }


    public function testUpdate(): void
    {
        $document = new Document('4711', "Markus, Schumacher.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pv = new PropertyValues($p, ['Markus']);
        $document->setPropertyValues([$pv]);

        $this->updateClient->clearAllDocuments();
        $xml = $this->updateClient->updateDocuments($document);

        $this->assertTrue(true);
    }
}
