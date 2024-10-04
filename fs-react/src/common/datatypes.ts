/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

/**
 * Request types
 */

export interface BaseQuery {
    searchText: string,
    categoryFacets: string[],
    namespaceFacets: number[],
    propertyFacets: PropertyFacet[]
}

export interface DocumentQuery extends BaseQuery {
    extraProperties: Property[],
    sorts: Sort[],
    limit: number | null,
    offset: number | null
}

export interface StatQuery extends BaseQuery {
    statsProperties: Property[]
}

export interface FacetsQuery extends BaseQuery {
    facetQueries: RangeQuery[]
    facetProperties: Property[]
}

export interface PropertyFacet {
    property: string
    type: Datatype
    value: ValueType|void,
    mwTitle: MWTitle|void,
    range: Range|void
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

export interface Range {
    from: string
    to: string
}

export interface Property {
    title: string
    type: Datatype
}

export interface MWTitle {
    title: string
    displayTitle: string
}

export interface RangeQuery {
    property: string
    type: Datatype
    range: Range|void
}

export interface Sort {
    property: Property,
    order: Order
}

export enum Order {
    asc,
    desc
}

/**
 * Response types
 */
export interface SolrDocumentsResponse {
    numResults: number;
    docs: Document[];
    categoryFacetCounts: CategoryFacetCount[];
    propertyFacetCounts: PropertyFacetCount[];
    namespaceFacetCounts: NamespaceFacetCount[];

}

export interface SolrStatsResponse {
    stats: Stats[];
}

export interface SolrFacetResponse {
    rangeValueCounts: RangeValueCounts[];
    valueCounts: PropertyValueCount[];
}

export interface PropertyResponse {
    title: string,
    displayTitle: string,
    type: Datatype,
    url: string
}

export interface RangeValueCounts {
    property: PropertyResponse
    range: Range
    count: number;
}

export interface Document {
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

export interface Stats {
    property: PropertyResponse;
    min: number;
    max: number;
    count: number;
    sum: number;
    clusters: Range[]
}

export interface PropertyFacetValues {
    property: PropertyResponse
    values: string[] | number[] | boolean[] | Date[] | MWTitle[]
}

export interface CategoryFacetValue {
    category: string
    displayTitle: string
    url: string
}

export interface NamespaceFacetValue {
    namespace: number;
    displayTitle: string
}

export interface PropertyValueCount {
    property: PropertyResponse,
    values: ValueCount[]

}

export interface ValueCount {
    value: string|null,
    mwTitle: MWTitle|null,
    count: number
}

export interface CategoryFacetCount {
    category: string;
    displayTitle: string;
    count: number;
}

export interface PropertyFacetCount {
    property: PropertyResponse;
    count: number;
}

export interface NamespaceFacetCount {
    namespace: number;
    displayTitle: string;
    count: number;
}

