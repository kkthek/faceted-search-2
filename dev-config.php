<?php

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;

function setDefaultConfig() {
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
    $fsg2AnnotationsInSnippet[] = [ 'Employee' => ['Has spouse', "Has age", "Was born at"]];
// -------------------------------------------------------
}
