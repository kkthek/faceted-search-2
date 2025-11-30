import {FacetValue, Property} from "../common/datatypes";

class Tools {


    static createItemIdForProperty(property: Property) {
        const rawId = property.title + "_" + property.type
        return Tools.removeNonIdChars(rawId);
    }

    static createItemIdForFacet(property: Property, facetValue: FacetValue) {
        return Tools.createItemIdForValue(property, facetValue.toString());
    }

    static createItemIdForValue(property: Property, facetValue: string) {
        return Tools.createItemIdForProperty(property) + "_" + Tools.removeNonIdChars(facetValue);
    }

    private static removeNonIdChars(rawId: string) {
        return rawId.replace(/[\W]/g, '')
    }

}


export default Tools;