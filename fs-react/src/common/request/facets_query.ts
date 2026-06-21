import {jsonArrayMember, jsonObject} from "typedjson";
import {BaseQuery} from "./base_query";
import {Property} from "../property";
import {PropertyValueQuery} from "./property_value_query";
import {PropertyFacet} from "./property_facet";

@jsonObject
export class FacetsQuery extends BaseQuery {
    @jsonArrayMember(Property)
    rangeQueries: Property[]
    @jsonArrayMember(PropertyValueQuery)
    propertyValueQueries: PropertyValueQuery[]

    constructor(searchText: string,
                propertyFacets: PropertyFacet[],
                categoryFacets: string[],
                namespaceFacets: number[],
                rangeQueries: Property[],
                propertyValueQueries: PropertyValueQuery[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.rangeQueries = rangeQueries;
        this.propertyValueQueries = propertyValueQueries;
    }

    removeRangeQuery(property: Property) {
        this.rangeQueries = this.rangeQueries.filter((e) => e.title !== property.title);
    }

    removePropertyValueQuery(property: Property) {
        this.propertyValueQueries = this.propertyValueQueries.filter((e) => !e.property.equals(property));
    }

    replacePropertyValueQuery(newQuery: PropertyValueQuery) {
        return this.propertyValueQueries.replaceFirst(
            (e: PropertyValueQuery) => e.property.equals(newQuery.property), newQuery);
    }

    findPropertyValueQuery(property: Property) {
        return this.propertyValueQueries.findFirst(
            (e: PropertyValueQuery) => e.property.equals(property));
    }
}