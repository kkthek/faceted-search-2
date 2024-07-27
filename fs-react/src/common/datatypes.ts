/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

/**
 * Request types
 */
export interface PropertyFacet {
    property: Property
    value: ValueType
}

export interface Property {
    title: string
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

export type ValueType =
      string
    | number
    | boolean
    | Date
    | RangeType
    | MWTitle
    | null;

export type RangeType = Range<number|Date>

export interface Range<T> {
    from: T
    to: T
}

export interface MWTitle {
    title: string
    displayTitle: string
}


export interface SearchQuery {
    searchText: string,
    propertyFacets: PropertyFacet[],
    categoryFacets: string[],
    namespaceFacets: number[],
    extraProperties: Property[],
    sorts: Sort[],
    statFields: Property[]
    rangeQueries: RangeQuery[]
}

export interface RangeQuery {
    property: Property
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
    categoryFacets: string[];
    directCategoryFacets: string[];
    namespaceFacet: number;
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

