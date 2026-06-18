<?php
namespace DIQA\FacetedSearch2\SolrClient;


use DIQA\FacetedSearch2\BaseStatsQueryTest;


final class StatsQueryTest extends BaseStatsQueryTest {

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