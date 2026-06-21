import {TypedJSON} from "typedjson";
import {Property} from "../property";
import {PropertyValueQuery} from "../request/property_value_query";
import {PropertyFacet} from "../request/property_facet";
import {BaseQuery} from "../request/base_query";
import {FacetsQuery} from "../request/facets_query";

class FacetQueryBuilder {

    private query: FacetsQuery;

    constructor() {
        this.query = new FacetsQuery(
            "",
            [],
            [],
            [],
            [],
            []
        );
    }

    withQueryFromJson(json: string) {
        const deserializer = new TypedJSON(FacetsQuery);
        this.query = deserializer.parse(json);
        return this;
    }

    withoutPropertyFacet(p: Property) {
        this.query.removePropertyFacet(p);
        return this;
    }

    withRangeQuery(property: Property): FacetQueryBuilder {
        this.query.rangeQueries.push(property);
        return this;
    }

    clearRangeQueriesForProperty(p : Property) {
        this.query.removeRangeQuery(p);
        return this;
    }

    clearAllRangeQueries() {
        this.query.rangeQueries = [];
        return this;
    }

    withPropertyValueQuery(propertyValueQuery: PropertyValueQuery): FacetQueryBuilder {
        if (!propertyValueQuery) return this;
        const valueQuery = this.query.findPropertyValueQuery(propertyValueQuery.property);
        if (valueQuery !== null) {
            this.query.replacePropertyValueQuery(propertyValueQuery);
        } else {
            this.query.propertyValueQueries.push(propertyValueQuery);
        }
        return this;
    }

    existsUnlimitedPropertyValueQuery(property: Property): boolean {
        const valueQuery = this.query.findPropertyValueQuery(property);
        if (valueQuery === null) return false;
        return valueQuery.valueLimit === null
    }

    clearPropertyValueQueryForProperty(p : Property) {
        this.query.removePropertyValueQuery(p);
        return this;
    }

    clearAllPropertyValueQueries() {
        this.query.propertyValueQueries = [];
        return this;
    }

    updateBaseQuery(base: BaseQuery): FacetQueryBuilder {
        this.query.updateBaseQuery(base);
        return this;
    }

    build(): FacetsQuery {
        return this.query;
    }

}

export default FacetQueryBuilder;