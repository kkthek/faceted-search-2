<?php

namespace DIQA\FacetedSearch2\Maintenance;

use DIQA\FacetedSearch2\ElasticSearch\ElasticSearchUpdateClient;
use DIQA\FacetedSearch2\Exceptions\BackendException;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\MissingParameterException;
use Elastic\Elasticsearch\Exception\ServerResponseException;
use MediaWiki\MediaWikiServices;
use SMW\DIProperty;
use Title;

/**
 * Initializes the index.
 *
 */
if (!file_exists(__DIR__ . '/../../../maintenance/Maintenance.php')) {
    echo "No wiki context found!\n";
    die();
}
require_once __DIR__ . '/../../../maintenance/Maintenance.php';

class InitIndex extends \Maintenance
{

    public function __construct()
    {
        parent::__construct();
        $this->addDescription("Initializes SOLR index");
        $this->addOption('v', 'Verbose mode', false, false);

    }

    public function execute()
    {
        if (!defined('FS2_EXTENSION_VERSION')) {
            echo("ERROR: The FacetedSearch2 extension is not properly installed or configured.\n");
            die(1);
        }
        try {
            (new ElasticSearchUpdateClient())->initIndex();
        } catch (BackendException $e) {
            echo("ERROR: Creating the index failed.\n" . $e->getMessage());
            die(1);
        }

    }

}

global $maintClass;
$maintClass = "DIQA\FacetedSearch2\Maintenance\InitIndex";
require_once RUN_MAINTENANCE_IF_MAIN;
