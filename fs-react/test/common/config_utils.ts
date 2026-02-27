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
