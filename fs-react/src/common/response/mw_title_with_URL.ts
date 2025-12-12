import {jsonMember, jsonObject} from "typedjson";
import {MWTitle} from "../mw_title";
import {ElementWithURL} from "../datatypes";

@jsonObject
export class MWTitleWithURL extends MWTitle implements ElementWithURL {
    @jsonMember(String)
    url: string;

    constructor(title: string, displayTitle: string, url: string) {
        super(title, displayTitle);
        this.url = url;
    }

}