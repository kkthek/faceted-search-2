<?php

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;

/**
 * This is ONLY for development necessary. The settings are used in the rest.php wiki-mock endpoint
 *
 */
function setConfigForDevContext() {

    global $wgFormattedNamespaces;
    $wgFormattedNamespaces = [0 => 'Main', 14 => 'Category', 10 => 'Template'];

    // set development settings ------------------------------
    global $fsg2SolrHost, $fsg2SolrPort, $fsg2SolrCore;
    $fsg2SolrHost = "localhost";
    $fsg2SolrPort = "8983";
    $fsg2SolrCore = "mw";

    global $fsg2ExtraPropertiesToRequest;
    $fsg2ExtraPropertiesToRequest = [];
    $fsg2ExtraPropertiesToRequest[] = new Property("Has spouse", Datatype::WIKIPAGE);
    $fsg2ExtraPropertiesToRequest[] = new Property("Has age", Datatype::NUMBER);
    $fsg2ExtraPropertiesToRequest[] = new Property("Was born at", Datatype::DATETIME);

    global $fsg2AnnotationsInSnippet;
    $fsg2AnnotationsInSnippet = [ 'Employee' => ['Has spouse', 'Has age', 'Was born at'] ];

    global $fsg2CategoriesToShowInTitle;
    $fsg2CategoriesToShowInTitle = ['Employee'];

    global $fsg2DefaultSortOrder, $fsg2CategoryFilter, $fsg2HitsPerPage, $fsg2PlaceholderText,
           $fsg2ShowCategories, $fsg2ShowSortOrder, $fsg2FacetValueLimit;

    $fsg2DefaultSortOrder = 'newest';
    $fsg2CategoryFilter = ['' => '-no filter-', 'Employee' => 'Employee' ];
    $fsg2HitsPerPage = 10;
    $fsg2PlaceholderText = 'Suche...';
    $fsg2ShowCategories = true;
    $fsg2ShowSortOrder = false;

    $fsg2FacetValueLimit = 20;
// -------------------------------------------------------
}

function getConfigForDevContext(): array
{
    $settings = [];
    foreach($GLOBALS as $var => $value) {
        if (strpos($var, 'fsg2') === 0 || strpos($var, 'wg') === 0) {
            $settings[$var] = $value;
        }
    }
    return $settings;
}
