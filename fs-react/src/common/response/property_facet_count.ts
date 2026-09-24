import {jsonMember, jsonObject} from "typedjson";
import {Sortable} from "app/common/datatypes";
import {PropertyWithURL} from "app/common/response/property_with_URL";


@jsonObject
export class PropertyFacetCount implements Sortable<PropertyFacetCount> {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonMember(Number)
    count: number;

    compareAlphabetically(that: PropertyFacetCount): number {
        return this.property.title.toLowerCase().localeCompare(that.property.title.toLowerCase());
    }

    compareByCount(that: PropertyFacetCount): number {
        return that.count - this.count;
    }
}