import {jsonMember, jsonObject} from "typedjson";
import {Sortable} from "../datatypes";

@jsonObject
export class NamespaceFacetCount implements Sortable<NamespaceFacetCount>  {
    @jsonMember(Number)
    namespace: number;
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(Number)
    count: number;


    constructor(namespace: number, displayTitle: string, count: number) {
        this.namespace = namespace;
        this.displayTitle = displayTitle;
        this.count = count;
    }

    compareAlphabetically(that: NamespaceFacetCount): number {
        return this.displayTitle.toLowerCase().localeCompare(that.displayTitle.toLowerCase());
    }

    compareByCount(that: NamespaceFacetCount): number {
        return that.count - this.count;
    }
}