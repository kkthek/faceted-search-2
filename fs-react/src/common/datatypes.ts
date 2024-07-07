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

export interface PropertyFacetResponse {
    property: Property
    values: string[] | number[] | boolean[] | Date[] | MWTitle[]
}

export interface SolrResponse {
    numResults: number;
    docs: Document[];
    categoryFacetCounts: CategoryFacetCount[];
    propertyFacetCounts: PropertyFacetCount[];
    namespaceFacetCounts: NamespaceFacetCount[];
}

export interface CategoryFacetCount {
    title: string;
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

export interface Document {
    propertyFacets: PropertyFacetResponse[];
    categoryFacets: string[];
    directCategoryFacets: string[];
    namespaceFacet: number;
    properties: Property[];
    title: string;
    displayTitle: string;
    score: number;
}
