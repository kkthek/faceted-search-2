/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {AttributeFacet, Datatype, PropertyFacet} from "./datatypes";

class Helper {

    private static encodeWhitespacesInProperties(title: string) {
        let s: string = title.replace(/_/g, '__')
            .replace(/\s/g, '__');
        return s;
    }

    private static encodeWhitespacesInTitles(title: string) {
        return title.replace(/\s/g, '_');
    }

    public static decodeWhitespacesInTitle(title: string) {
        return title.replace(/_/g, ' ');
    }

    public static decodeWhitespacesInProperty(title: string) {
        return title.replace(/__/g, ' ');
    }

    static encodePropertyTitleAsValue(title: string, type: Datatype) {
        let s = this.encodeWhitespacesInProperties(title);
        return 'smwh_' + s + '_' + type;
    }

    static encodePropertyTitleAsProperty(title: string, type: Datatype) {
        let s = this.encodeWhitespacesInProperties(title);
        if (type === Datatype.datetime) {
            return 'smwh_' + s + '_datevalue_l';
        } else if (type === Datatype.wikipage) {
            return 'smwh_' + s + '_s';
        }
        return 'smwh_' + s + '_' + type;
    }

    static encodeQuery(terms: string[]) {
        let searchTerms = terms.join(' AND ');
        let searchTermsWithPlus = terms.map((e) => '+' + e).join(' AND ');
        return `smwh_search_field:(${searchTermsWithPlus}* ) OR `
            +`smwh_search_field:(${searchTerms}) OR `
            +`smwh_title:(${searchTerms}) OR `
            +`smwh_displaytitle:(${searchTerms})`;
    }

    static quoteValue(v : string) {
        return "\"" + v.replace(/"/g, "\"") + "\"";
    }

    static encodePropertyFacetValues(facets: PropertyFacet[]) {
        let facetValues: string[] = [];

        facets.forEach( (f) => {
            let pAsValue = 'smwh_properties:'+this.encodePropertyTitleAsValue(f.property, Datatype.wikipage);
            if (!facetValues.includes(pAsValue)) {
                facetValues.push(pAsValue);
            }
            let p = this.encodePropertyTitleAsProperty(f.property, Datatype.wikipage);
            let value = this.quoteValue(`${f.value.title}|${f.value.displayTitle}`);
            facetValues.push(`${p}:${value}`)
        })
        return facetValues;
    }

    static encodeAttributeFacetValues(facets: AttributeFacet[]) {
        let facetValues: string[] = [];
        facets.forEach( (f) => {
            let pAsValue = 'smwh_attributes:'+this.encodePropertyTitleAsValue(f.property, f.type);
            if (!facetValues.includes(pAsValue)) {
                facetValues.push(pAsValue);
            }
            let p = this.encodePropertyTitleAsProperty(f.property, f.type);
            let value;
            if (typeof f.value === 'string') {
                value = this.quoteValue(f.value);
            } else {
                value = `${f.value[0]} TO ${f.value[1]}`;
            }
            facetValues.push(`${p}:${value}`)
        })
        return facetValues;
    }

    static encodeCategoryFacets(categories: string[]) {
        let facetValues: string[] = [];
        categories.forEach( (category) => {
            let pAsValue = 'smwh_categories:'+this.encodeWhitespacesInTitles(category);
            if (!facetValues.includes(pAsValue)) {
                facetValues.push(pAsValue);
            }
        })
        return facetValues;
    }

    static encodeNamespaceFacets(namespaces: number[]) {
        let facetValues: string[] = [];
        namespaces.forEach( (namespaceId) => {
            let pAsValue = 'smwh_namespace_id:'+namespaceId;
            if (!facetValues.includes(pAsValue)) {
                facetValues.push(pAsValue);
            }
        })
        return facetValues;
    }

}

export default Helper;