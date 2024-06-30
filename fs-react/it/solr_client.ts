import SolrClient from "../src/solr_api/solr_client";

/**
 * Faceted search 2
 *
 * Integration test
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
let assert = require('assert');

function initSolr() {
    return new SolrClient('http://localhost:8983/solr/mw');
}

describe('search()', function () {
    it('request SOLR', function () {
        let response = initSolr().search('test');
        console.log(response);
    });
});