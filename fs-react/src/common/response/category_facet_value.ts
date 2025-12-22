import {jsonMember, jsonObject} from "typedjson";
import {ElementWithURL} from "../datatypes";

@jsonObject
export class CategoryFacetValue implements ElementWithURL {
    @jsonMember(String)
    category: string
    @jsonMember(String)
    displayTitle: string
    @jsonMember(String)
    url: string
}