import {jsonMember, jsonObject} from "typedjson";
import {Sortable} from "../datatypes";

@jsonObject
export class CategoryFacetCount implements Sortable<CategoryFacetCount> {
    @jsonMember(String)
    category: string;
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(Number)
    count: number;

    compareAlphabetically(that: CategoryFacetCount): number {
        return this.category.toLowerCase().localeCompare(that.category.toLowerCase());
    }

    compareByCount(that: CategoryFacetCount): number {
        return that.count - this.count;
    }
}