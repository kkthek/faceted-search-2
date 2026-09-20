import {jsonMember, jsonObject} from "typedjson";
import {Property} from "app/common/property";
import {ElementWithURL} from "app/common/datatypes";


@jsonObject
export class PropertyWithURL extends Property implements ElementWithURL {
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(String)
    url: string

    asProperty(): Property {
        return new Property(this.title, this.type);
    }

    getDisplayTitle() {
        return this.displayTitle;
    }

    getTitle() {
        return this.title;
    }

    getUrl(): string {
        return this.url;
    }
}