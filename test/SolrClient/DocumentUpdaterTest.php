<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Document\Document;
use DIQA\FacetedSearch2\Model\Document\PropertyValues;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use PHPUnit\Framework\TestCase;

final class DocumentUpdaterTest extends TestCase {

    public function testUpdate(): void
    {
        $document = new Document('4711', "Michael, Erdmann.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pv = new PropertyValues($p, ['Michael']);
        $document->setPropertyValues([$pv]);

        $updater = new SolrUpdateClient();
        $updater->clearCore();
        $xml = $updater->updateDocument($document);

        $this->assertNotEmpty($xml);
    }


}