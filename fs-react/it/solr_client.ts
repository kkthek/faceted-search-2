import SolrClient from "../src/solr_api/solr_client";
import SolrResponseParser from "../src/solr_api/response";
import {Datatype} from "../src/common/datatypes";

/**
 * Faceted search 2
 *
 * Integration test
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
const assert = require('assert');
const util = require('util');

function initSolr() {
    return new SolrClient('http://localhost/main/mediawiki');
}

describe('search()', function () {
    it('request SOLR', function () {
        console.log("Test");
        let response = initSolr().search('carbon', [], [], [], [{title: 'AuthorPage', type: Datatype.wikipage}]);
        response.then((body) => {
            let parser = new SolrResponseParser(body);
            console.log(util.inspect(parser.parse(), {showHidden: false, depth: null, colors: true}));
        });
    });
});