import {jsonMember, jsonObject} from "typedjson";

@jsonObject
export class MWTitle {
    @jsonMember(String)
    title: string
    @jsonMember(String)
    displayTitle: string

    constructor(title: string, displayTitle: string) {
        this.title = title;
        this.displayTitle = displayTitle;
    }

    equals(that: MWTitle | void) {
        if (!that) return false;
        return this.title === (that as MWTitle).title && this.displayTitle === (that as MWTitle).displayTitle;
    }
}