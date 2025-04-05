<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Update\Document;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;
use DIQA\FacetedSearch2\Setup;

final class DocumentUpdaterTest extends BaseTest {

    public function testUpdate(): void
    {
        $document = new Document('4711', "Markus, Schumacher.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pv = new PropertyValues($p, ['Markus']);
        $document->setPropertyValues([$pv]);

        $updater = Setup::getFacetedSearchUpdateClient();
        $updater->clearAllDocuments();
        $xml = $updater->updateDocument($document);

        $this->assertNotEmpty($xml);
    }


}