import {Range} from "../../src/common/range";
import {WikiContextAccessor} from "../../src/common/wiki_context";
import {Document} from "../../src/common/response/document";
import {NamespaceFacetValue} from "../../src/common/response/namespace_facet_value";
import ConfigUtils from "../../src/util/config_utils";

const assert = require('assert');
const util = require('util')
const log = (obj: unknown) => console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}));
describe('replace magic word', function () {
    it('FULLPAGENAME', function () {

        const config = new WikiContextAccessor({wgFormattedNamespaces: {0: "Main", 14: "Category", 10: "Template"}}, {},
            "dummy", () => '', {});
        const d = new Document();
        d.title = 'Test';
        d.namespaceFacet = new NamespaceFacetValue();
        d.namespaceFacet.namespace = 14;

        let url = ConfigUtils.replaceMagicWords(d, "{{FULLPAGENAME}}", config);
        assert.equal(url, 'Category%3ATest');

        url = ConfigUtils.replaceMagicWords(d, "{{FULLPAGENAMEE}}", config);
        assert.equal(url, 'Category%3ATest');
    });
});

describe('replace magic word', function () {
    it('PAGENAME', function () {

        const config = new WikiContextAccessor({wgFormattedNamespaces: {0: "Main", 14: "Category", 10: "Template"}}, {},
            "dummy", () => '', {});
        const d = new Document();
        d.title = 'Test';
        d.namespaceFacet = new NamespaceFacetValue();
        d.namespaceFacet.namespace = 0;

        let url = ConfigUtils.replaceMagicWords(d, "{{PAGENAME}}", config);
        assert.equal(url, 'Test');

        url = ConfigUtils.replaceMagicWords(d, "{{PAGENAMEE}}", config);
        assert.equal(url, 'Test');

    });
});

describe('replace magic word', function () {
    it('PAGENAME multiple replacements', function () {

        const config = new WikiContextAccessor({wgFormattedNamespaces: {0: "Main", 14: "Category", 10: "Template"}}, {},
            "dummy", () => '', {});
        const d = new Document();
        d.title = 'Test';
        d.namespaceFacet = new NamespaceFacetValue();
        d.namespaceFacet.namespace = 0;

        let url = ConfigUtils.replaceMagicWords(d, "{{PAGENAME}} - {{PAGENAME}}", config);
        assert.equal(url, 'Test - Test');



    });
});



import { expect } from 'chai';

describe('ConfigUtils.replaceSMWVariables', () => {

    function makeDoc(facetMap: Record<string, { values: any[] } | null>) {
        return {
            getPropertyFacetValues: (propertyName: string) => {
                if (Object.prototype.hasOwnProperty.call(facetMap, propertyName)) {
                    return facetMap[propertyName];
                }
                return null;
            }
        } as any;
    }

    it('should return the URL unchanged when there are no SMW variables', () => {
        const doc = makeDoc({});
        const url = 'https://example.com/page?foo=bar';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/page?foo=bar');
    });

    it('should replace a single SMW variable with a plain string value', () => {
        const doc = makeDoc({ 'MyProperty': { values: ['hello world'] } });
        const url = 'https://example.com/?q={SMW:MyProperty}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?q=' + encodeURIComponent('hello world'));
    });

    it('should replace a single SMW variable with an MWTitle value', () => {
        const doc = makeDoc({ 'MyTitle': { values: [{ title: 'Some Article' }] } });
        const url = 'https://example.com/?q={SMW:MyTitle}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?q=' + encodeURIComponent('Some Article'));
    });

    it('should join multiple values with a comma', () => {
        const doc = makeDoc({ 'Tags': { values: ['alpha', 'beta', 'gamma'] } });
        const url = 'https://example.com/?tags={SMW:Tags}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?tags=' + encodeURIComponent('alpha,beta,gamma'));
    });

    it('should join multiple MWTitle values with a comma', () => {
        const doc = makeDoc({
            'Links': {
                values: [
                    { title: 'Page One' },
                    { title: 'Page Two' }
                ]
            }
        });
        const url = 'https://example.com/?links={SMW:Links}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?links=' + encodeURIComponent('Page One,Page Two'));
    });

    it('should skip a variable when getPropertyFacetValues returns null', () => {
        const doc = makeDoc({ 'Missing': null });
        const url = 'https://example.com/?q={SMW:Missing}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?q={SMW:Missing}');
    });

    it('should replace multiple different SMW variables in the same URL', () => {
        const doc = makeDoc({
            'Author': { values: ['John Doe'] },
            'Category': { values: ['Science'] }
        });
        const url = 'https://example.com/?author={SMW:Author}&cat={SMW:Category}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal(
            'https://example.com/?author=' + encodeURIComponent('John Doe') +
            '&cat=' + encodeURIComponent('Science')
        );
    });

    it('should URL-encode special characters in values', () => {
        const doc = makeDoc({ 'Prop': { values: ['hello & world / test'] } });
        const url = 'https://example.com/?p={SMW:Prop}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?p=' + encodeURIComponent('hello & world / test'));
    });

    it('should handle an empty values array by replacing with an empty (encoded) string', () => {
        const doc = makeDoc({ 'Empty': { values: [] } });
        const url = 'https://example.com/?q={SMW:Empty}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal('https://example.com/?q=' + encodeURIComponent(''));
    });
    it('should replace only the matched variable and leave unknown ones intact', () => {
        const doc = makeDoc({
            'Known': { values: ['foo'] }
            // 'Unknown' is not in the map → getPropertyFacetValues returns null
        });
        const url = 'https://example.com/?a={SMW:Known}&b={SMW:Unknown}';

        const result = ConfigUtils.replaceSMWVariables(doc, url);

        expect(result).to.equal(
            'https://example.com/?a=' + encodeURIComponent('foo') + '&b={SMW:Unknown}'
        );
    });
});
