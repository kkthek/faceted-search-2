/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

/**
 * Request types
 */

export interface SearchQuery {
    searchText: string,
    categoryFacets: string[],
    namespaceFacets: number[],
    propertyFacets: PropertyFacet[],
    extraProperties: Property[],
    sorts: Sort[],
    statFields: Property[]
    rangeQueries: RangeQuery[]
    limit: number | null,
    offset: number | null
}

export interface PropertyFacet {
    property: string
    value: ValueType|AnyValueType
}

export type ValueType =
      string
    | number
    | boolean
    | Date
    | RangeType
    | MWTitle;

export interface AnyValueType {
    type: Datatype
}

export enum Datatype {
    string,
    number,
    datetime,
    boolean,
    wikipage,
    internal
}

export type RangeType = Range<number|Date>

export interface Range<T> {
    from: T
    to: T
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
    range: RangeType
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
export interface SolrResponse {
    numResults: number;
    docs: Document[];
    categoryFacetCounts: CategoryFacetCount[];
    propertyFacetCounts: PropertyFacetCount[];
    namespaceFacetCounts: NamespaceFacetCount[];
    propertyValueCount: PropertyValueCount[];
    rangeValueCounts: RangeValueCounts[]
    stats: Stats[];
}

export interface RangeValueCounts {
    property: Property
    range: Range<number|Date>
    count: number;
}

export interface Document {
    id: string
    propertyFacets: PropertyFacetValues[];
    categoryFacets: CategoryFacetValue[];
    directCategoryFacets: CategoryFacetValue[];
    namespaceFacet: NamespaceFacetValue;
    properties: Property[];
    title: string;
    displayTitle: string;
    score: number;
    highlighting: string | null;
}

export interface Stats {
    property: Property;
    min: number;
    max: number;
    count: number;
    sum: number;
}

export interface PropertyFacetValues {
    property: Property
    values: string[] | number[] | boolean[] | Date[] | MWTitle[]
}

export interface CategoryFacetValue {
    category: string
    displayTitle: string
}

export interface NamespaceFacetValue {
    namespace: number;
    displayTitle: string
}

export interface PropertyValueCount {
    property: Property,
    values: ValueCount[]

}

export interface ValueCount {
    value: string,
    count: number
}

export interface CategoryFacetCount {
    category: string;
    count: number;
}

export interface PropertyFacetCount {
    property: Property;
    count: number;
}

export interface NamespaceFacetCount {
    namespace: number;
    count: number;
}

