/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

/**
 * Request types
 */
export interface PropertyFacetConstraint {
    property: Property
    value: ValueType
}

export type ValueType = string | number | boolean | Date | Range | MWTitle;

export interface Property {
    title: string
    type: Datatype
}

export interface MWTitle {
    title: string
    displayTitle: string
}

export interface Range {
    from: number | Date
    to: number | Date
}

export enum Datatype {
    string,
    number,
    datetime,
    boolean,
    wikipage
}

export interface SearchQuery {
    searchText: string,
    propertyFacetConstraints: Array<PropertyFacetConstraint>,
    propertyFacets: Array<Property>
    categoryFacets: Array<string>,
    namespaceFacets: Array<number>,
    extraProperties: Array<Property>,
    sort: string,
    statField: Property
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
    stats: Stats[];
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
    highlighting: string;
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

