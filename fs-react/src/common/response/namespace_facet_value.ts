import {jsonMember, jsonObject} from "typedjson";

@jsonObject
export class NamespaceFacetValue {
    @jsonMember(Number)
    namespace: number;
    @jsonMember(String)
    displayTitle: string

    public isMainNamespace() {
        return this.namespace === 0;
    }
}