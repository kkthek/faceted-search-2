/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import { Datatype, DatatypeSuffixForPropertyMap, DatatypeSuffixForValueMap } from "./datatypes";

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

    static quoteValue(v : string) {
        return "\"" + v.replace(/"/g, "\"") + "\"";
    }

}

export default Helper;