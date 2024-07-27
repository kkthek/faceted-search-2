import {RangeQuery, Property, PropertyFacet, SearchQuery, Sort, Datatype, Order} from "./datatypes";

class QueryBuilder {

    private readonly query: SearchQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacets: [],
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            extraProperties: [],
            sorts: [
                { property: {title:"score", type: Datatype.internal }, order: Order.desc},
                { property: {title:"displaytitle", type: Datatype.internal }, order: Order.asc}
            ],
            statFields: [],
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

    withPropertyFacetConstraint(propertyFacetConstraint: PropertyFacet): QueryBuilder {
        this.query.propertyFacets.push(propertyFacetConstraint);
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

    withSort(sort: Sort): QueryBuilder {
        this.query.sorts.push(sort);
        return this;
    }

    withStatField(property: Property): QueryBuilder {
        this.query.statFields.push(property);
        return this;
    }

    withRangeQuery(facetQuery: RangeQuery): QueryBuilder {
        this.query.rangeQueries.push(facetQuery);
        return this;
    }

    build(): SearchQuery {
        return this.query;
    }
}

export default QueryBuilder;