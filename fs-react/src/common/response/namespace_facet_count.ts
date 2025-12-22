import {jsonMember, jsonObject} from "typedjson";

@jsonObject
export class NamespaceFacetCount {
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
}