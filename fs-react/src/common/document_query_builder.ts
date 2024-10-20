import {RangeQuery, Property, PropertyFacet, DocumentQuery, Sort, Datatype, Order} from "./datatypes";
import Tools from "../util/tools";

class DocumentQueryBuilder {

    private readonly query: DocumentQuery;

    constructor() {
        this.query = Object.assign(new DocumentQuery(), {
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
        });
    }

    withSearchText(text: string): DocumentQueryBuilder {
        this.query.searchText = text;
        return this;
    }

    withPropertyFacet(propertyFacetConstraint: PropertyFacet): DocumentQueryBuilder {
        this.query.propertyFacets.push(propertyFacetConstraint);
        return this;
    }

    clearFacetsForProperty(property: Property): DocumentQueryBuilder {
        Tools.removeFirst(this.query.propertyFacets, (e) => e.property, property.title);
        return this;
    }

    withCategoryFacet(category: string): DocumentQueryBuilder {
        this.query.categoryFacets.push(category);
        return this;
    }

    withoutCategoryFacet(category: string): DocumentQueryBuilder {
        Tools.removeFirst(this.query.categoryFacets, (e) => e, category);
        return this;
    }

    toggleNamespaceFacet(namespace: number): DocumentQueryBuilder {
        if (this.query.namespaceFacets.indexOf(namespace) > -1) {
            Tools.removeFirst(this.query.namespaceFacets, (e) => e.toString(), namespace.toString());
        } else {
            this.query.namespaceFacets.push(namespace);
        }
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


}

export default DocumentQueryBuilder;