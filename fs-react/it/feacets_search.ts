import Client from "../src/common/client";
import {Datatype, Property, Range, RangeQuery} from "../src/common/datatypes";
import FacetsQueryBuilder from "../src/common/facet_query_builder";

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

let logErrors = (e) => {
    if (e.message === 'fetch failed') {
        console.warn("\n\n-------- Is Proxy running?? -------------\n\n");
    }
    //console.log("details: %o", e);
}

describe('fecets-search', function () {
    it('request facets for datetime property', function () {
        globalResult = null;
        let range = new Range(new Date(Date.parse("1969-01-01T00:00:00Z")), new Date(Date.parse("1970-01-01T00:00:00Z")));
        let query = new FacetsQueryBuilder()
            .withRangeQuery(new RangeQuery(new Property('Was born at',Datatype.datetime),
                    range))
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
            assert.equal(response.valueCounts[0].values[0].range.from.toISOString(), "1969-01-01T00:00:00.000Z");
            assert.equal(response.valueCounts[0].values[0].range.to.toISOString(), "1970-01-01T00:00:00.000Z");
            assert.equal(response.valueCounts[0].values[0].count, 1);


        });

    });
});
