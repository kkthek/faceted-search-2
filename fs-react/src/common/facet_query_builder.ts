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
        Tools.removeAll(this.query.propertyFacets, (e) => e.property, pf.title);
        return this;
    }

    withFacetQuery(rangeQuery: RangeQuery): FacetQueryBuilder {
        this.query.facetQueries.push(rangeQuery);
        return this;
    }

    clearFacetsQueriesForProperty(p : Property) {
        Tools.removeAll(this.query.facetQueries, (e) => e.property, p.title);
        return this;
    }

    withPropertyValueConstraint(propertyValueConstraint: PropertyValueConstraint): FacetQueryBuilder {

        let constraint = Tools.replaceFirst(this.query.propertyValueConstraints,
            (e) => e.property.title, propertyValueConstraint.property.title, propertyValueConstraint);
        if (constraint === null) {
            this.query.propertyValueConstraints.push(propertyValueConstraint);
        }
        return this;
    }

    clearPropertyValueConstraintForProperty(p : Property) {
        Tools.removeAll(this.query.propertyValueConstraints, (e) => e.property.title, p.title);
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