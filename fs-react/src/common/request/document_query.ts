import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {BaseQuery} from "app/common/request/base_query";
import {Sort} from "app/common/request/sort";
import {PropertyFacet} from "app/common/request/property_facet";

@jsonObject
export class DocumentQuery extends BaseQuery {

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
                sorts: Sort[],
                limit: number,
                offset: number) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);

        this.sorts = sorts;
        this.limit = limit;
        this.offset = offset;
    }
}