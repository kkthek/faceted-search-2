import SolrResponseParser from "../src/solr_api/response";
import {solrData} from "./data/response_data";

let assert = require('assert');

describe('parse()', function () {
    it('parse SOLR response', function () {
        let response = new SolrResponseParser(solrData);
        let s = response.parse();
        console.log(JSON.stringify(s));
    });
});