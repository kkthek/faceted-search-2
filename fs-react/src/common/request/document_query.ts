import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {BaseQuery} from "./base_query";
import {Property} from "../property";
import {Sort} from "./sort";
import {PropertyFacet} from "./property_facet";

@jsonObject
export class DocumentQuery extends BaseQuery {
    @jsonArrayMember(Property)
    extraProperties: Property[];
    @jsonArrayMember(Sort)
    sorts: Sort[];
    @jsonMember(Number)
    limit: number | null;
    @jsonMember(Number)
    offset: number | null;

    constructor(searchText: string,
                propertyFacets: PropertyFacet[],
                categoryFacets: string[],
                namespaceFacets: number[],
                extraProperties: Property[],
                sorts: Sort[],
                limit: number,
                offset: number) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);

        this.extraProperties = extraProperties;
        this.sorts = sorts;
        this.limit = limit;
        this.offset = offset;
    }
}