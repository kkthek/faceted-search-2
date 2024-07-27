import {RangeQuery, Property, PropertyFacetConstraint, SearchQuery} from "./datatypes";

class QueryBuilder {

    private readonly query: SearchQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacetConstraints: [],
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            extraProperties: [],
            sort: "score desc, smwh_displaytitle asc",
            statField: null,
            rangeQueries: []
        }
    }

    withSearchText(text: string): QueryBuilder {
        this.query.searchText = text;
        return this;
    }

    withPropertyFacet(property: Property): QueryBuilder {
        this.query.propertyFacets.push(property);
        return this;
    }

    withPropertyFacetConstraint(propertyFacetConstraint: PropertyFacetConstraint): QueryBuilder {
        this.query.propertyFacetConstraints.push(propertyFacetConstraint);
        return this;
    }

    withCategoryFacet(category: string): QueryBuilder {
        this.query.categoryFacets.push(category);
        return this;
    }

    withNamespaceFacet(namespace: number): QueryBuilder {
        this.query.namespaceFacets.push(namespace);
        return this;
    }

    withExtraProperty(property: Property): QueryBuilder {
        this.query.extraProperties.push(property);
        return this;
    }

    withSort(sort: string): QueryBuilder {
        this.query.sort = sort;
        return this;
    }

    withStatField(property: Property): QueryBuilder {
        this.query.statField = property;
        return this;
    }

    withFacetQuery(facetQuery: RangeQuery): QueryBuilder {
        this.query.rangeQueries.push(facetQuery);
        return this;
    }

    build(): SearchQuery {
        return this.query;
    }
}

export default QueryBuilder;