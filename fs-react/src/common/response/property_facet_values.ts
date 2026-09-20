import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {PropertyWithURL} from "app/common/response/property_with_URL";
import ValueDeserializer from "app/util/value_deserializer";
import {MWTitleWithURL} from "app/common/response/mw_title_with_URL";


@jsonObject
export class PropertyFacetValues {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL

    @jsonArrayMember(String, {deserializer: ValueDeserializer.arrayDeserializer})
    values: string[] | number[] | boolean[] | Date[] | MWTitleWithURL[]

    static compareByProperty() {
        return (a: PropertyFacetValues, b: PropertyFacetValues) => a.property.title.localeCompare(b.property.title);
    }
}