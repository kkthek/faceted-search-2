import {jsonMember, jsonObject} from "typedjson";
import ValueDeserializer from "../../util/value_deserializer";
import {MWTitle} from "../mw_title";
import {Range} from "../range";
import {ValueType} from "../datatypes";
import {ValueCount} from "../response/value_count";

@jsonObject
export class FacetValue {
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    value: ValueType | void;
    @jsonMember(MWTitle)
    mwTitle: MWTitle | void;
    @jsonMember(Range)
    range: Range | void


    constructor(value: ValueType | void, mwTitle: MWTitle | void, range: Range | void) {
        this.value = value;
        this.mwTitle = mwTitle;
        this.range = range;
    }

    isEmpty() {
        return (!this.value)
            && (!this.mwTitle)
            && (!this.range);
    }

    static fromValueCount(valueCount: ValueCount) {
        return new FacetValue(valueCount.value, valueCount.mwTitle, valueCount.range);
    }

    static fromRange(range: Range) {
        return new FacetValue(null, null, range);
    }

    static fromMWTitle(mwTitle: MWTitle) {
        return new FacetValue(null, mwTitle, null);
    }

    static fromValue(value: ValueType) {
        return new FacetValue(value, null, null);
    }

    equals(that: FacetValue) {

        return FacetValue.sameValue(this.value, that.value)
            && FacetValue.sameMWTitle(this.mwTitle, that.mwTitle)
            && FacetValue.sameRange(this.range, that.range)
            ;
    }

    equalsOrWithinRange(that: FacetValue) {

        return FacetValue.sameValue(this.value, that.value)
            && FacetValue.sameMWTitle(this.mwTitle, that.mwTitle)
            && FacetValue.withinRange(this.range, that.range)
            ;
    }

    containsValueOrMWTitle(value: ValueType | void, mwTitle: MWTitle | void): boolean {

        return (this.value && FacetValue.sameValue(this.value, value))
            || (this.mwTitle && FacetValue.sameMWTitle(this.mwTitle, mwTitle));

    }

    toString(): string {
        if (this.range) return this.range.toString();
        return this.mwTitle ? this.mwTitle.title : (this.value as string).toString();
    }

    static sameValue(a: ValueType | void, b: ValueType | void) {
        // Treat `null` and `undefined` (typed as `void` here) as "no value"
        const aNullish = a === null || a === undefined;
        const bNullish = b === null || b === undefined;

        if (aNullish || bNullish) {
            return aNullish && bNullish;
        }

        // Fast path for primitives and identical references
        if (a === b) {
            return true;
        }

        // Date comparison (avoids property access on null/undefined and avoids false positives)
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }

        // If ValueType ever contains other non-primitive objects, add comparisons here.
        return false;
    }

    static sameMWTitle(a: MWTitle | void, b: MWTitle | void) {
        const aNullish = a === null || a === undefined;
        const bNullish = b === null || b === undefined;

        if (aNullish || bNullish) {
            return aNullish && bNullish;
        }
        return (a as MWTitle).equals(b);
    }

    static sameRange(a: Range | void, b: Range | void) {
        const aNullish = a === null || a === undefined;
        const bNullish = b === null || b === undefined;

        if (aNullish || bNullish) {
            return aNullish && bNullish;
        }
        return (a as Range).equals(b as Range);
    }

    static withinRange(a: Range | void, b: Range | void) {
        const aNullish = a === null || a === undefined;
        const bNullish = b === null || b === undefined;
        if (aNullish || bNullish) {
            return false;
        }
        return ((a as Range).withinRange(b as Range));
    }
}