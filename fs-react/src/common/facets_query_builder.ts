import {RangeQuery, Property, PropertyFacet, StatQuery, FacetsQuery} from "./datatypes";

class FacetsQueryBuilder {

    private readonly query: FacetsQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            facetQueries: []
        }
    }

    withSearchText(text: string): FacetsQueryBuilder {
        this.query.searchText = text;
        return this;
    }

    withPropertyFacetConstraint(propertyFacetConstraint: PropertyFacet): FacetsQueryBuilder {
        this.query.propertyFacets.push(propertyFacetConstraint);
        return this;
    }

    withCategoryFacet(category: string): FacetsQueryBuilder {
        this.query.categoryFacets.push(category);
        return this;
    }

    withNamespaceFacet(namespace: number): FacetsQueryBuilder {
        this.query.namespaceFacets.push(namespace);
        return this;
    }

    withRangeQuery(facetQuery: RangeQuery): FacetsQueryBuilder {
        this.query.facetQueries.push(facetQuery);
        return this;
    }

    build(): FacetsQuery {
        return this.query;
    }
}

export default FacetsQueryBuilder;