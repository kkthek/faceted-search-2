/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import Helper from "./helper";
import {AttributeFacet, Property, PropertyFacet} from "./datatypes";

class SolrClient {

    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async search(searchText: string,
                 attributeFacets: Array<AttributeFacet>,
                 propertyFacets: Array<PropertyFacet>,
                 categoryFacets: Array<string>,
                 namespaceFacets: Array<number>,
                 extraProperties: Array<Property>,
                 sort: string = "score desc, smwh_displaytitle asc"
    ) {
        let params = this.getParams(searchText, attributeFacets, propertyFacets,
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
                      attributeFacets: Array<AttributeFacet>,
                      propertyFacets: Array<PropertyFacet>,
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
            .map((e) => Helper.encodePropertyTitleAsValue(e.property, e.type));

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

        Helper.encodeAttributeFacetValues(attributeFacets).forEach((e)=> params.append('fq', e));
        Helper.encodePropertyFacetValues(propertyFacets).forEach((e)=> params.append('fq', e));
        Helper.encodeCategoryFacets(categoryFacets).forEach((e)=> params.append('fq', e));
        Helper.encodeNamespaceFacets(namespaceFacets).forEach((e)=> params.append('fq', e));

        params.append('q.alt', searchText === '' ? 'smwh_search_field:(*)' : Helper.encodeQuery(searchText.split(/\s+/)));
        return params;
    }

    async facets(text: string) {

    }
}

export default SolrClient;