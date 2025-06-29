import {BaseQuery, DocumentQuery, FacetsQuery, Property, PropertyValueConstraint, RangeQuery} from "./datatypes";
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

    withoutPropertyFacet(pf: Property) {
        Tools.removeAll(this.query.propertyFacets, (e) => e.property.title, pf.title);
        return this;
    }

    withFacetQuery(rangeQuery: RangeQuery): FacetQueryBuilder {
        this.query.rangeQueries.push(rangeQuery);
        return this;
    }

    clearFacetsQueriesForProperty(p : Property) {
        Tools.removeAll(this.query.rangeQueries, (e) => e.property.title, p.title);
        return this;
    }

    withPropertyValueConstraint(propertyValueConstraint: PropertyValueConstraint): FacetQueryBuilder {

        let constraint = Tools.replaceFirst(this.query.propertyValueQueries,
            (e) => e.property.title, propertyValueConstraint.property.title, propertyValueConstraint);
        if (constraint === null) {
            this.query.propertyValueQueries.push(propertyValueConstraint);
        }
        return this;
    }

    existsPropertyValueConstraint(propertyValueConstraint: PropertyValueConstraint): boolean {
        return Tools.findFirstByPredicate(this.query.propertyValueQueries,
            (e) => e.equals(propertyValueConstraint)) != null;
    }

    clearPropertyValueConstraintForProperty(p : Property) {
        Tools.removeAll(this.query.propertyValueQueries, (e) => e.property.title, p.title);
        return this;
    }

    clearAllPropertyValueConstraints() {
        this.query.propertyValueQueries = [];
        return this;
    }

    clearAllFacetQueries() {
        this.query.rangeQueries = [];
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