import {jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";
import {Order} from "../datatypes";

@jsonObject
export class Sort {

    constructor(property: Property, order: Order) {
        this.property = property;
        this.order = order;
    }

    @jsonMember(Property)
    property: Property;
    @jsonMember(Number)
    order: Order
}