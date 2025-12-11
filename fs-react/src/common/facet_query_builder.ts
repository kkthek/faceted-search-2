import {BaseQuery, FacetsQuery, Property, PropertyFacet, PropertyValueQuery} from "./datatypes";
import {TypedJSON} from "typedjson";

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
        this.query.propertyFacets.removeAll((e: PropertyFacet) => e.property.title === p.title);
        return this;
    }

    withRangeQuery(property: Property): FacetQueryBuilder {
        this.query.rangeQueries.push(property);
        return this;
    }

    clearRangeQueriesForProperty(p : Property) {
        this.query.rangeQueries.removeAll((e: Property) => e.title === p.title);
        return this;
    }

    clearAllRangeQueries() {
        this.query.rangeQueries = [];
        return this;
    }

    withPropertyValueQuery(propertyValueQuery: PropertyValueQuery): FacetQueryBuilder {

        let constraint = this.query.propertyValueQueries.replaceFirst(
            (e: PropertyValueQuery) => e.property.title === propertyValueQuery.property.title, propertyValueQuery);
        if (constraint === null) {
            this.query.propertyValueQueries.push(propertyValueQuery);
        }
        return this;
    }

    existsPropertyValueQuery(propertyValueConstraint: PropertyValueQuery): boolean {
        return this.query.propertyValueQueries.findFirst(
            (e: PropertyValueQuery) => e.equals(propertyValueConstraint)) != null;
    }

    clearPropertyValueQueryForProperty(p : Property) {
        this.query.propertyValueQueries.removeAll((e: PropertyValueQuery) => e.property.title === p.title);
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