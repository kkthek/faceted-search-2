import {jsonMember, jsonObject} from "typedjson";
import {ElementWithURL} from "app/common/datatypes";

@jsonObject
export class CategoryFacetValue implements ElementWithURL {
    @jsonMember(String)
    category: string
    @jsonMember(String)
    displayTitle: string
    @jsonMember(String)
    url: string

    getDisplayTitle(): string {
        return this.displayTitle;
    }

    getTitle(): string {
        return this.category;
    }

    getUrl(): string {
        return this.url;
    }
}