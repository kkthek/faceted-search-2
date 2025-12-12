import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";
import {FacetValue} from "./facet_value";

import {PropertyWithURL} from "../response/property_with_URL";

@jsonObject
export class PropertyFacet {
    @jsonMember(Property)
    property: Property
    @jsonArrayMember(FacetValue)
    values: FacetValue[]

    constructor(property: Property,
                values: FacetValue[]
    ) {
        this.property = property instanceof PropertyWithURL ? (property as PropertyWithURL).asProperty() : property;
        this.values = values;
    }

    containsFacet(value: FacetValue): boolean {
        return this.values.some(e => value !== null && e.equalsOrWithinRange(value));
    }

    hasValueOrMWTitle(): boolean {
        return this.values.some((e) => e.value || e.mwTitle);
    }

    hasRange(): boolean {
        return this.values.some((e) => e.range);
    }

    getProperty() {
        return this.property;
    }

    static facetForAnyValue(p: Property) {
        return new PropertyFacet(p, [new FacetValue(null, null, null)]);
    }

    equals(that: PropertyFacet) {

        if (this.values.length !== that.values.length) {
            return false;
        }

        let valueSetIsEqual = this.values.every((e) => that.values.find((f) => f.equals(e)))
            && that.values.every((e) => this.values.find((f) => f.equals(e)));

        return this.property.equals(that.property) && valueSetIsEqual;
    }

    equalsOrWithinRange(that: PropertyFacet) {

        if (this.values.length !== that.values.length) {
            return false;
        }

        let valueSetIsEqual = this.values.every((e) => that.values.find((f) => f.equalsOrWithinRange(e)))
            && that.values.every((e) => this.values.find((f) => f.equalsOrWithinRange(e)));

        return this.property.equals(that.property) && valueSetIsEqual;
    }
}