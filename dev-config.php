<?php

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;

//error_reporting(E_ALL);
//ini_set('display_errors', '1');

/**
 * This is ONLY for development necessary. The settings are used in the rest.php wiki-mock endpoint
 *
 */
function setConfigForDevContext() {

    global $wgFormattedNamespaces, $wgServer, $wgArticlePath;
    $wgFormattedNamespaces = [0 => 'Main', 14 => 'Category', 10 => 'Template'];
    $wgServer = "http://localhost";
    $wgArticlePath = '/main/mediawiki/$1';

    // set development settings ------------------------------
    global $fs2gSolrHost, $fs2gSolrPort, $fs2gSolrCore;
    $fs2gSolrHost = "localhost";
    $fs2gSolrPort = "8983";
    $fs2gSolrCore = "mw";

    global $fs2gExtraPropertiesToRequest;
    $fs2gExtraPropertiesToRequest = [];
    $fs2gExtraPropertiesToRequest[] = new Property("Has spouse", Datatype::WIKIPAGE);
    $fs2gExtraPropertiesToRequest[] = new Property("Has age", Datatype::NUMBER);
    $fs2gExtraPropertiesToRequest[] = new Property("Was born at", Datatype::DATETIME);

    global $fs2gAnnotationsInSnippet;
    $fs2gAnnotationsInSnippet = [ 'Employee' => ['Has spouse', 'Has age', 'Was born at'] ];

    global $fs2gCategoriesToShowInTitle;
    $fs2gCategoriesToShowInTitle = ['Employee'];

    global $fs2gDefaultSortOrder, $fs2gCategoryFilter, $fs2gHitsPerPage, $fs2gPlaceholderText,
           $fs2gShowCategories, $fs2gShowSortOrder, $fs2gFacetValueLimit, $fs2gShowNamespaces,
           $fs2gShowArticleProperties, $fs2gShownFacets, $fs2gShownCategoryFacets, $fs2gPromotionProperty,
           $fs2gDemotionProperty, $fs2gNumericPropertyClusters, $fs2gDateTimePropertyClusters, $fs2gNamespaceConstraint,
           $fs2gFacetsWithOR, $fs2gShowSolrScore, $fs2gCreateNewPageLink, $fs2gShowFileInOverlay;

    $fs2gDefaultSortOrder = 'newest';
    $fs2gCategoryFilter =  ['' => 'all categories', 'Employee' => 'Employee' ];
    $fs2gHitsPerPage = 10;
    $fs2gPlaceholderText = 'Suche...';
    $fs2gShowCategories = true;
    $fs2gShowSortOrder = true;
    $fs2gShowNamespaces = true;

    $fs2gFacetValueLimit = 20;
    $fs2gShowArticleProperties = true;

    $fs2gShownFacets = []; //['Employee' => ['Works at'] ];

    $fs2gShownCategoryFacets = []; //['Employee'];

    $fs2gPromotionProperty = false;
    if ($fs2gPromotionProperty !== false) {
        $fs2gExtraPropertiesToRequest[] = new Property($fs2gPromotionProperty, Datatype::BOOLEAN);
    }
    $fs2gDemotionProperty = false;
    if ($fs2gDemotionProperty !== false) {
        $fs2gExtraPropertiesToRequest[] = new Property($fs2gDemotionProperty, Datatype::BOOLEAN);
    }

    $fs2gNumericPropertyClusters = [];// ['Has age' => ['min'=> 0 , 'max'=>100, 'lowerBound'=>20, 'upperBound'=>70, 'interval'=>5] ];

    $fs2gDateTimePropertyClusters = []; //['Was born at']=['min'=>'1970-01-01-00:00:00','max'=>'2000-12-31-23:59:59'];

    $fs2gNamespaceConstraint = []; // ['sysop' => [ 0, 10, 14] ];

    $fs2gFacetsWithOR = ['Has name'];

    $fs2gShowSolrScore = true;

    $fs2gCreateNewPageLink = false;//'?action=edit';

    $fs2gShowFileInOverlay =  ['pdf'];
    if ($fs2gShowFileInOverlay) {
        $fs2gExtraPropertiesToRequest[] = new Property("diqa import fullpath", Datatype::STRING);
    }
// -------------------------------------------------------
}

function getConfigForDevContext(): array
{
    $settings = [];
    foreach($GLOBALS as $var => $value) {
        if (strpos($var, 'fs2g') === 0 || strpos($var, 'wg') === 0) {
            $settings[$var] = $value;
        }
    }
    return $settings;
}
