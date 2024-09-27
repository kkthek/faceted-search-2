<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Document\Document;
use DIQA\FacetedSearch2\Model\Document\PropertyValues;
use DIQA\FacetedSearch2\Model\Common\Datatype;

class TestData {

    public static function generateData() {
        $document = new Document('4711', "Michael, Erdmann.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pvName = new PropertyValues($p, ['Michael']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [54]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1969-06-10T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['false']);

        $p = new Property('Works at', Datatype::WIKIPAGE);
        $pvWorksAt = new PropertyValues($p, [new MWTitle('DIQA-GmbH', 'DIQA')]);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvWorksAt])
        ->setFulltext("Michael Erdmann arbeitet bei DIQA-GmbH")
        ->setCategories(["Employee"])
        ->setDirectCategories(["Employee"])
        ->setNamespace(0);
        return $document;
    }

    public static function generateData2() {
        $document = new Document('815', "Peter, Maier.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pvName = new PropertyValues($p, ['Peter']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [32]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1993-06-10T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['false']);

        $p = new Property('Works at', Datatype::WIKIPAGE);
        $pvWorksAt = new PropertyValues($p, [new MWTitle('Mercedes AG', 'Mercedes')]);

        $p = new Property('Has spouse', Datatype::WIKIPAGE);
        $pvSpouse = new PropertyValues($p, [new MWTitle('Maria, Maier', 'Maria')]);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvWorksAt, $pvSpouse])
            ->setFulltext("Peter Maier arbeitet bei Mercedes.")
            ->setCategories(["Employee"])
            ->setDirectCategories(["Employee"])
            ->setNamespace(0);
        return $document;
    }


}
