/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";
import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";

export class WikiContextInterface {
    config: any;
    msg: (id: string,  ...params: string[]) => string

    constructor(config: any = [],
                msg: (id: string, ...params: string[]) => string = (id)=>"<"+id+">") {
        this.config = config;
        this.msg = msg;
    }
}

export interface ElementWithURL {
    url: string,
    displayTitle: string
}
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

    isAnyCategorySelected() {
        return (this.categoryFacets || []).length > 0;
    }

    isAnyPropertySelected() {
        return (this.propertyFacets || []).length > 0;
    }

    updateBaseQuery(base: BaseQuery): void {
        this.searchText = base.searchText;
        this.propertyFacets = Tools.deepClone( base.propertyFacets);
        this.categoryFacets = Tools.deepClone( base.categoryFacets);
        this.namespaceFacets = Tools.deepClone( base.namespaceFacets);
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
    propertyValueConstraints: PropertyValueConstraint[]
    constructor( searchText: string,
                 propertyFacets: PropertyFacet[],
                 categoryFacets: string[],
                 namespaceFacets: number[],
                 facetQueries: RangeQuery[],
                 facetProperties: PropertyValueConstraint[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.facetQueries = facetQueries;
        this.propertyValueConstraints = facetProperties;
    }

    getRangeProperties(): Property[] {
        return this.facetQueries.map((e) => new Property(e.property,e.type))
            .filter((e) => e.isRangeProperty());
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
    hasRange(): boolean {
        return (this.range && this.range !== null);
    }

    getProperty() {
        return new Property(this.property, this.type);
    }

    static facetForAnyValue(p: Property) {
        return new PropertyFacet(p.title, p.type, null, null, null);
    }

    equals(that: PropertyFacet) {

        return this.property === that.property
            && this.type === that.type
            && this.value === that.value
            && (this.mwTitle === that.mwTitle || (this.mwTitle as MWTitle).equals(that.mwTitle))
            && (this.value === that.value || (this.range as Range).equals(that.range))
            && this.ORed === that.ORed
            ;
    }

    containsValueOrMWTitle(valueCount: ValueCount): boolean {

        let sameValue = this.value && (
            (this.value as string) === valueCount.value as string
            || (this.value as number) === valueCount.value as number
            || ((this.value as Date).toUTCString && (valueCount.value as Date).toUTCString
                && (this.value as Date).toUTCString() === (valueCount.value as Date).toUTCString())
        );
        let sameMWTitle = this.mwTitle
            && (this.mwTitle === valueCount.mwTitle || (this.mwTitle as MWTitle).equals(valueCount.mwTitle))
        return sameValue || sameMWTitle;
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
    @jsonMember({deserializer: value => Tools.deserializeValue(value)})
    from: Date|number
    @jsonMember({deserializer: value => Tools.deserializeValue(value)})
    to: Date|number

    constructor(from: Date | number, to: Date | number) {
        this.from = from;
        this.to = to;
    }

    equals(that: Range|void) {
        if (!that) return false;
        return this.from === (that as Range).from && this.to === (that as Range).to;
    }
}

@jsonObject
export class Property {
    @jsonMember(String)
    title: string
    @jsonMember(Number)
    type: Datatype


    constructor(title: string, type: Datatype) {
        this.title = title;
        this.type = type;
    }

    isRangeProperty() {
        return this.type === Datatype.number || this.type === Datatype.datetime;
    }

    isBooleanProperty() {
        return this.type === Datatype.boolean;
    }

    isFilterProperty() {
        return !this.isRangeProperty() && !this.isBooleanProperty();
    }
}

export class PropertyValueConstraint {
    @jsonMember(Property)
    property: Property

    @jsonMember(Number)
    facetLimit: number
    @jsonMember(Number)
    facetOffset: number
    @jsonMember(String)
    facetContains: string

    constructor(property: Property, limit: number = null, offset: number = null, contains: string = null) {
        this.property = property;
        this.facetLimit = limit;
        this.facetOffset = offset;
        this.facetContains = contains;
    }
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

    equals(that: MWTitle|void) {
        if (!that) return false;
        return this.title === (that as MWTitle).title && this.displayTitle === (that as MWTitle).displayTitle;
    }
}

export class RangeQuery {
    property: string
    type: Datatype
    range: Range|void

    constructor(property: Property, range: Range | void) {
        this.property = property.title;
        this.type = property.type;
        this.range = range;
    }
}

export class Sort {

    constructor(property: Property, order: Order) {
        this.property = property;
        this.order = order;
    }

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
export class MWTitleWithURL extends MWTitle implements ElementWithURL {
    @jsonMember(String)
    url: string;

    constructor(title: string, displayTitle: string, url: string) {
        super(title, displayTitle);
        this.url = url;
    }

}

@jsonObject
export class PropertyWithURL extends Property implements ElementWithURL {
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(String)
    url: string
}

@jsonObject
export class ValueCount {
    @jsonMember({deserializer: value => Tools.deserializeValue(value)})
    value: string|number|Date|null;
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
export class FacetResponse {

    @jsonArrayMember(PropertyValueCount)
    valueCounts: PropertyValueCount[];

    getPropertyValueCount(property: Property): PropertyValueCount {
        return Tools.findFirst(this.valueCounts || [], (e) => e.property.title, property.title);
    }

    isEmpty() {
        return (this.valueCounts || []).length === 0;
    }
}



@jsonObject
export class PropertyFacetValues {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL

    @jsonArrayMember(String,{deserializer: Tools.arrayDeserializer})
    values: string[] | number[] | boolean[] | Date[] | MWTitleWithURL[]
}

@jsonObject
export class CategoryFacetValue implements ElementWithURL {
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


    constructor(namespace: number, displayTitle: string, count: number) {
        this.namespace = namespace;
        this.displayTitle = displayTitle;
        this.count = count;
    }
}


@jsonObject
export class Document implements ElementWithURL {
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

    getPropertyFacetValues(property: string): PropertyFacetValues {
        return Tools.findFirst(this.propertyFacets, (p) => p.property.title, property);
    }

    getCategoryFacetValue(category: string) {
        return Tools.findFirst(this.categoryFacets, (c) => c.category, category);
    }

    containsTrueFacetValue(property: string) {
        let propertyFacetValues = this.getPropertyFacetValues(property);
        if (propertyFacetValues === null) return false;
        let values = propertyFacetValues.values as boolean[];
        return values.includes(true);
    }
}

@jsonObject
export class DocumentsResponse {
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

    containsNamespace(ns: number): boolean {
        return Tools.findFirst(this.namespaceFacetCounts, (e) => e.namespace.toString(), ns.toString()) != null;
    }
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
export class StatsResponse {
    @jsonArrayMember(Stats)
    stats: Stats[];
}

