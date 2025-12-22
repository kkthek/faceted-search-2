import {jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";
import {ElementWithURL} from "../datatypes";

@jsonObject
export class PropertyWithURL extends Property implements ElementWithURL {
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(String)
    url: string

    asProperty(): Property {
        return new Property(this.title, this.type);
    }
}