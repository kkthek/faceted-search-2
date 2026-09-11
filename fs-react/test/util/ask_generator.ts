import {expect} from "chai";
import {generateAskQuery, getAskParams} from "../../src/util/ask_generator";
import {DocumentQuery} from "../../src/common/request/document_query";
import {WikiContextAccessor} from "../../src/common/wiki_context";
import {Property} from "../../src/common/property";
import {PropertyFacet} from "../../src/common/request/property_facet";
import {FacetValue} from "../../src/common/request/facet_value";
import {Sort} from "../../src/common/request/sort";
import {Datatype, Order} from "../../src/common/datatypes";
import {Range} from "../../src/common/range";

/**
 * Builds a minimal DocumentQuery. Missing fields are added by callers when needed.
 */
function buildQuery(overrides: Partial<DocumentQuery> = {}): DocumentQuery {
    const q: any = {
        searchText: '',
        categoryFacets: [],
        namespaceFacets: [],
        propertyFacets: [],
        sorts: [],
        offset: 0,
        limit: 10,
        extraProperties: [],
        statFields: []
    };
    return Object.assign(q, overrides) as DocumentQuery;
}

/**
 * Builds a fake WikiContextAccessor that only implements the members used
 * by ask_generator.ts.
 */
function buildWikiContext(namespaceMap: {[id: number]: string} = {},
                          fs2SMWLanguage: {[k: string]: string} = null): WikiContextAccessor {
    const config: any = {};
    if (fs2SMWLanguage !== null) {
        config['fs2gSMWLanguage'] = fs2SMWLanguage;
    }
    // Wiki context accessor exposes the raw config; ConfigUtils.getNamespaceAsText
    // reads namespaces from it. Since we don't want to depend on the actual
    // ConfigUtils implementation, we place the mapping on the config as well.
    config['namespaces'] = namespaceMap;
    return {
        config,
        msg: (k: string) => k,
        getLocale: () => 'en',
        getNamespaceText: (id: number) => namespaceMap[id]
    } as unknown as WikiContextAccessor;
}

