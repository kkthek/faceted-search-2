<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Document\Document;
use DIQA\FacetedSearch2\Model\Document\PropertyValue;
use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\Property;
use DIQA\FacetedSearch2\SolrClient\DocumentUpdater;
use PHPUnit\Framework\TestCase;

final class UpdaterTest extends TestCase {

    public function test1(): void
    {
        $document = new Document('4711', "Michael, Erdmann2.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pv = new PropertyValue($p, ['Michael']);
        $document->setPropertyValues([$pv]);

        $updater = new DocumentUpdater();
        $updater->clearCore();
        print $updater->updateDocument($document);

        $this->assertEquals(
            1,1
        );
    }


}