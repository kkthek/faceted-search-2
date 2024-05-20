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
    property: string
    value: MWTitle
}

export interface AttributeFacet {
    property: string
    value: string | [string, string]
    type: Datatype

}

export interface Property {
    property: string
    type: Datatype
}

export enum Datatype {
    string = 'xsdvalue_s',
    number = 'xsdvalue_d',
    datetime = 'xsdvalue_dt',
    boolean = 'xsdvalue_b',
    wikipage = 't'
}

export interface MWTitle {
    title: string
    displayTitle: string
}

/**
 * Response types
 */

export interface PropertyFacetResponse {
    property: string
    value: MWTitle[]
}

export interface AttributeFacetResponse {
    property: string
    value: any[]
    type: Datatype

}

export interface SolrResponse {
    numResults: number;
    attributeFacets: AttributeFacetResponse[];
    propertyFacets: PropertyFacetResponse[];
    categoryFacets: string[];
    namespaceFacets: number[];
}
