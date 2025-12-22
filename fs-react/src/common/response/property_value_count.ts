import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {PropertyWithURL} from "./property_with_URL";
import {ValueCount} from "./value_count";

@jsonObject
export class PropertyValueCount {

    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonArrayMember(ValueCount)
    values: ValueCount[]

}