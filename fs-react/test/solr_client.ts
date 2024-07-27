/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import SolrClient from "../src/solr_api/solr_client";
import {Datatype} from "../src/common/datatypes";

function initSolr() {
    return new SolrClient('http://localhost:8983/solr/mw');
}

/**
 * Demo test
 */
let assert = require('assert');

describe('getParams()', function () {
    it('search text one word', function () {
        let params = initSolr().getParams("test", [], [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('search text 2 words', function () {
        let params = initSolr().getParams("test test2", [], [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test+test2&rows=10&sort=&wt=json&q.alt=smwh_search_field%3A%28%2Btest+AND+%2Btest2*+%29+OR+smwh_search_field%3A%28test+AND+test2%29+OR+smwh_title%3A%28test+AND+test2%29+OR+smwh_displaytitle%3A%28test+AND+test2%29');
    });
});

describe('getParams()', function () {
    it('propertyFacets with arbitrary value for a property', function () {
        let propertyFacets = [
            {property: {title: 'HasChild', type: Datatype.string}, value: null}
        ];
        let params = initSolr().getParams("test", propertyFacets, [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.field=smwh_HasChild_xsdvalue_s&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('propertyFacets with 1 value for a property', function () {
        let propertyFacets = [
            {property: {title: 'HasChild', type: Datatype.string}, value: 'Thomas'}
        ];
        let params = initSolr().getParams("test", propertyFacets, [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&fq=smwh_attributes%3Asmwh_HasChild_xsdvalue_t&fq=smwh_HasChild_s%3A%22Thomas%22&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('propertyFacets with 2 values for same attribute', function () {
        let propertyFacets = [
            {property: {title: 'HasChild', type: Datatype.string}, value: 'Thomas' },
            {property: {title: 'HasChild', type: Datatype.string}, value: 'Markus' }
        ];
        let params = initSolr().getParams("test", propertyFacets, [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&fq=smwh_attributes%3Asmwh_HasChild_xsdvalue_t&fq=smwh_HasChild_s%3A%22Thomas%22&fq=smwh_HasChild_s%3A%22Markus%22&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('propertyFacets with 1 wikipage value for a property', function () {
        let propertyFacets = [
            {property: {title: 'IsInCity', type: Datatype.wikipage}, value:  { title: 'Munich', displayTitle: 'München'} }
        ];
        let params = initSolr().getParams("test", propertyFacets, [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&fq=smwh_properties%3Asmwh_IsInCity_t&fq=smwh_IsInCity_s%3A%22Munich%7CM%C3%BCnchen%22&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('propertyFacets with 2 wikipage values for same property', function () {
        let propertyFacets = [
            {property: {title: 'IsInCity', type: Datatype.wikipage}, value:  { title: 'Munich', displayTitle: 'München'} },
            {property: {title: 'IsInCity', type: Datatype.wikipage}, value:  { title: 'Frankfurt', displayTitle: 'Frankfurt'} }
        ];
        let params = initSolr().getParams("test", propertyFacets, [], [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&fq=smwh_properties%3Asmwh_IsInCity_t&fq=smwh_IsInCity_s%3A%22Munich%7CM%C3%BCnchen%22&fq=smwh_IsInCity_s%3A%22Frankfurt%7CFrankfurt%22&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('categoryFacets', function () {
        let categoryFacets = ['Country', 'Western country'];
        let params = initSolr().getParams("test", [], categoryFacets, [], [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&fq=smwh_categories%3ACountry&fq=smwh_categories%3AWestern_country&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});


describe('getParams()', function () {
    it('namespaceFacets', function () {
        let namespaceFacets = [14, 10];
        let params = initSolr().getParams("test", [], [], namespaceFacets, [], [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&fq=smwh_namespace_id%3A14&fq=smwh_namespace_id%3A10&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

describe('getParams()', function () {
    it('extraProperties', function () {
        let extraProperties = [{title: 'Has Name', type: Datatype.string}];
        let params = initSolr().getParams("test", [], [], [], extraProperties, [], [], []);
        console.log(params.toString());
        assert.equal(params.toString(), 'defType=edismax&boost=max%28smwh_boost_dummy%29&facet=true&facet.field=smwh_categories&facet.field=smwh_attributes&facet.field=smwh_properties&facet.field=smwh_namespace_id&facet.mincount=1&json.nl=map&fl=smwh__MDAT_datevalue_l%2Csmwh_categories%2Csmwh_directcategories%2Csmwh_attributes%2Csmwh_properties%2Csmwh_title%2Csmwh_namespace_id%2Cid%2Cscore%2Csmwh_displaytitle%2Csmwh_Has__Name_xsdvalue_t&hl=true&hl.fl=smwh_search_field&hl.simple-pre=%3Cb%3E&hl.simple-post=%3C%2Fb%3E&hl.fragsize=250&searchText=test&rows=10&sort=&wt=json&q.alt=smwh_search_field%3A%28%2Btest*+%29+OR+smwh_search_field%3A%28test%29+OR+smwh_title%3A%28test%29+OR+smwh_displaytitle%3A%28test%29');
    });
});

