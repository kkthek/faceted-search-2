import {AttributeFacet, Datatype, PropertyFacet} from "./datatypes";

class Helper {

    private static encodeWhitespaces(title: string) {
        let s: string = title.replace(/_/g, '__')
            .replace(/\s/g, '__');
        return s;
    }

    static encodePropertyTitleAsValue(title: string, type: Datatype) {
        let s = this.encodeWhitespaces(title);
        return 'smwh_' + s + '_' + type;
    }

    static encodePropertyTitleAsProperty(title: string, type: Datatype) {
        let s = this.encodeWhitespaces(title);
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
            let dbKeyEncoded = this.encodePropertyTitleAsValue(f.value.dbKey, Datatype.wikipage);
            let value = this.quoteValue(`${dbKeyEncoded}|${f.value.displayTitle}`);
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

}

export default Helper;