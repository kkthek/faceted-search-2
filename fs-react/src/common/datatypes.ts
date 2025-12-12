/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 * interfaces, enums and types used in the request and response objects
 */

export interface TextFilters {
    [title:string] : string;
}

export interface ElementWithURL {
    url: string,
    displayTitle: string
}


export type ValueType = string | number | boolean | Date;

export enum Datatype {
    string,
    number,
    datetime,
    boolean,
    wikipage,
    internal

}

export enum Order {
    asc,
    desc
}


export interface Sortable<T> {
    compareAlphabetically(that: T): number;
    compareByCount(that: T): number;
}


