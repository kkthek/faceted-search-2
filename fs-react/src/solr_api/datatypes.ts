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
    value: string | Range | MWTitle
}

export interface Property {
    title: string
    type: Datatype
}

export interface MWTitle {
    title: string
    displayTitle: string
}

export interface Range {
    from: string
    to: string
}

export enum Datatype {
    string,
    number,
    datetime,
    boolean,
    wikipage
}

/**
 * Helper functions to return implementation specific property/value suffixes.
 * dependant from backend
 */
export let DatatypeSuffixForPropertyMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 's';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 's';
    }
}


export let DatatypeSuffixForValueMap = function(type: Datatype) {
    switch(type) {
        case Datatype.string: return 'xsdvalue_t';
        case Datatype.number: return 'xsdvalue_d';
        case Datatype.boolean: return 'xsdvalue_b';
        case Datatype.wikipage: return 't';
    }
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
