import {jsonMember, jsonObject} from "typedjson";
import ValueDeserializer from "../util/value_deserializer";

@jsonObject
export class Range {
    //FIXME: deserialize does not work for numbers
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    from: Date | number
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    to: Date | number

    constructor(from: Date | number, to: Date | number) {
        this.from = from;
        this.to = to;
    }

    equals(that: Range | void) {
        if (!that) return false;
        if (isFinite(this.from as number) && isFinite(this.to as number)) {
            return this.from === (that as Range).from && this.to === (that as Range).to;
        } else {
            return (this.from as Date).getTime() === (that.from as Date).getTime()
                && (this.to as Date).getTime() === (that.to as Date).getTime();
        }
    }

    withinRange(that: Range | void) {
        if (!that) return false;
        if (isFinite(this.from as number) && isFinite(this.to as number)) {
            return this.from <= (that as Range).from && this.to >= (that as Range).to;
        } else {
            return (this.from as Date).getTime() <= (that.from as Date).getTime()
                && (this.to as Date).getTime() >= (that.to as Date).getTime();
        }
    }

    toString(): string {
        return `${this.from}-${this.to}`;
    }

    static collapsedDateTimeRange(): Range {
        const date = new Date();
        return new Range(date, date);
    }

    static collapsedNumberRange(): Range {
        return new Range(0, 0);
    }
}