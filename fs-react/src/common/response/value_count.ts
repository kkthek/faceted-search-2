import {jsonMember, jsonObject} from "typedjson";
import ValueDeserializer from "../../util/value_deserializer";
import {MWTitleWithURL} from "./mw_title_with_URL";
import {Range} from "../range";
import {PropertyFacet} from "../request/property_facet";
import {FacetValue} from "../request/facet_value";
import {Sortable, ValueType} from "../datatypes";
//import {useContext} from "react";
//import {WikiContext} from "../../index";
import DateTools from "../../util/date_tools";

@jsonObject
export class ValueCount implements Sortable<ValueCount> {
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    value: ValueType | void;
    @jsonMember(MWTitleWithURL)
    mwTitle: MWTitleWithURL | void;
    @jsonMember(Range)
    range: Range | void;
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

    itemId(): string {
        if (this.range) {
            return this.range.toString()
        } else if (this.mwTitle) {
            return this.mwTitle.title
        } else if (this.value) {
            return this.value.toString();
        }
        return null;
    }

    getDisplayText(context: any): string {
        const v = this;
        if (v.value !== undefined) {
            const val = v.value as ValueType;
            if (val instanceof Date) {
                return DateTools.displayDate(v.value as Date, context['locale']);
            } else if (typeof val === 'boolean') {
                return context['fs-bool-value-'+val.toString()];
            }
            return val.toString();
        } else if (v.mwTitle) {
            return v.mwTitle.displayTitle;
        } else {
            // range
            const r = v.range as Range;
            return r.displayRange(context);
        }
    }
}