describe('ask_generator', () => {

    describe('generateAskQuery', () => {

        it('returns empty string for an empty query', () => {
            const query = buildQuery();
            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('');
        });

        it('generates category conditions', () => {
            const query = buildQuery({
                categoryFacets: ['Employee', 'Manager']
            } as any);
            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Category:Employee]]\n[[Category:Manager]]');
        });

        it('generates a condition for a single non-empty property value', () => {
            const property = new Property('Has name', Datatype.string);
            const facet = new PropertyFacet(property, [FacetValue.fromValue('Peter')]);
            const query = buildQuery({propertyFacets: [facet]} as any);

            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Has name::Peter]]');
        });

        it('generates a "+" condition when the only value is empty', () => {
            const property = new Property('Has name', Datatype.string);
            const emptyValue = FacetValue.fromValue('');
            // Force isEmpty() to return true regardless of internal state.
            (emptyValue as any).isEmpty = () => true;
            const facet = new PropertyFacet(property, [emptyValue]);
            const query = buildQuery({propertyFacets: [facet]} as any);

            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Has name::+]]');
        });

        it('generates a range condition for a single range value', () => {
            const property = new Property('Has age', Datatype.number);
            (property as any).isRangeProperty = () => true;

            const range = new Range(10, 20);
            const value = FacetValue.fromRange(range);
            (value as any).isEmpty = () => false;

            const facet = new PropertyFacet(property, [value]);
            const query = buildQuery({propertyFacets: [facet]} as any);

            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Has age::>=10]] [[Has age::<=20]]');
        });

        it('joins multiple non-range values with OR (||)', () => {
            const property = new Property('Has name', Datatype.string);
            (property as any).isRangeProperty = () => false;

            const v1 = FacetValue.fromValue('Peter');
            const v2 = FacetValue.fromValue('Paul');
            (v1 as any).isEmpty = () => false;
            (v2 as any).isEmpty = () => false;
            v1.toString = () => 'Peter';
            v2.toString = () => 'Paul';

            const facet = new PropertyFacet(property, [v1, v2]);
            const query = buildQuery({propertyFacets: [facet]} as any);

            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Has name::Peter || Paul]]');
        });

        it('uses only the last range for multiple range values (drilldown)', () => {
            const property = new Property('Has age', Datatype.number);
            (property as any).isRangeProperty = () => true;

            const r1 = FacetValue.fromRange(new Range(0, 100));
            const r2 = FacetValue.fromRange(new Range(30, 40));
            (r1 as any).isEmpty = () => false;
            (r2 as any).isEmpty = () => false;

            const facet = new PropertyFacet(property, [r1, r2]);
            const query = buildQuery({propertyFacets: [facet]} as any);

            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Has age::>=30]] [[Has age::<=40]]');
        });

        it('skips property facets that have no values', () => {
            const property = new Property('Has name', Datatype.string);
            const facet = new PropertyFacet(property, []);
            const query = buildQuery({
                categoryFacets: ['Employee'],
                propertyFacets: [facet]
            } as any);

            const result = generateAskQuery(query, buildWikiContext());
            expect(result).to.equal('[[Category:Employee]]');
        });
    });

    describe('getAskParams', () => {

        it('returns an empty object when the sort key is "score"', () => {
            const sort = new Sort('score', new Property('score', Datatype.internal), Order.desc);
            sort.getKey = () => 'score';
            const query = buildQuery({sorts: [sort]} as any);

            const result = getAskParams(query, buildWikiContext());
            expect(result).to.deep.equal({});
        });

        it('returns an empty object when the sort key is "ascending"', () => {
            const sort = new Sort('displaytitle', new Property('displaytitle', Datatype.internal), Order.asc);
            sort.getKey = () => 'ascending';
            const query = buildQuery({sorts: [sort]} as any);

            const result = getAskParams(query, buildWikiContext());
            expect(result).to.deep.equal({});
        });

        it('returns an empty object when the sort key is "descending"', () => {
            const sort = new Sort('displaytitle', new Property('displaytitle', Datatype.internal), Order.desc);
            sort.getKey = () => 'descending';
            const query = buildQuery({sorts: [sort]} as any);

            const result = getAskParams(query, buildWikiContext());
            expect(result).to.deep.equal({});
        });

        it('returns the mapped sort property and asc order for non-special sort keys', () => {
            const sort = new Sort('Has name', new Property('Has name', Datatype.string), Order.asc);
            sort.getKey = () => 'has_name_asc';
            const query = buildQuery({sorts: [sort]} as any);

            // Patch ConfigUtils.getSortByKeyOrDefault to return our sort
            const ConfigUtils = require('../../src/util/config_utils').default;
            const original = ConfigUtils.getSortByKeyOrDefault;
            ConfigUtils.getSortByKeyOrDefault = () => sort;

            try {
                const wikiContext = buildWikiContext({}, {'Has name': 'Has_name_translated'});
                const result = getAskParams(query, wikiContext);
                expect(result).to.deep.equal({
                    sort: 'Has_name_translated',
                    order: 'asc'
                });
            } finally {
                ConfigUtils.getSortByKeyOrDefault = original;
            }
        });

        it('falls back to the property title when no language mapping is defined', () => {
            const sort = new Sort('Has age', new Property('Has age', Datatype.number), Order.desc);
            sort.getKey = () => 'has_age_desc';
            const query = buildQuery({sorts: [sort]} as any);

            const ConfigUtils = require('../../src/util/config_utils').default;
            const original = ConfigUtils.getSortByKeyOrDefault;
            ConfigUtils.getSortByKeyOrDefault = () => sort;

            try {
                const wikiContext = buildWikiContext();
                const result = getAskParams(query, wikiContext);
                expect(result).to.deep.equal({
                    sort: 'Has age',
                    order: 'desc'
                });
            } finally {
                ConfigUtils.getSortByKeyOrDefault = original;
            }
        });
    });
});