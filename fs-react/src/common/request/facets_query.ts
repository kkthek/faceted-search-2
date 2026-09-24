import {jsonArrayMember, jsonObject} from "typedjson";
import {BaseQuery} from "app/common/request/base_query";
import {Property} from "app/common/property";
import {PropertyValueQuery} from "app/common/request/property_value_query";
import {PropertyFacet} from "app/common/request/property_facet";

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
        if (property == null) {
            return null;
        }
        return this.propertyValueQueries.findFirst(
            (e: PropertyValueQuery) => e.property.equals(property));
    }
}