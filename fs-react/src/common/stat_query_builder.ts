import {RangeQuery, Property, PropertyFacet, StatQuery, DocumentQuery} from "./datatypes";

class StatQueryBuilder {

    private readonly query: StatQuery;

    constructor() {
        this.query = {
            searchText: "",
            propertyFacets: [],
            categoryFacets: [],
            namespaceFacets: [],
            statsProperties: [],
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
        this.query.statsProperties.push(property);
        return this;
    }

    update(base: DocumentQuery): void {
        this.query.searchText = base.searchText;
        this.query.propertyFacets = base.propertyFacets;
        this.query.categoryFacets = base.categoryFacets;
        this.query.namespaceFacets = base.namespaceFacets;
    }

    build(): StatQuery {
        return this.query;
    }
}

export default StatQueryBuilder;