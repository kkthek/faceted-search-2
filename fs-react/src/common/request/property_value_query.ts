import {jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";

@jsonObject
export class PropertyValueQuery {
    @jsonMember(Property)
    property: Property

    @jsonMember(Number)
    valueLimit: number
    @jsonMember(Number)
    valueOffset: number
    @jsonMember(String)
    valueContains: string

    constructor(property: Property, limit: number = null, offset: number = null, contains: string = null) {
        this.property = property;
        this.valueLimit = limit;
        this.valueOffset = offset;
        this.valueContains = contains;
    }

    equals(that: PropertyValueQuery) {
        return that.property.equals(this.property) && that.valueContains === this.valueContains
            && that.valueLimit === this.valueLimit && that.valueOffset === this.valueOffset;
    }

    static forAllValues(property: Property, limit: number = null, offset: number = null) {
        return new PropertyValueQuery(property, limit, offset, null);
    }

    static forValuesContainingText(property: Property, text: string = null) {
        return new PropertyValueQuery(property, null, null, text);
    }
}