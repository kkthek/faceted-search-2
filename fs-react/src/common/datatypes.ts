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
export class PropertyValueQuery {
    @jsonMember(Property)
    property: Property

    @jsonMember(Number)
    valueLimit: number
    @jsonMember(Number)
    valueOffset: number
    @jsonMember(String)
    valueContains: string

    constructor(property: Property, limit: number = null, offset: number = null, contains: string = null) {
        this.property = property;
        this.valueLimit = limit;
        this.valueOffset = offset;
        this.valueContains = contains;
    }

    equals(that: PropertyValueQuery) {
        return that.property.equals(this.property) && that.valueContains === this.valueContains
            && that.valueLimit === this.valueLimit && that.valueOffset === this.valueOffset;
    }

    static forAllValues(property: Property) {
        return new PropertyValueQuery(property, null, null, null);
    }
}

@jsonObject
export class Range {
    @jsonMember({deserializer: value => Tools.deserializeValue(value)})
    from: Date | number
    @jsonMember({deserializer: value => Tools.deserializeValue(value)})
    to: Date | number

    constructor(from: Date | number, to: Date | number) {
        this.from = from;
        this.to = to;
    }

    equals(that: Range | void) {
        if (!that) return false;
        return this.from === (that as Range).from && this.to === (that as Range).to;
    }

    withinRange(that: Range | void) {
        if (!that) return false;
        if (this.from as number && this.to as number) {
            return this.from <= (that as Range).from && this.to >= (that as Range).to;
        } else {
            return (this.from as Date).getTime() <= (that.from as Date).getTime()
                && (this.to as Date).getTime() >= (that.to as Date).getTime();
        }
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

    equals(that: MWTitle | void) {
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
    value: ValueType | void;
    @jsonMember(MWTitle)
    mwTitle: MWTitle | void;
    @jsonMember(Range)
    range: Range | void


    constructor(value: ValueType | void, mwTitle: MWTitle | void, range: Range | void) {
        this.value = value;
        this.mwTitle = mwTitle;
        this.range = range;
    }

    static fromValueCount(valueCount: ValueCount) {
        return new FacetValue(valueCount.value, valueCount.mwTitle, valueCount.range);
    }

    static fromRange(range: Range) {
        return new FacetValue(null, null, range);
    }

    static fromMWTitle(mwTitle: MWTitle) {
        return new FacetValue(null, mwTitle, null);
    }

    static fromValue(value: ValueType) {
        return new FacetValue(value, null, null);
    }

    equals(that: FacetValue) {

        return FacetValue.sameValue(this.value, that.value)
            && FacetValue.sameMWTitle(this.mwTitle, that.mwTitle)
            && FacetValue.sameRange(this.range, that.range)
            ;
    }

    equalsOrWithinRange(that: FacetValue) {

        return FacetValue.sameValue(this.value, that.value)
            && FacetValue.sameMWTitle(this.mwTitle, that.mwTitle)
            && FacetValue.withinRange(this.range, that.range)
            ;
    }

    containsValueOrMWTitle(value: ValueType|void, mwTitle: MWTitle|void): boolean {

        return (this.value && FacetValue.sameValue(this.value, value))
            || (this.mwTitle && FacetValue.sameMWTitle(this.mwTitle, mwTitle));

    }

    static sameValue(a: ValueType|void, b: ValueType|void) {
        if ((a === null && b !== null) || (a !== null && b === null)) {
            return false;
        }
        return (a === b)
            || (a as string) === b as string
            || (a as number) === b as number
            || (a as boolean) === b as boolean
            || ((a as Date).toUTCString && (b as Date).toUTCString
                && (a as Date).toUTCString() === (b as Date).toUTCString());
    }

    static sameMWTitle(a: MWTitle|void, b: MWTitle|void) {
        return (a === b || (a as MWTitle).equals(b));
    }

    static sameRange(a: Range|void, b: Range|void) {
        return (a === b || (a as Range).equals(b));
    }

    static withinRange(a: Range|void, b: Range|void) {
        return (a === b || (a as Range).withinRange(b));
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
        this.property = property instanceof PropertyWithURL ? (property as PropertyWithURL).asProperty() : property;
        this.values = values;
    }

    containsFacet(value: FacetValue): boolean {
        return this.values.some(e => value !== null && e.equalsOrWithinRange(value));
    }

    hasValueOrMWTitle(): boolean {
        return this.values.some((e) => e.value || e.mwTitle);
    }

    hasRange(): boolean {
        return this.values.some((e) => e.range);
    }

    getProperty() {
        return this.property;
    }

    static facetForAnyValue(p: Property) {
        return new PropertyFacet(p, []);
    }

    equals(that: PropertyFacet) {

        if (this.values.length !== that.values.length) {
            return false;
        }

        let valueSetIsEqual = this.values.every((e) => that.values.find((f) => f.equals(e)))
                    && that.values.every((e) => this.values.find((f) => f.equals(e)));

        return this.property.equals(that.property) && valueSetIsEqual;
    }

    equalsOrWithinRange(that: PropertyFacet) {

        if (this.values.length !== that.values.length) {
            return false;
        }

        let valueSetIsEqual = this.values.every((e) => that.values.find((f) => f.equalsOrWithinRange(e)))
            && that.values.every((e) => this.values.find((f) => f.equalsOrWithinRange(e)));

        return this.property.equals(that.property) && valueSetIsEqual;
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

    constructor(searchText: string,
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

    getRangeProperties(): Property[] {
        return this.propertyFacets
            .map((e) => e.property)
            .filter(p => p.isRangeProperty());
    }

    updateBaseQuery(base: BaseQuery): void {
        this.searchText = base.searchText;
        this.propertyFacets = Tools.deepClone(base.propertyFacets);
        this.categoryFacets = Tools.deepClone(base.categoryFacets);
        this.namespaceFacets = Tools.deepClone(base.namespaceFacets);
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

    constructor(searchText: string,
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
export class FacetsQuery extends BaseQuery {
    @jsonArrayMember(Property)
    rangeQueries: Property[]
    @jsonArrayMember(PropertyValueQuery)
    propertyValueQueries: PropertyValueQuery[]

    constructor(searchText: string,
                propertyFacets: PropertyFacet[],
                categoryFacets: string[],
                namespaceFacets: number[],
                rangeQueries: Property[],
                propertyValueQueries: PropertyValueQuery[]) {
        super(searchText, propertyFacets, categoryFacets, namespaceFacets);
        this.rangeQueries = rangeQueries;
        this.propertyValueQueries = propertyValueQueries;
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
    value: string | number | Date | null;
    @jsonMember(MWTitleWithURL)
    mwTitle: MWTitleWithURL | null;
    @jsonMember(Range)
    range: Range | null;
    @jsonMember(Number)
    count: number;

    compare(valueCount: ValueCount) {
        if (this.value && valueCount.value) {
            return this.value.toLocaleString().localeCompare(valueCount.value.toLocaleString());
        } else if (this.mwTitle && valueCount.mwTitle) {
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

    @jsonArrayMember(String, {deserializer: Tools.arrayDeserializer})
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

    getPropertyFacetCount(property: Property) {
        return Tools.findFirstByPredicate(this.propertyFacetCounts, p => p.property.title === property.title);
    }

    getPropertyFacetCountByItemId(itemId: string) {
        return Tools.findFirstByPredicate(this.propertyFacetCounts,
            (pfc) => pfc.property.getItemId() === itemId);
    }

}

