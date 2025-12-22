import {jsonMember, jsonObject} from "typedjson";
import ValueDeserializer from "../../util/value_deserializer";
import {MWTitleWithURL} from "./mw_title_with_URL";
import {Range} from "../range";
import {PropertyFacet} from "../request/property_facet";
import {FacetValue} from "../request/facet_value";
import {Sortable} from "../datatypes";

@jsonObject
export class ValueCount implements Sortable<ValueCount> {
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    value: string | number | Date | null;
    @jsonMember(MWTitleWithURL)
    mwTitle: MWTitleWithURL | null;
    @jsonMember(Range)
    range: Range | null;
    @jsonMember(Number)
    count: number;

    compareAlphabetically(that: ValueCount): number {
        if (this.value && that.value) {
            return this.value.toLocaleString().localeCompare(that.value.toLocaleString());
        } else if (this.mwTitle && that.mwTitle) {
            return this.mwTitle.displayTitle.toLocaleString().localeCompare(that.mwTitle.displayTitle.toLocaleString());
        }
        return 0;
    }

    compareByCount(that: ValueCount): number {
        return that.count - this.count;
    }

    compareToSelectedFirst(other: ValueCount, propertyFacet: PropertyFacet) {
        const facetValueA = FacetValue.fromValueCount(this);
        const facetValueB = FacetValue.fromValueCount(other);
        const containsA = propertyFacet.containsFacet(facetValueA);
        const containsB = propertyFacet.containsFacet(facetValueB);
        if (containsA === containsB) return 0;
        return containsA && !containsB ? -1 : 1;
    }

    serialize(): string {
        return this.mwTitle ? this.mwTitle.title : this.value.toString();
    }
}