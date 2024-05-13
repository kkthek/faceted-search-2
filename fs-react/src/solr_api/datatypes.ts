export interface PropertyFacet {
    property: string        // property as MW-DBkey
    value: MWTitle
}

export interface AttributeFacet {
    property: string        // property as MW-DBkey
    value: string | [string, string]
    type: Datatype

}

export interface Property {
    property: string        // property as MW-DBkey
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
    dbKey: string
    displayTitle: string
}

