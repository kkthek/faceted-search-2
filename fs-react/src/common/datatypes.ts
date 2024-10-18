/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";

/**
 * Request types
 */

export class BaseQuery {
    searchText: string;
    categoryFacets: string[];
    namespaceFacets: number[];
    propertyFacets: PropertyFacet[];
    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[]) {
        this.searchText = searchText;
        this.propertyFacets = propertyFacets.map((e) => new PropertyFacet(e.property, e.type, e.value, e.mwTitle, e.range));
        this.categoryFacets = categoryFacets;
        this.namespaceFacets = namespaceFacets;
    }

    findPropertyFacet(property: Property): PropertyFacet {
        return Tools.findFirst(this.propertyFacets, (e) => e.property, property.title);
    }

    isPropertyFacetSelected(property: Property): boolean {
        return this.findPropertyFacet(property) !== null;
    }

    isCategoryFacetSelected(category: string): boolean {
        return Tools.findFirst(this.categoryFacets, (e) => e, category) !== null;
    }

    static fromQuery(query :BaseQuery): BaseQuery {
        return new BaseQuery(query.searchText, query.propertyFacets, query.categoryFacets, query.namespaceFacets);
    }
}

export class DocumentQuery extends BaseQuery {
    extraProperties: Property[];
    sorts: Sort[];
    limit: number | null;
    offset: number | null;

    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[],
                 extraProperties: Property[],
                 sorts: Sort[],
                 limit: number,
                 offset: number) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);

        this.extraProperties = extraProperties;
        this.sorts = sorts;
        this.limit = limit;
        this.offset = offset;
    }

}

export class StatQuery extends BaseQuery {
    statsProperties: Property[]

    constructor(searchText: string,
                propertyFacets: PropertyFacet[],
                categoryFacets: string[],
                namespaceFacets: number[],
                statsProperties: Property[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.statsProperties = statsProperties;

    }

}

export class FacetsQuery extends BaseQuery {
    facetQueries: RangeQuery[]
    facetProperties: Property[]
    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[],
                 facetQueries: RangeQuery[],
                 facetProperties: Property[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.facetQueries = facetQueries;
        this.facetProperties = facetProperties;
    }
}

export class PropertyFacet {
    property: string
    type: Datatype
    value: ValueType|void;
    mwTitle: MWTitle|void;
    range: Range|void

    constructor(property: string,
                type: Datatype,
                value: ValueType|void,
                mwTitle: MWTitle|void,
                range: Range|void) {
        this.property = property;
        this.type = type;
        this.value = value;
        this.mwTitle = mwTitle;
        this.range = range;
    }

    hasValue(): boolean {
        return (this.value && this.value !== null || this.mwTitle && this.mwTitle !== null);
    }
}

export type ValueType = string | number | boolean | Date;

export enum Datatype {
    string,
    number,
    datetime,
    boolean,
    wikipage,
    internal
}

export class Range {
    from: string
    to: string
}

export class Property {
    title: string
    type: Datatype
}

export class MWTitle {
    title: string
    displayTitle: string
}

export class RangeQuery {
    property: string
    type: Datatype
    range: Range|void
}

export class Sort {
    property: Property;
    order: Order
}

export enum Order {
    asc,
    desc
}

/**
 * Response types
 */
export class SolrDocumentsResponse {
    numResults: number;
    docs: Document[];
    categoryFacetCounts: CategoryFacetCount[];
    propertyFacetCounts: PropertyFacetCount[];
    namespaceFacetCounts: NamespaceFacetCount[];

}

export class SolrStatsResponse {
    stats: Stats[];
}

export class SolrFacetResponse {
    valueCounts: PropertyValueCount[];
}

export class PropertyResponse extends Property {
    displayTitle: string;
    url: string
}

export class Document {
    id: string
    propertyFacets: PropertyFacetValues[];
    categoryFacets: CategoryFacetValue[];
    directCategoryFacets: CategoryFacetValue[];
    namespaceFacet: NamespaceFacetValue;
    properties: PropertyResponse[];
    title: string;
    displayTitle: string;
    url: string;
    score: number;
    highlighting: string | null;
}

export class Stats {
    property: PropertyResponse;
    min: number;
    max: number;
    count: number;
    sum: number;
    clusters: Range[]
}

export class PropertyFacetValues {
    property: PropertyResponse
    values: string[] | number[] | boolean[] | Date[] | MWTitle[]
}

export class CategoryFacetValue {
    category: string
    displayTitle: string
    url: string
}

export class NamespaceFacetValue {
    namespace: number;
    displayTitle: string
}

export class PropertyValueCount {
    property: PropertyResponse;
    values: ValueCount[]

}

export class ValueCount {
    value: string|null;
    mwTitle: MWTitle|null;
    range: Range|null;
    count: number
}

export class CategoryFacetCount {
    category: string;
    displayTitle: string;
    count: number;
}

export class PropertyFacetCount {
    property: PropertyResponse;
    count: number;
}

export class NamespaceFacetCount {
    namespace: number;
    displayTitle: string;
    count: number;
}

