/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";
import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";

export interface ElementWithURL {
    url: string,
    displayTitle: string
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

    getItemId() {
        return Tools.createItemIdForProperty(this);
    }

    equals(that: Property) {
        return that.title === this.title && that.type === this.type;
    }
}

@jsonObject
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

    equals(that: PropertyValueConstraint) {
        return that.property.equals(this.property) && that.facetContains === this.facetContains
        && that.facetLimit === this.facetLimit && that.facetOffset === this.facetOffset;
    }
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

/**
 * Request types
 */
@jsonObject
export class FacetValue {
    @jsonMember({deserializer: value => Tools.deserializeValue(value)})
    value: ValueType|void;
    @jsonMember(MWTitle)
    mwTitle: MWTitle|void;
    @jsonMember(Range)
    range: Range|void


    constructor(value: ValueType | void, mwTitle: MWTitle | void, range: Range | void) {
        this.value = value;
        this.mwTitle = mwTitle;
        this.range = range;
    }



    equals(that: FacetValue) {

        return this.value === that.value
            && (this.mwTitle === that.mwTitle || (this.mwTitle as MWTitle).equals(that.mwTitle))
            && (this.value === that.value || (this.range as Range).equals(that.range))
            ;
    }

    containsValueOrMWTitle(valueCount: ValueCount): boolean {

            let sameValue =  (
                (this.value as string) === valueCount.value as string
                || (this.value as number) === valueCount.value as number
                || ((this.value as Date).toUTCString && (valueCount.value as Date).toUTCString
                    && (this.value as Date).toUTCString() === (valueCount.value as Date).toUTCString())
            );
            let sameMWTitle = this.mwTitle
                && (this.mwTitle === valueCount.mwTitle || (this.mwTitle as MWTitle).equals(valueCount.mwTitle))
            if (sameValue || sameMWTitle) {
                return true;
            }

        return false;
    }
}

@jsonObject
export class PropertyFacet {
    @jsonMember(Property)
    property: Property
    @jsonArrayMember(FacetValue)
    values: FacetValue[]
    constructor(property: Property,
                values: FacetValue[]
    ) {
        this.property = property;
        this.values = values;
    }

    hasValue(): boolean {
        for(let i = 0; i < this.values.length; i++) {
            if (this.values[i].value && this.values[i].value !== null || this.values[i].mwTitle && this.values[i].mwTitle !== null) {
                return true;
            }
        }
        return false;
    }

    hasRange(): boolean {
        for(let i = 0; i < this.values.length; i++) {
            if (this.values[i].range && this.values[i].range !== null) {
                return true;
            }
        }
        return false;
    }

    getProperty() {
        return this.property;
    }

    static facetForAnyValue(p: Property) {
        return new PropertyFacet(p, [new FacetValue(null, null, null)]);
    }

    equals(that: PropertyFacet) {

        if (this.values.length !== that.values.length) {
            return false;
        }
        let sameValues = true;
        for(let i = 0; i < this.values.length; i++) {
            sameValues = sameValues && this.values[i].equals(that.values[i]);
        }

        return this.property.equals(that.property) && sameValues;
    }


}

@jsonObject
export class RangeQuery {
    @jsonMember(Property)
    property: Property
    @jsonMember(Range)
    range: Range|void

    constructor(property: Property, range: Range | void) {
        this.property = property;
        this.range = range;
    }
}

@jsonObject
export class Sort {

    constructor(property: Property, order: Order) {
        this.property = property;
        this.order = order;
    }
    @jsonMember(Property)
    property: Property;
    @jsonMember(Number)
    order: Order
}


@jsonObject
export class BaseQuery {
    @jsonMember(String)
    searchText: string;
    @jsonArrayMember(String)
    categoryFacets: string[];
    @jsonArrayMember(Number)
    namespaceFacets: number[];
    @jsonArrayMember(PropertyFacet)
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
        return Tools.findFirst(this.propertyFacets, (e) => e.property.title, property.title);
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
@jsonObject
export class DocumentQuery extends BaseQuery {
    @jsonArrayMember(Property)
    extraProperties: Property[];
    @jsonArrayMember(Sort)
    sorts: Sort[];
    @jsonMember(Number)
    limit: number | null;
    @jsonMember(Number)
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
@jsonObject
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
@jsonObject
export class FacetsQuery extends BaseQuery {
    @jsonArrayMember(RangeQuery)
    facetQueries: RangeQuery[]
    @jsonArrayMember(PropertyValueConstraint)
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
        return this.facetQueries.map((e) => e.property)
            .filter((e) => e.isRangeProperty());
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

    asProperty(): Property {
        return new Property(this.title, this.type);
    }
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

    compare(valueCount: ValueCount) {
        if (this.value && valueCount.value ) {
            return this.value.toLocaleString().localeCompare(valueCount.value.toLocaleString());
        } else if(this.mwTitle && valueCount.mwTitle) {
            return this.mwTitle.title.toLocaleString().localeCompare(valueCount.mwTitle.title.toLocaleString());
        }
        return 0;
    }
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

