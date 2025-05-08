import {BaseQuery, Property, StatQuery} from "./datatypes";

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

    updateBaseQuery(base: BaseQuery): StatQueryBuilder {
        this.query.updateBaseQuery(base);
        return this;
    }

    build(): StatQuery {
        return this.query;
    }
}

export default StatQueryBuilder;