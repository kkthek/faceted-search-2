import Client from "../src/common/client";
import {Datatype} from "../src/common/datatypes";
import StatQueryBuilder from "../src/common/stat_query_builder";

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
    let proxyUrl = 'http://localhost:9000/stats';
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

describe('stats-search', function () {
    it('request stats for datetime property', function () {
        globalResult = null;
        let query = new StatQueryBuilder()
            .withStatField({title: 'Was born at', type: Datatype.datetime})
            .build();
        client.searchStats(query).then((e) => {
            globalResult = e;
        }).catch((e) => {
            globalResult = { error_msg : 'failed', detail: e instanceof Error ? e.message:'unknown' };
        });

        asserts((response) => {
            if (response.error_msg != null) {
                assert.fail(response.detail);
                return;
            }
            assert.equal(response.stats[0].property.title, 'Was born at');
            assert.equal(response.stats[0].min, 19690610000000);
            assert.equal(response.stats[0].max, 19690610000000);

        });

    });
});
