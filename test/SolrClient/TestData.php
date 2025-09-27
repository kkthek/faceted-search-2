<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Update\Document;
use DIQA\FacetedSearch2\Model\Update\PropertyValues;
use DIQA\FacetedSearch2\Model\Common\Datatype;

class TestData {

    public static function generateData() {
        $document = new Document('4711', "Markus, Schumacher.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pvName = new PropertyValues($p, ['Markus']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [54]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1969-06-10T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['false']);

        $p = new Property('Works at', Datatype::WIKIPAGE);
        $pvWorksAt = new PropertyValues($p, [new MWTitle('DIQA-GmbH', 'DIQA')]);

        $p = new Property('Diqa import fullpath', Datatype::STRING);
        $pvDiqa_import_fullpath = new PropertyValues($p, ['https://pdfobject.com/pdf/sample.pdf']);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvWorksAt, $pvDiqa_import_fullpath])
        ->setFulltext("Markus Schumacher arbeitet bei DIQA-GmbH")
        ->setCategories(["Employee"])
        ->setDirectCategories(["Employee"])
        ->setNamespace(0);
        return $document;
    }

    public static function generateData2() {
        $document = new Document('815', "Maier, Peter.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pvName = new PropertyValues($p, ['Peter']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [32]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1993-06-10T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['false']);

        $p = new Property('Works at', Datatype::WIKIPAGE);
        $pvWorksAt = new PropertyValues($p, [new MWTitle('VW', 'Volkswagen')]);

        $p = new Property('Has spouse', Datatype::WIKIPAGE);
        $pvSpouse = new PropertyValues($p, [new MWTitle('Maier, Maria', 'Maria')]);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvWorksAt, $pvSpouse])
            ->setFulltext("Peter Maier arbeitet bei Mercedes.")
            ->setCategories(["Employee"])
            ->setDirectCategories(["Employee"])
            ->setNamespace(0);
        return $document;
    }

    public static function generateData3() {
        $document = new Document('123', "Günther, Horst", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pvName = new PropertyValues($p, ['Horst']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [66]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1973-02-11T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['true']);

        $p = new Property('Has spouse', Datatype::WIKIPAGE);
        $pvSpouse = new PropertyValues($p, [new MWTitle('Günther, Brigitte', 'Brigitte')]);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvSpouse])
            ->setFulltext("Horst Günther ist im Ruhestand.")
            ->setCategories(["Pensionist"])
            ->setNamespace(0);
        return $document;
    }

    public static function generateData4() {
        $document = new Document('123789', "Müller, Timo.", "", 0);
        $p = new Property('Has name', Datatype::STRING);

        $pvName = new PropertyValues($p, ['Timo']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [33]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1992-03-08T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['false']);

        $p = new Property('Works at', Datatype::WIKIPAGE);
        $pvWorksAt = new PropertyValues($p, [new MWTitle('VW / Audi', 'Audi AG')]);
        $pvWorksAt2 = new PropertyValues($p, [new MWTitle('DIQA-GmbH', 'DIQA')]);

        $p = new Property('Has spouse', Datatype::WIKIPAGE);
        $pvSpouse = new PropertyValues($p, [new MWTitle('Müller, Marina', 'Marina')]);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvWorksAt, $pvWorksAt2, $pvSpouse])
            ->setFulltext("Timo Müller arbeitet bei der Audi AG.")
            ->setCategories(["Employee"])
            ->setDirectCategories(["Employee"])
            ->setNamespace(0);
        return $document;
    }

    public static function generateData5() {
        $document = new Document('66666', "Schmidt, Markus", "", 0);
        $p = new Property('Has name', Datatype::STRING);
        $pvName = new PropertyValues($p, ['Markus']);

        $p = new Property('Description', Datatype::STRING);
        $pvDescription = new PropertyValues($p, ['Loves <b>Football</b> a lot']);

        $p = new Property('Has age', Datatype::NUMBER);
        $pvAge = new PropertyValues($p, [54]);

        $p = new Property('Was born at', Datatype::DATETIME);
        $pvWasBornAt = new PropertyValues($p, ['1976-02-18T00:00:00Z']);

        $p = new Property('Is on pension', Datatype::BOOLEAN);
        $pvIsOnPension = new PropertyValues($p, ['false']);

        $p = new Property('Works at', Datatype::WIKIPAGE);
        $pvWorksAt = new PropertyValues($p, [new MWTitle("Firma XY\n123", "Firma XY\n123")]);

        $p = new Property('Has spouse', Datatype::WIKIPAGE);
        $pvSpouse = new PropertyValues($p, [new MWTitle('Schmidt, Johanna', 'Johanna')]);

        $document->setPropertyValues([$pvName, $pvAge, $pvWasBornAt, $pvIsOnPension, $pvWorksAt, $pvSpouse, $pvDescription])
            ->setFulltext("Markus Schmidt arbeitet bei Firma XY:12/3.")
            ->setCategories(["Employee"])
            ->setDirectCategories(["Employee"])
            ->setNamespace(0);
        return $document;
    }
}
