class DisplayTools {

    static displayDate(d: Date) {
        if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0) {
            return d.toDateString();
        } else {
            return d.toTimeString();
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
            return from.toDateString() + " - " + to.toDateString();
        } else {
            return from.toTimeString() + " - " + to.toTimeString();
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
        const lastDaysOfMonth: any = {
            0: 31,
            1: d.getUTCFullYear() % 4 === 0 ? 29 : 28,
            2: 31,
            3: 30,
            4: 31,
            5: 30,
            6: 31,
            7: 31,
            8: 30,
            9: 31,
            10: 30,
            11: 31
        }
        return d.getUTCDate() === lastDaysOfMonth[d.getUTCMonth()]
            && d.getUTCHours() === 23
            && d.getUTCMinutes() === 59
            && d.getUTCSeconds() === 59;
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

}

export default DisplayTools;