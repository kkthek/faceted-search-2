import {RangeQuery, Property, PropertyFacet, DocumentQuery, Sort, Datatype, Order} from "./datatypes";
import Tools from "../util/tools";

class DocumentQueryBuilder {

    private readonly query: DocumentQuery;

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

            limit: 10,
            offset: 0
        }
    }

    withSearchText(text: string): DocumentQueryBuilder {
        this.query.searchText = text;
        return this;
    }

    withPropertyFacetConstraint(propertyFacetConstraint: PropertyFacet): DocumentQueryBuilder {
        this.query.propertyFacets.push(propertyFacetConstraint);
        return this;
    }

    withCategoryFacet(category: string): DocumentQueryBuilder {
        this.query.categoryFacets.push(category);
        return this;
    }

    withNamespaceFacet(namespace: number): DocumentQueryBuilder {
        this.query.namespaceFacets.push(namespace);
        return this;
    }

    withExtraProperty(property: Property): DocumentQueryBuilder {
        this.query.extraProperties.push(property);
        return this;
    }

    withSort(sort: Sort): DocumentQueryBuilder {
        this.query.sorts.push(sort);
        return this;
    }

    withLimit(limit: number): DocumentQueryBuilder {
        this.query.limit = limit;
        return this;
    }
    
    withOffset(offset: number): DocumentQueryBuilder {
        this.query.offset = offset;
        return this;
    }

    build(): DocumentQuery {
        return this.query;
    }

    hasPropertyFacet(property: string) {
        return Tools.findFirst(this.query.propertyFacets, (f) => f.property, property) !== null;
    }
}

export default DocumentQueryBuilder;