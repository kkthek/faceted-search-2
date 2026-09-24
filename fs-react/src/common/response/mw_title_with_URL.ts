import {jsonMember, jsonObject} from "typedjson";
import {MWTitle} from "app/common/mw_title";
import {ElementWithURL} from "app/common/datatypes";


@jsonObject
export class MWTitleWithURL extends MWTitle implements ElementWithURL {
    @jsonMember(String)
    url: string;

    constructor(title: string, displayTitle: string, url: string) {
        super(title, displayTitle);
        this.url = url;
    }

    getDisplayTitle(): string {
        return this.displayTitle;
    }

    getTitle(): string {
        return this.title;
    }

    getUrl(): string {
        return this.url;
    }
}