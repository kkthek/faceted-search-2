<?php

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;

function setDefaultConfig() {
    // set development settings ------------------------------
    global $fsgSolrHost, $fsgSolrPort, $fsgSolrCore;
    $fsgSolrHost = "localhost";
    $fsgSolrPort = "8983";
    $fsgSolrCore = "mw";

    global $fsgExtraPropertiesToRequest;
    $fsgExtraPropertiesToRequest = [];
    $fsgExtraPropertiesToRequest[] = new Property("Has spouse", Datatype::WIKIPAGE);
    $fsgExtraPropertiesToRequest[] = new Property("Has age", Datatype::NUMBER);
    $fsgExtraPropertiesToRequest[] = new Property("Was born at", Datatype::DATETIME);

    global $fsgAnnotationsInSnippet;
    $fsgAnnotationsInSnippet[] = [ 'Employee' => ['Has spouse', "Has age", "Was born at"]];
// -------------------------------------------------------
}
