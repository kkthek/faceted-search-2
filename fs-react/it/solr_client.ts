import SolrClient from "../src/solr_api/solr_client";
import SolrResponseParser from "../src/solr_api/response";
import {Datatype} from "../src/common/datatypes";
import QueryBuilder from "../src/common/query_builder";

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
    return new SolrClient('http://localhost:9000/proxy');
}

describe('search()', function () {
    it('request SOLR', function () {
        console.log("Test");
        let queryBuilder = new QueryBuilder();
        let property = {title: 'Publication date', type: Datatype.datetime };
        queryBuilder
            .withSearchText('carbon')
           // .withPropertyFacet({title: 'Author', type: Datatype.string })
           // .withStatField(property)
            .withFacetQuery({property: property, range: { from: new Date(Date.now()), to: new Date(Date.now()-(2*3600*24*360*1000))} })
        let response = initSolr().search(queryBuilder.build());
        response.then((response) => {
            console.log(util.inspect(response, {showHidden: false, depth: null, colors: true}));
        });
    });
});