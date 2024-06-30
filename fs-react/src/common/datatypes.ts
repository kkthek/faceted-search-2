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
}

export interface Document {
    propertyFacets: PropertyFacetResponse[];
    categoryFacets: string[];
    directCategoryFacets: string[];
    namespaceFacet: number;
}
