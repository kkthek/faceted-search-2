<?php

namespace DIQA\FacetedSearch2\ElasticSearchClient;

use DIQA\FacetedSearch2\BaseFacetQueryTest;

final class FacetQueryTest extends BaseFacetQueryTest {
    private static function init(): void
    {
        global $fs2gBackendConfig, $fs2gBackend;
        $fs2gBackendConfig = array_merge($fs2gBackendConfig ?? [], [
            'indexName' => 'test',
        ]);
        $fs2gBackend = 'elastic';
    }

    public static function setUpBeforeClass(): void
    {
        self::init();
        parent::setUpBeforeClass();
    }

}
