import {RangeQuery, Property, PropertyFacet, DocumentQuery, Sort, Datatype, Order, FacetsQuery} from "./datatypes";
import Tools from "../util/tools";

class FacetQueryBuilder {

    private readonly query: FacetsQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            facetQueries: [],
            facetProperties: []
        }
    }

    withFacetQuery(rangeQuery: RangeQuery): FacetQueryBuilder {
        this.query.facetQueries.push(rangeQuery);
        return this;
    }

    withoutFacetQuery(p : Property) {
        Tools.removePropertyFromFacetQuery(this.query, p);
        return this;
    }

    withFacetProperties(property: Property): FacetQueryBuilder {
        this.query.facetProperties.push(property);
        return this;
    }

    update(base: DocumentQuery): void {
        this.query.searchText = base.searchText;
        this.query.propertyFacets = base.propertyFacets;
        this.query.categoryFacets = base.categoryFacets;
        this.query.namespaceFacets = base.namespaceFacets;
    }

    hasPropertyFacet(property: string) {
        return Tools.findFirst(this.query.propertyFacets, (f) => f.property, property) !== null;
    }

    build(): FacetsQuery {
        return this.query;
    }

}

export default FacetQueryBuilder;