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

    withinRange(value: FacetValue) {
        if (this.isNullish(value.range)) return false;
        return FacetValue.withinRange(this.range, value.range);
    }

    containsValueOrMWTitle(value: ValueType | void, mwTitle: MWTitle | void): boolean {

        return (!this.isNullish(this.value) && FacetValue.sameValue(this.value, value))
            || (!this.isNullish(this.mwTitle) && this.mwTitle && FacetValue.sameMWTitle(this.mwTitle, mwTitle));

    }

    isNullish(value: any): boolean {
        return value === null || value === undefined;
    }

    toString(): string {
        if (this.range) return this.range.toString();
        return this.mwTitle ? this.mwTitle.title : (this.value as string).toString();
    }

    static sameValue(a: ValueType | void, b: ValueType | void) {
        const aNullish = a === null || a === undefined;
        const bNullish = b === null || b === undefined;

        if (aNullish || bNullish) {
            return aNullish && bNullish;
        }
        return (a === b)
            || (a as string) === b as string
            || (a as number) === b as number
            || (a as boolean) === b as boolean
            || ((a instanceof Date) && (b instanceof Date)
                && (a as Date).toUTCString() === (b as Date).toUTCString());
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
            return aNullish && bNullish;
        }
        return (a as Range).withinRange(b as Range);
    }
}