import Client from "../src/common/client";
import {Datatype} from "../src/common/datatypes";
import FacetsQueryBuilder from "../src/common/query_builders/facet_query_builder";
import {Property} from "../src/common/property";
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

describe('facets-search', function () {
    it('request facets for datetime property', function () {
        globalResult = null;

        let query = new FacetsQueryBuilder()
            .withRangeQuery(new Property('Was born at',Datatype.datetime))
            .build();
        client.searchFacets(query).then((e) => {
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
            assert.equal(response.valueCounts.length, 1);
            assert.equal(response.valueCounts[0].property.title, "Was born at");
            assert.equal(response.valueCounts[0].values[0].range.from.toISOString(), "1969-06-10T00:00:00.000Z");
            assert.equal(response.valueCounts[0].values[0].range.to.toISOString(), "1969-06-10T00:00:00.000Z");
            assert.equal(response.valueCounts[0].values[0].count, 1);


        });

    });
});
