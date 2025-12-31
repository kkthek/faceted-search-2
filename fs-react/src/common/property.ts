import {jsonMember, jsonObject} from "typedjson";
import IdTools from "../util/id_tools";
import {Datatype} from "./datatypes";

@jsonObject
export class Property {
    @jsonMember(String)
    title: string
    @jsonMember(Number)
    type: Datatype


    constructor(title: string, type: Datatype) {
        this.title = title;
        this.type = type;
    }

    isRangeProperty() {
        return this.type === Datatype.number || this.type === Datatype.datetime;
    }

    isBooleanProperty() {
        return this.type === Datatype.boolean;
    }

    isDateTimeProperty() {
        return this.type === Datatype.datetime;
    }

    isFilterProperty() {
        return !this.isRangeProperty() && !this.isBooleanProperty();
    }

    getItemId() {
        return IdTools.createItemIdForProperty(this);
    }

    equals(that: Property) {
        return that.title === this.title && that.type === this.type;
    }
}