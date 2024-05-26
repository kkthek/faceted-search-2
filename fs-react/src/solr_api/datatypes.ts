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
    string,
    number,
    datetime,
    boolean,
    wikipage
}

export let DatatypeForPropertyMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 's';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 's';
    }
}


export let DatatypeForValueMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 'xsdvalue_t';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 't';
    }
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
    docs: Documents[];
}

export interface Documents {
    attributeFacets: AttributeFacetResponse[];
    propertyFacets: PropertyFacetResponse[];
    categoryFacets: string[];
    directCategoryFacets: string[];
    namespaceFacet: number;
}
