<?php

namespace DIQA\FacetedSearch2\Maintenance;

use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchUpdateClient;
use DIQA\FacetedSearch2\Exceptions\BackendException;
use Maintenance;

/**
 * Initializes the index.
 *
 */
if (!file_exists(__DIR__ . '/../../../maintenance/Maintenance.php')) {
    echo "No wiki context found!\n";
    die();
}
require_once __DIR__ . '/../../../maintenance/Maintenance.php';

class InitIndex extends Maintenance
{

    public function __construct()
    {
        parent::__construct();
        $this->addDescription("Initializes SOLR index");
        $this->addOption('v', 'Verbose mode', false, false);
        $this->addOption('f', 'force deletion od existing index', false, false);

    }

    public function execute()
    {
        if (!defined('FS2_EXTENSION_VERSION')) {
            echo("ERROR: The FacetedSearch2 extension is not properly installed or configured.\n");
            die(1);
        }
        global $fs2gBackend;
        if ($fs2gBackend === 'solr') {
            print "\nThis maintenance script is only for ElasticSearch.\n";
            die();
        }
        try {
            $client = new ElasticSearchUpdateClient();
            print_r($client->getConfig());
            $indexExists = $client->existsIndex();
            if ($this->hasOption('f')) {
                if ($indexExists) {
                    $client->deleteIndex();
                }
                $client->initIndex();
            } else {
                if ($indexExists) {
                    print "\nIndex already exists. Use --f (force) to delete and re-create it.\n";
                    die();
                }
                $client->initIndex();
                print "\nIndex created.\n";
            }
        } catch (BackendException $e) {
            echo("ERROR: Creating the index failed.\n" . $e->getMessage());
            die(1);
        }

    }

}

global $maintClass;
$maintClass = "DIQA\FacetedSearch2\Maintenance\InitIndex";
require_once RUN_MAINTENANCE_IF_MAIN;
