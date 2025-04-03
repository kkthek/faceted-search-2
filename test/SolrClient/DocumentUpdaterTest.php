<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\Property;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Update\Document;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;
use PHPUnit\Framework\TestCase;

final class DocumentUpdaterTest extends TestCase {

    public function testUpdate(): void
    {
        $document = new Document('4711', "Markus, Schumacher.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pv = new PropertyValues($p, ['Markus']);
        $document->setPropertyValues([$pv]);

        $updater = new SolrUpdateClient();
        $updater->clearAllDocuments();
        $xml = $updater->updateDocument($document);

        $this->assertNotEmpty($xml);
    }


}