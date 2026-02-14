import {jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";
import {Order} from "../datatypes";

@jsonObject
export class Sort {

    constructor(key: string, property: Property, order: Order) {
        this.key = key;
        this.property = property;
        this.order = order;
    }

    @jsonMember(Property)
    property: Property;
    @jsonMember(Number)
    order: Order

    key: string;

    getKey() {
        return this.key;
    }
}