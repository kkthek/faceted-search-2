/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";
import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";

/**
 * Request types
 */

export class BaseQuery {
    searchText: string;
    categoryFacets: string[];
    namespaceFacets: number[];
    propertyFacets: PropertyFacet[];
    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[]) {
        this.searchText = searchText;
        this.propertyFacets = propertyFacets;
        this.categoryFacets = categoryFacets;
        this.namespaceFacets = namespaceFacets;
    }
    findPropertyFacet(property: Property): PropertyFacet {
        return Tools.findFirst(this.propertyFacets, (e) => e.property, property.title);
    }

    isPropertyFacetSelected(property: Property): boolean {
        return this.findPropertyFacet(property) !== null;
    }

    isCategoryFacetSelected(category: string): boolean {
        return Tools.findFirst(this.categoryFacets, (e) => e, category) !== null;
    }
}

export class DocumentQuery extends BaseQuery {
    extraProperties: Property[];
    sorts: Sort[];
    limit: number | null;
    offset: number | null;
    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[],
                 extraProperties: Property[],
                 sorts: Sort[],
                 limit: number,
                 offset: number) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);

        this.extraProperties = extraProperties;
        this.sorts = sorts;
        this.limit = limit;
        this.offset = offset;
    }
}

export class StatQuery extends BaseQuery {
    statsProperties: Property[]

    constructor(searchText: string,
                propertyFacets: PropertyFacet[],
                categoryFacets: string[],
                namespaceFacets: number[],
                statsProperties: Property[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.statsProperties = statsProperties;

    }
}

export class FacetsQuery extends BaseQuery {
    facetQueries: RangeQuery[]
    facetProperties: Property[]
    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[],
                 facetQueries: RangeQuery[],
                 facetProperties: Property[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.facetQueries = facetQueries;
        this.facetProperties = facetProperties;
    }
}

export class PropertyFacet {
    property: string
    type: Datatype
    value: ValueType|void;
    mwTitle: MWTitle|void;
    range: Range|void
    constructor(property: string,
                type: Datatype,
                value: ValueType|void,
                mwTitle: MWTitle|void,
                range: Range|void) {
        this.property = property;
        this.type = type;
        this.value = value;
        this.mwTitle = mwTitle;
        this.range = range;
    }

    hasValue(): boolean {
        return (this.value && this.value !== null || this.mwTitle && this.mwTitle !== null);
    }

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

@jsonObject
export class Range {
    @jsonMember(String)
    from: string
    @jsonMember(String)
    to: string
}

@jsonObject
export class Property {
    @jsonMember(String)
    title: string
    @jsonMember(Number)
    type: Datatype
}

@jsonObject
export class MWTitle {
    @jsonMember(String)
    title: string
    @jsonMember(String)
    displayTitle: string
}

export class RangeQuery {
    property: string
    type: Datatype
    range: Range|void
}

export class Sort {
    property: Property;
    order: Order
}

export enum Order {
    asc,
    desc
}

/**
 * Response types
 */

@jsonObject
export class MWTitleWithURL extends MWTitle {
    @jsonMember(String)
    url: string;
}

export class SolrDocumentsResponse {
    numResults: number;
    docs: Document[];
    categoryFacetCounts: CategoryFacetCount[];
    propertyFacetCounts: PropertyFacetCount[];
    namespaceFacetCounts: NamespaceFacetCount[];

}

export class SolrStatsResponse {
    stats: Stats[];
}

@jsonObject
export class PropertyWithURL extends Property {
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(String)
    url: string
}

@jsonObject
export class ValueCount {
    @jsonMember(String)
    value: string|null;
    @jsonMember(MWTitleWithURL)
    mwTitle: MWTitleWithURL|null;
    @jsonMember(Range)
    range: Range|null;
    @jsonMember(Number)
    count: number;

}

@jsonObject
export class PropertyValueCount {

    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonArrayMember(ValueCount)
    values: ValueCount[]

}

@jsonObject
export class SolrFacetResponse {

    @jsonArrayMember(PropertyValueCount)
    valueCounts: PropertyValueCount[];

    getPropertyValueCount(property: Property): PropertyValueCount {
        return Tools.findFirst(this.valueCounts || [], (e) => e.property.title, property.title);
    }
}

export class Document {
    id: string
    propertyFacets: PropertyFacetValues[];
    categoryFacets: CategoryFacetValue[];
    directCategoryFacets: CategoryFacetValue[];
    namespaceFacet: NamespaceFacetValue;
    properties: PropertyWithURL[];
    title: string;
    displayTitle: string;
    url: string;
    score: number;
    highlighting: string | null;
}

export class Stats {
    property: PropertyWithURL;
    min: number;
    max: number;
    count: number;
    sum: number;
    clusters: Range[]
}

export class PropertyFacetValues {
    property: PropertyWithURL
    values: string[] | number[] | boolean[] | Date[] | MWTitleWithURL[]
}

export class CategoryFacetValue {
    category: string
    displayTitle: string
    url: string
}

export class NamespaceFacetValue {
    namespace: number;
    displayTitle: string
}





export class CategoryFacetCount {
    category: string;
    displayTitle: string;
    count: number;
}

export class PropertyFacetCount {
    property: PropertyWithURL;
    count: number;
}

export class NamespaceFacetCount {
    namespace: number;
    displayTitle: string;
    count: number;
}

