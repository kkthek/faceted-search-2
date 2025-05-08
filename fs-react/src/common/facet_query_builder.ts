import {BaseQuery, FacetsQuery, Property, PropertyFacet, PropertyValueConstraint, RangeQuery} from "./datatypes";
import Tools from "../util/tools";
import DocumentQueryBuilder from "./document_query_builder";

class FacetQueryBuilder {

    private readonly query: FacetsQuery;

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

    updateBaseQuery(base: DocumentQueryBuilder): void {
        let query = base.build();
        this.updateBaseQueryDirect(query);
    }

    updateBaseQueryDirect(base: BaseQuery): void {
        let query = base;
        this.query.searchText = query.searchText;
        this.query.propertyFacets = query.propertyFacets;
        this.query.categoryFacets = query.categoryFacets;
        this.query.namespaceFacets = query.namespaceFacets;
    }

    build(): FacetsQuery {
        return this.query;
    }

}

export default FacetQueryBuilder;