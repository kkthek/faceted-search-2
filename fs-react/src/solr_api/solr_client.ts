/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import Helper from "./helper";
import {PropertyFacet, Datatype, MWTitle, Range, Property, ValueType} from "./datatypes";

class SolrClient {

    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async search(searchText: string,
                 attributeFacets: Array<PropertyFacet> = [],
                 categoryFacets: Array<string> = [],
                 namespaceFacets: Array<number> = [],
                 extraProperties: Array<Property> = [],
                 sort: string = "score desc, smwh_displaytitle asc"
    ) {
        let params = this.getParams(searchText, attributeFacets,
            categoryFacets, namespaceFacets, extraProperties, sort);

        const response = await fetch(this.url + '/rest.php/EnhancedRetrieval/v1/proxy?' + params.toString(), {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        return response.json();
    }

    getParams(searchText: string,
                      attributeFacets: Array<PropertyFacet>,
                      categoryFacets: Array<string>,
                      namespaceFacets: Array<number>,
                      extraProperties: Array<Property>,
                      sort: string) {
        let params = new URLSearchParams();

        let defaultProperties = [
            'smwh__MDAT_datevalue_l',
            'smwh_categories',
            'smwh_directcategories',
            'smwh_attributes',
            'smwh_properties',
            'smwh_title',
            'smwh_namespace_id',
            'score',
            'smwh_displaytitle'
        ];

        let extraPropertiesAsStrings = extraProperties
            .map((e) => Helper.encodePropertyTitleAsValue(e.title, e.type));

        params.append('defType', 'edismax');
        params.append('boost', 'max(smwh_boost_dummy)');
        params.append('facet', 'true');
        params.append('facet.field', 'smwh_categories');
        params.append('facet.field', 'smwh_attributes');
        params.append('facet.field', 'smwh_properties');
        params.append('facet.field', 'smwh_namespace_id');
        params.append('facet.mincount', "1");
        params.append('json.nl', "map");
        params.append('fl', [...defaultProperties, ...extraPropertiesAsStrings].join(','));
        params.append('hl', "true");
        params.append('hl.fl', "smwh_search_field");
        params.append('hl.simple-pre', "<b>");
        params.append('hl.simple-post', "</b>");
        params.append('hl.fragsize', "250");
        params.append('searchText', searchText);
        params.append('rows', "10");
        params.append('sort', sort);
        params.append('wt', "json");

        SolrClient.encodeAttributeFacetValues(attributeFacets).forEach((e)=> params.append('fq', e));
        SolrClient.encodeCategoryFacets(categoryFacets).forEach((e)=> params.append('fq', e));
        SolrClient.encodeNamespaceFacets(namespaceFacets).forEach((e)=> params.append('fq', e));

        params.append('q.alt', searchText === '' ? 'smwh_search_field:(*)' : SolrClient.encodeQuery(searchText.split(/\s+/)));
        return params;
    }

    private static isMWTitle(value: ValueType): value is MWTitle {
        return (value as MWTitle).title != undefined;
    }

    private static isDate(value: ValueType): value is Date {
        return (value as Date).getDate() != undefined;
    }

    private static isRange(value: ValueType): value is Range {
        return (value as Range).from != undefined && (value as Range).to != undefined;
    }

    private static encodeAttributeFacetValues(facets: PropertyFacet[]) {
        let facetValues: string[] = [];

        facets.forEach( (f) => {
            if (this.isMWTitle(f.value)) {
                let pAsValue = 'smwh_properties:'+Helper.encodePropertyTitleAsValue(f.property.title, Datatype.wikipage);
                if (!facetValues.includes(pAsValue)) {
                    facetValues.push(pAsValue);
                }
                let p = Helper.encodePropertyTitleAsProperty(f.property.title, Datatype.wikipage);
                let value = Helper.quoteValue(`${f.value.title}|${f.value.displayTitle}`);
                facetValues.push(`${p}:${value}`);
            } else {
                let pAsValue = 'smwh_attributes:' + Helper.encodePropertyTitleAsValue(f.property.title, f.property.type);
                if (!facetValues.includes(pAsValue)) {
                    facetValues.push(pAsValue);
                }
                let p = Helper.encodePropertyTitleAsProperty(f.property.title, f.property.type);
                let value;
                if (typeof f.value === 'string' || typeof f.value === 'number' || typeof f.value === 'boolean') {
                    value = Helper.quoteValue(f.value);
                } else if (this.isDate(f.value)){
                    value = f.value.toString();
                } else if (this.isRange(f.value)) {
                    value = this.encodeRange(f.value)
                }
                facetValues.push(`${p}:${value}`);
            }
        })
        return facetValues;
    }

    private static encodeRange(range: Range) {
        if (this.isDate(range.from) && this.isDate(range.to)) {
            return `${Helper.serializeDate(range.from)} TO ${Helper.serializeDate(range.to)}`;
        }
        return `${range.from} TO ${range.to}`;
    }



    private static encodeCategoryFacets(categories: string[]) {
        let facetValues: string[] = [];
        categories.forEach( (category) => {
            let pAsValue = 'smwh_categories:'+Helper.encodeWhitespacesInTitles(category);
            if (!facetValues.includes(pAsValue)) {
                facetValues.push(pAsValue);
            }
        })
        return facetValues;
    }

    private static encodeNamespaceFacets(namespaces: number[]) {
        let facetValues: string[] = [];
        namespaces.forEach( (namespaceId) => {
            let pAsValue = 'smwh_namespace_id:'+namespaceId;
            if (!facetValues.includes(pAsValue)) {
                facetValues.push(pAsValue);
            }
        })
        return facetValues;
    }

    private static encodeQuery(terms: string[]) {
        let searchTerms = terms.join(' AND ');
        let searchTermsWithPlus = terms.map((e) => '+' + e).join(' AND ');
        return `smwh_search_field:(${searchTermsWithPlus}* ) OR `
            +`smwh_search_field:(${searchTerms}) OR `
            +`smwh_title:(${searchTerms}) OR `
            +`smwh_displaytitle:(${searchTerms})`;
    }

}

export default SolrClient;