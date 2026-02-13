import DocumentQueryBuilder from "../src/common/query_builders/document_query_builder";
import Client from "../src/common/client";
import {Datatype} from "../src/common/datatypes";
import {Property} from "../src/common/property";
import {MWTitle} from "../src/common/mw_title";
import {FacetValue} from "../src/common/request/facet_value";
import {PropertyFacet} from "../src/common/request/property_facet";
import "../src/util/array_ext";

/**
 * Faceted search 2
 *
 * Integration test
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
const assert = require('assert');

let client;
function initSolr() {
    let proxyUrl = 'http://localhost:9000';
    client = new Client(proxyUrl, true);
}
initSolr();
let globalResult = null;
let asserts = (assertCallback) => {
    if (!globalResult) {
        setTimeout(asserts.bind(this, assertCallback), 100);
        return;
    }
    assertCallback(globalResult);
};

let logErrors = (e) => {
    if (e.message === 'fetch failed') {
        console.warn("\n\n-------- Is Proxy running?? -------------\n\n");
    }
    //console.log("details: %o", e);
}

describe('document-search', function () {
    it('request document with search text', function () {
        globalResult = null;
        let query = new DocumentQueryBuilder()
            .withSearchText('DIQA')
            .build();
        client.searchDocuments(query).then((e) => {
            globalResult = e;
        }).catch((e) => {
            logErrors(e);
            globalResult = { error_msg : 'failed', detail: e instanceof Error ? e.message:'unknown' };
        });
        asserts((response) => {
            if (response.error_msg != null) {
                assert.fail(response.detail);
                return;
            }
            assert.equal(response.docs[0].title, 'Markus, Schumacher.');

        });
    });
});

describe('document-search', function () {
    it('request document with wikipage property constraint', function () {
        globalResult = null;
        let query = new DocumentQueryBuilder()
            .withPropertyFacet(new PropertyFacet(new Property('Works at', Datatype.wikipage),
                [new FacetValue(null, new MWTitle('DIQA-GmbH', 'DIQA'), null)]))
            .build();
        client.searchDocuments(query).then((e) => {
            globalResult = e;
        }).catch((e) => {
            logErrors(e);
            globalResult = { error_msg : 'failed', detail: e instanceof Error ? e.message:'unknown' };
        });
        asserts((response) => {
            if (response.error_msg != null) {
                assert.fail(response.detail);
                return;
            }
            assert.equal(response.docs[0].title, 'Markus, Schumacher.');

        });
    });
});