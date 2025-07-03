import {BaseQuery, DocumentQuery, FacetsQuery, Property, PropertyValueQuery, RangeQuery} from "./datatypes";
import Tools from "../util/tools";
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
        Tools.removeAll(this.query.propertyFacets, (e) => e.property.title, p.title);
        return this;
    }

    withRangeQuery(rangeQuery: RangeQuery): FacetQueryBuilder {
        this.query.rangeQueries.push(rangeQuery);
        return this;
    }

    clearRangeQueriesForProperty(p : Property) {
        Tools.removeAll(this.query.rangeQueries, (e) => e.property.title, p.title);
        return this;
    }

    clearAllRangeQueries() {
        this.query.rangeQueries = [];
        return this;
    }

    withPropertyValueQuery(propertyValueQuery: PropertyValueQuery): FacetQueryBuilder {

        let constraint = Tools.replaceFirst(this.query.propertyValueQueries,
            (e) => e.property.title, propertyValueQuery.property.title, propertyValueQuery);
        if (constraint === null) {
            this.query.propertyValueQueries.push(propertyValueQuery);
        }
        return this;
    }

    existsPropertyValueQuery(propertyValueConstraint: PropertyValueQuery): boolean {
        return Tools.findFirstByPredicate(this.query.propertyValueQueries,
            (e) => e.equals(propertyValueConstraint)) != null;
    }

    clearPropertyValueQueryForProperty(p : Property) {
        Tools.removeAll(this.query.propertyValueQueries, (e) => e.property.title, p.title);
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