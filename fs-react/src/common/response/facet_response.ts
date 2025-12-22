import {jsonArrayMember, jsonObject} from "typedjson";
import {PropertyValueCount} from "./property_value_count";
import {Property} from "../property";

@jsonObject
export class FacetResponse {

    @jsonArrayMember(PropertyValueCount)
    valueCounts: PropertyValueCount[];

    getPropertyValueCount(property: Property): PropertyValueCount {
        if (!this.valueCounts) {
            return null;
        }
        return this.valueCounts.findFirst((e) => e.property.title === property.title);
    }

    isEmpty() {
        return (this.valueCounts || []).length === 0;
    }
}