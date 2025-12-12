import {jsonMember, jsonObject} from "typedjson";
import {PropertyWithURL} from "./property_with_URL";
import {Sortable} from "../datatypes";

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