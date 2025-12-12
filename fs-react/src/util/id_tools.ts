import {Property} from "../common/property";
import {FacetValue} from "../common/request/facet_value";

class IdTools {


    static createItemIdForProperty(property: Property) {
        const rawId = property.title + "_" + property.type
        return IdTools.removeNonIdChars(rawId);
    }

    static createItemIdForFacet(property: Property, facetValue: FacetValue) {
        return IdTools.createItemIdForValue(property, facetValue.toString());
    }

    static createItemIdForValue(property: Property, facetValue: string) {
        return IdTools.createItemIdForProperty(property) + "_" + IdTools.removeNonIdChars(facetValue);
    }

    private static removeNonIdChars(rawId: string) {
        return rawId.replace(/[\W]/g, '')
    }

}


export default IdTools;