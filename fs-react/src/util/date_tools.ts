import {WikiContext} from "../index";
import {useContext} from "react";

class DateTools {

    public static displayDate(d: Date) {
        const wikiContext = useContext(WikiContext);
        let options: Intl.DateTimeFormatOptions;
        if (DateTools.isBeginOfDay(d)) {
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

    public static displayDateRange(from: Date, to: Date) {
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
        return (fromStr === toStr ? fromStr : fromStr + " - " + toStr);
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
        return d.getUTCDate() === 1 && DateTools.isBeginOfDay(d);
    }

    private static isEndOfMonth(d: Date) {
        let datePlusOneSecond = new Date(d.getTime() + 1000);
        return this.isBeginOfMonth(datePlusOneSecond);
    }

    private static isBeginOfYear(d: Date) {
        return d.getUTCMonth() === 0 && DateTools.isBeginOfMonth(d);
    }

    private static isEndOfYear(d: Date) {
        return d.getUTCMonth() === 11 && DateTools.isEndOfMonth(d);
    }

}

export default DateTools;