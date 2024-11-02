import DocumentQueryBuilder from "../src/common/document_query_builder";
import Client from "../src/common/client";
import {Datatype, PropertyFacet} from "../src/common/datatypes";

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

let client;
function initSolr() {
    let proxyUrl = 'http://localhost:9000';
    client = new Client(proxyUrl);
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

describe('document-search', function () {
    it('request document with search text', function () {
        globalResult = null;
        let query = new DocumentQueryBuilder()
            .withSearchText('DIQA')
            .build();
        client.searchDocuments(query).then((e) => {
            globalResult = e;
        }).catch((e) => {
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
            .withPropertyFacet(new PropertyFacet('Works at', Datatype.wikipage,
                null, { title: 'DIQA-GmbH', displayTitle: 'DIQA'}, null))
            .build();
        client.searchDocuments(query).then((e) => {
            globalResult = e;
        }).catch((e) => {
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