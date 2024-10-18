import {Property, StatQuery} from "./datatypes";
import DocumentQueryBuilder from "./document_query_builder";

class StatQueryBuilder {

    private readonly query: StatQuery;

    constructor() {
        this.query = new StatQuery(
            "",
            [],
            [],
            [],
            [],
        );
    }

    withStatField(property: Property): StatQueryBuilder {
        this.query.statsProperties.push(property);
        return this;
    }

    updateBaseQuery(base: DocumentQueryBuilder): void {
        let query = base.build();
        this.query.searchText = query.searchText;
        this.query.propertyFacets = query.propertyFacets;
        this.query.categoryFacets = query.categoryFacets;
        this.query.namespaceFacets = query.namespaceFacets;
    }

    build(): StatQuery {
        return this.query;
    }
}

export default StatQueryBuilder;