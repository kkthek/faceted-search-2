import {jsonMember, jsonObject} from "typedjson";
import ValueDeserializer from "../util/value_deserializer";

@jsonObject
export class Range {

    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    from: Date | number
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    to: Date | number

    constructor(from: Date | number, to: Date | number) {
        this.from = from;
        this.to = to;
    }

    equals(that?: Range): boolean {
        if (!that) return false;

        const thisFromIsNumber = typeof this.from === "number";
        const thisToIsNumber = typeof this.to === "number";
        const thatFromIsNumber = typeof that.from === "number";
        const thatToIsNumber = typeof that.to === "number";

        if (thisFromIsNumber && thisToIsNumber && thatFromIsNumber && thatToIsNumber) {
            return this.from === that.from && this.to === that.to;
        }

        const thisFromIsDate = this.from instanceof Date;
        const thisToIsDate = this.to instanceof Date;
        const thatFromIsDate = that.from instanceof Date;
        const thatToIsDate = that.to instanceof Date;

        if (thisFromIsDate && thisToIsDate && thatFromIsDate && thatToIsDate) {
            return (this.from as Date).getTime() === (that.from as Date).getTime()
                && (this.to as Date).getTime() === (that.to as Date).getTime();
        }

        // mixed types (number/date) can't be equal
        return false;
    }

    withinRange(that?: Range): boolean {
        if (!that) return false;

        const thisFromIsNumber = typeof this.from === "number";
        const thisToIsNumber = typeof this.to === "number";
        const thatFromIsNumber = typeof that.from === "number";
        const thatToIsNumber = typeof that.to === "number";

        if (thisFromIsNumber && thisToIsNumber && thatFromIsNumber && thatToIsNumber) {
            return this.from >= that.from && this.to <= that.to;
        }

        const thisFromIsDate = this.from instanceof Date;
        const thisToIsDate = this.to instanceof Date;
        const thatFromIsDate = that.from instanceof Date;
        const thatToIsDate = that.to instanceof Date;

        if (thisFromIsDate && thisToIsDate && thatFromIsDate && thatToIsDate) {
            return (this.from as Date).getTime() >= (that.from as Date).getTime()
                && (this.to as Date).getTime() <= (that.to as Date).getTime();
        }

        // mixed types (number/date) can't be compared meaningfully here
        return false;
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