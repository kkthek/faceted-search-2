import Client from "../src/common/client";
import {Datatype} from "../src/common/datatypes";
import StatQueryBuilder from "../src/common/stat_query_builder";
import FacetsQueryBuilder from "../src/common/facets_query_builder";

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

describe('fecets-search', function () {
    it('request facets for datetime property', function () {
        globalResult = null;
        let query = new FacetsQueryBuilder()
            .withRangeQuery({property: 'Was born at', type: Datatype.datetime,
                    range: {from: "1969-01-01T00:00:00Z", to: "1970-01-01T00:00:00Z"} })
            .build();
        client.searchFacets(query).then((e) => {
            globalResult = e;
        }).catch((e) => {
            globalResult = { error_msg : 'failed', detail: e instanceof Error ? e.message:'unknown' };
        });

        asserts((response) => {
            if (response.error_msg != null) {
                assert.fail(response.detail);
                return;
            }

            assert.equal(response.rangeValueCounts.length, 1);
            assert.equal(response.rangeValueCounts[0].property.title, "Was born at");
            assert.equal(response.rangeValueCounts[0].range.from, "19690101000000");
            assert.equal(response.rangeValueCounts[0].range.to, "19700101000000");
            assert.equal(response.rangeValueCounts[0].count, 1);


        });

    });
});
