import {Datatype, PropertyWithURL, ValueCount} from "../common/datatypes";

class DisplayTools {

    static displayDate(d: Date) {
        if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0) {
            return this.singleDay(d);
        } else {
            let time = d.toLocaleTimeString('de-DE', {timeZone: 'UTC'});
            let date = d.toLocaleDateString('de-DE', {timeZone: 'UTC'});
            return date + " " + time;
        }
    }

    static displayDateRange(from: Date, to: Date) {
        if (this.isBeginOfYear(from) && this.isEndOfYear(to)) {
            return from.getUTCFullYear().toString() + " - " + to.getUTCFullYear().toString();
        } else if (this.isBeginOfMonth(from) && this.isEndOfMonth(to)) {
            let fromMonth = from.getUTCMonth() + 1;
            let fromMonthStr = fromMonth < 10 ? "0"+fromMonth:fromMonth;
            let toMonth = to.getUTCMonth() + 1;
            let tomMonthStr = toMonth < 10 ? "0"+toMonth:toMonth;
            return from.getUTCFullYear().toString() + "/" + fromMonthStr + " - " + to.getUTCFullYear().toString() + "/" + tomMonthStr;
        } else if (this.isBeginOfDay(from) && this.isEndOfDay(to)) {
            return this.singleDay(from) + " - " + this.singleDay(to);
        } else if (from.getTime() === to.getTime()) {
            return this.singleDay(from)
        } else {
            let fromTime = from.toLocaleTimeString('de-DE', {timeZone: 'UTC'});
            let fromDate = from.toLocaleDateString('de-DE', {timeZone: 'UTC'});
            let toTime = to.toLocaleTimeString('de-DE', {timeZone: 'UTC'});
            let toDate = to.toLocaleDateString('de-DE', {timeZone: 'UTC'});
            return fromDate + " " +fromTime + " - " + toDate + " " +toTime;
        }
    }

    static serializeFacetValue(p: PropertyWithURL, v: ValueCount): string {
        if (v.value) {
            if (p.type === Datatype.datetime) {
                return this.displayDate(v.value as Date);
            }
            return v.value.toString();
        } else if (v.mwTitle) {
            return  v.mwTitle.displayTitle;
        } else {
            // range
            if (p.type === Datatype.datetime) {
                return this.displayDateRange(v.range.from as Date, v.range.to as Date);
            }
            return v.range.from + "-" + v.range.to;
        }
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
        return d.getUTCDate() === 1
            && d.getUTCHours() === 0
            && d.getUTCMinutes() === 0
            && d.getUTCSeconds() === 0;
    }

    private static isEndOfMonth(d: Date) {
        let datePlusOneSecond = new Date(d.getTime()+1000);
        return this.isBeginOfMonth(datePlusOneSecond);
    }

    private static isBeginOfYear(d: Date) {
        return d.getUTCDate() === 1
            && d.getUTCMonth() === 0
            && d.getUTCHours() === 0
            && d.getUTCMinutes() === 0
            && d.getUTCSeconds() === 0;
    }

    private static isEndOfYear(d: Date) {
        return d.getUTCDate() === 31
            && d.getUTCMonth() === 11
            && d.getUTCHours() === 23
            && d.getUTCMinutes() === 59
            && d.getUTCSeconds() === 59;
    }

    private static singleDay(d: Date) {
        return d.getUTCFullYear() + "-" + (d.getUTCMonth()+1) + "-"+d.getUTCDate();
    }
}

export default DisplayTools;