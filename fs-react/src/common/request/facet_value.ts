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
        return this.value === null && this.mwTitle === null && this.range === null;
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
        if ((a === null && b !== null) || (a !== null && b === null)) {
            return false;
        }
        return (a === b)
            || (a as string) === b as string
            || (a as number) === b as number
            || (a as boolean) === b as boolean
            || ((a as Date).toUTCString && (b as Date).toUTCString
                && (a as Date).toUTCString() === (b as Date).toUTCString());
    }

    static sameMWTitle(a: MWTitle | void, b: MWTitle | void) {
        return (a === b || (a as MWTitle).equals(b));
    }

    static sameRange(a: Range | void, b: Range | void) {
        return (a === b || (a as Range).equals(b as Range));
    }

    static withinRange(a: Range | void, b: Range | void) {
        return (a === b || (a as Range).withinRange(b as Range));
    }
}