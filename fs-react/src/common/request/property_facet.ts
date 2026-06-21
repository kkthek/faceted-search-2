import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";
import {FacetValue} from "./facet_value";

@jsonObject
export class PropertyFacet {
    @jsonMember(Property)
    property: Property
    @jsonArrayMember(FacetValue)
    values: FacetValue[]

    constructor(property: Property,
                values: FacetValue[]
    ) {
        this.property = property.asProperty();
        this.values = values;
    }

    addValuesFromFacet(facet: PropertyFacet) {
        facet.values.forEach(vNew => {
            if (!this.values.some(vOld => vOld.equals(vNew))) {
                this.values.push(vNew);
            }
        });
    }

    removeValue(value: FacetValue) {
        this.values = this.values.filter(e => !e.equals(value));
    }

    hasNoValues(): boolean {
        return this.values.length === 0;
    }

    containsValue(value: FacetValue): boolean {
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