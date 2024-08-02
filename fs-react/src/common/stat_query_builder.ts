import {RangeQuery, Property, PropertyFacet, StatQuery} from "./datatypes";

class StatQueryBuilder {

    private readonly query: StatQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            statFields: [],
            rangeQueries: []
        }
    }

    withSearchText(text: string): StatQueryBuilder {
        this.query.searchText = text;
        return this;
    }

    withPropertyFacetConstraint(propertyFacetConstraint: PropertyFacet): StatQueryBuilder {
        this.query.propertyFacets.push(propertyFacetConstraint);
        return this;
    }

    withCategoryFacet(category: string): StatQueryBuilder {
        this.query.categoryFacets.push(category);
        return this;
    }

    withNamespaceFacet(namespace: number): StatQueryBuilder {
        this.query.namespaceFacets.push(namespace);
        return this;
    }

    withStatField(property: Property): StatQueryBuilder {
        this.query.statFields.push(property);
        return this;
    }

    withRangeQuery(facetQuery: RangeQuery): StatQueryBuilder {
        this.query.rangeQueries.push(facetQuery);
        return this;
    }

    build(): StatQuery {
        return this.query;
    }
}

export default StatQueryBuilder;