/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {Datatype} from "../common/datatypes";

/**
 * Helper functions to return implementation specific property/value suffixes.
 * dependant from backend
 */
let DatatypeSuffixForPropertyMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 's';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 's';
    }
}


let DatatypeSuffixForValueMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 'xsdvalue_t';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 't';
    }
}

let DatatypeSuffixForFacetMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 'xsdvalue_s';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 's';
    }
}


class Helper {

    private static encodeWhitespacesInProperties(title: string) {
        let s: string = title.replace(/_/g, '__')
            .replace(/\s/g, '__');
        return s;
    }

    static encodeWhitespacesInTitles(title: string) {
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
        return 'smwh_' + s + '_' + DatatypeSuffixForValueMap(type);
    }

    static encodePropertyTitleAsProperty(title: string, type: Datatype) {
        let s = this.encodeWhitespacesInProperties(title);
        return 'smwh_' + s + '_' + DatatypeSuffixForPropertyMap(type);
    }

    static encodePropertyTitleAsFacet(title: string, type: Datatype) {
        let s = this.encodeWhitespacesInProperties(title);
        return 'smwh_' + s + '_' + DatatypeSuffixForFacetMap(type);
    }

    static encodePropertyTitleAsStatField(title: string, type: Datatype) {
        let s = this.encodeWhitespacesInProperties(title);
        if (type == Datatype.datetime) {
            return 'smwh_' + s + '_datevalue_l';
        } else if (type == Datatype.number) {
            return 'smwh_' + s + '_xsdvalue_d';
        } else {
            return 'smwh_' + s + '_xsdvalue_s';
        }
    }

    static quoteValue(v : string | number | boolean) {
        if (typeof v === 'string') {
            return "\"" + v.replace(/"/g, "\"") + "\"";
        }
        return v;
    }

    static serializeDate(d: Date) {
        let date = `${d.getFullYear()}${this.padNumber(d.getMonth())}${this.padNumber(d.getDate())}`;
        let time = `${this.padNumber(d.getHours())}${this.padNumber(d.getMinutes())}${this.padNumber(d.getSeconds())}`;
        return date+time;
    }

    static padNumber(n: number) {
        if (n < 10) return "0"+n;
        else return n;
    }

}

export default Helper;