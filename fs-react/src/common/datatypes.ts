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

/**
 * Response types
 */
export interface SolrResponse {
    numResults: number;
    docs: Document[];
    categoryFacetCounts: CategoryFacetCount[];
    propertyFacetCounts: PropertyFacetCount[];
    namespaceFacetCounts: NamespaceFacetCount[];
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

export interface PropertyFacetValues {
    property: Property
    values: string[] | number[] | boolean[] | Date[] | MWTitle[]
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

