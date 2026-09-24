import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {PropertyWithURL} from "app/common/response/property_with_URL";
import {ValueCount} from "app/common/response/value_count";


@jsonObject
export class PropertyValueCount {

    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonArrayMember(ValueCount)
    values: ValueCount[]

}