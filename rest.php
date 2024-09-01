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

use DIQA\FacetedSearch2\Model\DocumentQuery;
use DIQA\FacetedSearch2\SolrClient\Client;

$entityBody = file_get_contents('php://input');

$mapper = new JsonMapper();
$documentQuery = $mapper->map(json_decode($entityBody), new DocumentQuery());

$client = new Client();
echo json_encode($client->request($documentQuery));