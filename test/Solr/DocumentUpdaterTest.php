<?php
namespace DIQA\FacetedSearch2\Solr;

use DIQA\FacetedSearch2\BaseDocumentUpdaterTest;

final class DocumentUpdaterTest extends BaseDocumentUpdaterTest {

    private static function init(): void {
        global $fs2gBackend, $fs2gBackendConfig;
        $fs2gBackend = 'solr';
        $fs2gBackendConfig = [
            'host' => "localhost",
            'port' => "8983",
            'indexName' => "mw"
        ];
    }

    public static function setUpBeforeClass(): void
    {
        self::init();
        parent::setUpBeforeClass();
    }

}