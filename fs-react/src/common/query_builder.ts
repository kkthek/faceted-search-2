import {RangeQuery, Property, PropertyFacet, SearchQuery, Sort, Datatype, Order} from "./datatypes";

class QueryBuilder {

    private readonly query: SearchQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            extraProperties: [],
            sorts: [
                { property: {title:"score", type: Datatype.internal }, order: Order.desc},
                { property: {title:"displaytitle", type: Datatype.internal }, order: Order.asc}
            ],
            statFields: [],
            rangeQueries: [],
            limit: 10,
            offset: 0
        }
    }

    withSearchText(text: string): QueryBuilder {
        this.query.searchText = text;
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

    withLimit(limit: number): QueryBuilder {
        this.query.limit = limit;
        return this;
    }
    
    withOffset(offset: number): QueryBuilder {
        this.query.offset = offset;
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