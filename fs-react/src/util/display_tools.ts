import {Datatype, Property, Range, ValueCount} from "../common/datatypes";
import {WikiContext} from "../index";
import {useContext} from "react";

class DisplayTools {

    static displayDate(d: Date) {
        const wikiContext = useContext(WikiContext);
        let options: Intl.DateTimeFormatOptions;
        if (DisplayTools.isBeginOfDay(d)) {
            options = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
        } else {
            options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            };
        }
        const dateTimeFormat = new Intl.DateTimeFormat(wikiContext.getLocale(), options);
        return dateTimeFormat.format(d);
    }

    private static displayDateRange(from: Date, to: Date) {
        const wikiContext = useContext(WikiContext);
        let options: Intl.DateTimeFormatOptions;

        if (this.isBeginOfYear(from) && this.isEndOfYear(to)) {
            options = {year: "numeric"};
        } else if (this.isBeginOfMonth(from) && this.isEndOfMonth(to)) {
            options = {year: "numeric", month: "long"};
        } else if (this.isBeginOfDay(from) && this.isEndOfDay(to)) {
            options = {year: "numeric", month: "long", day: "numeric"};
        } else {
            options = {year: "numeric", month: "long", day: "numeric", hour: "numeric"};
        }

        const dateTimeFormat = new Intl.DateTimeFormat(wikiContext.getLocale(), options);
        const fromStr = dateTimeFormat.format(from);
        const toStr = dateTimeFormat.format(to);
        return this.showRangeIfNecessary(fromStr, toStr);
    }

    private static showRangeIfNecessary(from: string, to: string) {
        return (from === to ? from : from + " - " + to);
    }

    static serializeFacetValue(p: Property, v: ValueCount): string {
        if (v.value) {
            if (p.type === Datatype.datetime) {
                return this.displayDate(v.value as Date);
            }
            return v.value.toString();
        } else if (v.mwTitle) {
            return v.mwTitle.displayTitle;
        } else {
            // range
            if (p.type === Datatype.datetime) {
                return this.displayDateRange(v.range.from as Date, v.range.to as Date);
            }
            return this.showRangeIfNecessary(v.range.from.toString(), v.range.to.toString());
        }
    }

    static displayRange(p: Property, range: Range) {
        if (p.type === Datatype.datetime) {
            return this.displayDateRange(range.from as Date, range.to as Date);
        }
        return this.showRangeIfNecessary(range.from.toString(), range.to.toString());
    }

    private static isBeginOfDay(d: Date) {
        return d.getUTCHours() === 0
            && d.getUTCMinutes() === 0
            && d.getUTCSeconds() === 0;
    }

    private static isEndOfDay(d: Date) {
        return d.getUTCHours() === 23
            && d.getUTCMinutes() === 59
            && d.getUTCSeconds() === 59;
    }

    private static isBeginOfMonth(d: Date) {
        return d.getUTCDate() === 1 && DisplayTools.isBeginOfDay(d);
    }

    private static isEndOfMonth(d: Date) {
        let datePlusOneSecond = new Date(d.getTime() + 1000);
        return this.isBeginOfMonth(datePlusOneSecond);
    }

    private static isBeginOfYear(d: Date) {
        return d.getUTCMonth() === 0 && DisplayTools.isBeginOfMonth(d);
    }

    private static isEndOfYear(d: Date) {
        return d.getUTCMonth() === 11 && DisplayTools.isEndOfMonth(d);
    }

}

export default DisplayTools;