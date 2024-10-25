/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";
import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {CustomDeserializerParams} from "typedjson/lib/types/metadata";

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
    ORed: boolean = false;
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

    setORed(ORed: boolean) {
        this.ORed = ORed;
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
    @jsonMember({deserializer: value => deserializeValue(value)})
    from: Date|number
    @jsonMember({deserializer: value => deserializeValue(value)})
    to: Date|number
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

    constructor(title: string, displayTitle: string) {
        this.title = title;
        this.displayTitle = displayTitle;
    }
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

    constructor(title: string, displayTitle: string, url: string) {
        super(title, displayTitle);
        this.url = url;
    }

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

function deserializeValue(value: any) {

    if (value.title) {
        return new MWTitleWithURL(value.title, value.displayTitle, value.url);
    } else if (typeof(value) === 'string' && value.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/)) {
        return new Date(Date.parse(value))
    } else return value;
}

function objArrayDeserializer(
    json: Array<{prop: string; shouldDeserialize: boolean}>,
    params: CustomDeserializerParams,
) {

    return json.map(
        value => deserializeValue(value)
    );
}

@jsonObject
export class PropertyFacetValues {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL

    @jsonArrayMember(String,{deserializer: objArrayDeserializer})
    values: string[] | number[] | boolean[] | Date[] | MWTitleWithURL[]
}

@jsonObject
export class CategoryFacetValue {
    @jsonMember(String)
    category: string
    @jsonMember(String)
    displayTitle: string
    @jsonMember(String)
    url: string
}

@jsonObject
export class NamespaceFacetValue {
    @jsonMember(Number)
    namespace: number;
    @jsonMember(String)
    displayTitle: string
}

@jsonObject
export class CategoryFacetCount {
    @jsonMember(String)
    category: string;
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(Number)
    count: number;
}

@jsonObject
export class PropertyFacetCount {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonMember(Number)
    count: number;
}

@jsonObject
export class NamespaceFacetCount {
    @jsonMember(Number)
    namespace: number;
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(Number)
    count: number;
}


@jsonObject
export class Document {
    @jsonMember(String)
    id: string
    @jsonArrayMember(PropertyFacetValues)
    propertyFacets: PropertyFacetValues[];
    @jsonArrayMember(CategoryFacetValue)
    categoryFacets: CategoryFacetValue[];
    @jsonArrayMember(CategoryFacetValue)
    directCategoryFacets: CategoryFacetValue[];
    @jsonMember(NamespaceFacetValue)
    namespaceFacet: NamespaceFacetValue;
    @jsonArrayMember(PropertyWithURL)
    properties: PropertyWithURL[];
    @jsonMember(String)
    title: string;
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(String)
    url: string;
    @jsonMember(Number)
    score: number;
    @jsonMember(String)
    highlighting: string | null;
}

@jsonObject
export class SolrDocumentsResponse {
    @jsonMember(Number)
    numResults: number;
    @jsonArrayMember(Document)
    docs: Document[];
    @jsonArrayMember(CategoryFacetCount)
    categoryFacetCounts: CategoryFacetCount[];
    @jsonArrayMember(PropertyFacetCount)
    propertyFacetCounts: PropertyFacetCount[];
    @jsonArrayMember(NamespaceFacetCount)
    namespaceFacetCounts: NamespaceFacetCount[];

}

@jsonObject
export class Stats {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonMember(Number)
    min: number;
    @jsonMember(Number)
    max: number;
    @jsonMember(Number)
    count: number;
    @jsonMember(Number)
    sum: number;
    @jsonArrayMember(Range)
    clusters: Range[]
}

@jsonObject
export class SolrStatsResponse {
    @jsonArrayMember(Stats)
    stats: Stats[];
}

