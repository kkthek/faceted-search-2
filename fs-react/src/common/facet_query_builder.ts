import {RangeQuery, Property, PropertyFacet, DocumentQuery, Sort, Datatype, Order, FacetsQuery} from "./datatypes";
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

    withFacetQuery(rangeQuery: RangeQuery): FacetQueryBuilder {
        this.query.facetQueries.push(rangeQuery);
        return this;
    }

    clearFacetsQueriesForProperty(p : Property) {
        Tools.removeAll(this.query.facetQueries, (e) => e.property, p.title);
        return this;
    }

    withFacetProperties(property: Property): FacetQueryBuilder {
        this.query.facetProperties.push(property);
        return this;
    }

    clearFacetsForProperty(p : Property) {
        Tools.removeAll(this.query.facetProperties, (e) => e.title, p.title);
        return this;
    }

    updateBaseQuery(base: DocumentQueryBuilder): void {
        let query = base.build();
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