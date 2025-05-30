<?php

if (version_compare('7.1.0', PHP_VERSION, '>')) {
    fwrite(
        STDERR,
        sprintf(
            'This version of PHPUnit is supported on PHP 7.1, PHP 7.2, and PHP 7.3.' . PHP_EOL .
            'You are using PHP %s (%s).' . PHP_EOL,
            PHP_VERSION,
            PHP_BINARY
        )
    );

    die(1);
}

if (!ini_get('date.timezone')) {
    ini_set('date.timezone', 'UTC');
}

foreach (array(__DIR__ . '/../../autoload.php', __DIR__ . '/../vendor/autoload.php', __DIR__ . '/vendor/autoload.php') as $file) {
    if (file_exists($file)) {
        define('COMPOSER_INSTALL', $file);

        break;
    }
}

unset($file);

if (!defined('COMPOSER_INSTALL')) {
    fwrite(
        STDERR,
        'You need to set up the project dependencies using Composer:' . PHP_EOL . PHP_EOL .
        '    composer install' . PHP_EOL . PHP_EOL .
        'You can learn all about Composer on https://getcomposer.org/.' . PHP_EOL
    );

    die(1);
}

$options = getopt('', array('prepend:'));

if (isset($options['prepend'])) {
    require $options['prepend'];
}

unset($options);

require COMPOSER_INSTALL;

use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\DocumentByIdQuery;
use DIQA\FacetedSearch2\SolrClient\SolrRequestClient;

require_once 'dev-config.php';
setConfigForDevContext();

$entityBody = file_get_contents('php://input');

$url = $_SERVER['REQUEST_URI'];
header('Content-Type: application/json');
$client = new SolrRequestClient();

try {
    if (endsWith($url, '/FacetedSearch2/v1/proxy/documents')) {
        $query = DocumentQuery::fromJson($entityBody);
        echo json_encode($client->requestDocuments($query));
    } else if (endsWith($url, '/FacetedSearch2/v1/proxy/stats')) {
        $query = StatsQuery::fromJson($entityBody);
        echo json_encode($client->requestStats($query));
    } else if (endsWith($url, '/FacetedSearch2/v1/proxy/facets')) {
        $query = FacetQuery::fromJson($entityBody);
        echo json_encode($client->requestFacets($query));
    } else if (endsWith($url, '/FacetedSearch2/v1/settings')) {
        echo json_encode(getConfigForDevContext());
    } else if (endsWith($url, '/FacetedSearch2/v1/sample-group-hierarchy')) {
        echo json_encode([
            'Group3' => [ 'Markus', 'Horst' ],
            'Group4' => ['Peter', 'Timo']
        ]);
    } else if (endsWith($url, '/FacetedSearch2/v1/proxy/document-by-id')) {
        $query = DocumentByIdQuery::fromJson($entityBody);
        echo json_encode($client->requestDocument($query->getId()));
    } else {
        throw new Exception("endpoint '$url' not supported", 400);
    }
} catch(JsonMapper_Exception $e) {
    http_response_code(400);
    echo $e->getMessage();
} catch(Exception $e) {
    http_response_code($e->getCode() !== 0 ? $e->getCode() : 500);
    echo $e->getMessage();
}


function endsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    if( !$length ) {
        return true;
    }
    return substr( $haystack, -$length ) === $needle;
}

