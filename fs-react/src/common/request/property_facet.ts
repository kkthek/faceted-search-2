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
        if (!value) return false;
        return this.values.some(e => e.equals(value) || e.withinRange(value));
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

    withinRange(that: PropertyFacet) {

        if (this.values.length !== that.values.length) {
            return false;
        }

        // THIS is a subset of THAT
        const thisEqualsThat = this.values.every((e) => that.values.find((f) => e.withinRange(f)));

        // THAT is a superset THIS
        const thatEqualsThis = that.values.every((e) => this.values.find((f) => f.withinRange(e)));

        return this.property.equals(that.property) && thisEqualsThat && thatEqualsThis;
    }
}