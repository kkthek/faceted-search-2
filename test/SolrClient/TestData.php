<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Document\Document;
use DIQA\FacetedSearch2\Model\Document\PropertyValues;
use DIQA\FacetedSearch2\Model\Request\Datatype;

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
        ->setFulltext("Michael Erdmann arbeitet bei DIQA-GmbH");
        return $document;
    }
}
