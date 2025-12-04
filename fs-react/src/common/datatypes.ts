/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";
import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import ValueDeserializer from "../util/value_deserializer";
import ObjectTools from "../util/object_tools";

export interface TextFilters {
    [title:string] : string;
}

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

    static forAllValues(property: Property, limit: number = null, offset: number = null) {
        return new PropertyValueQuery(property, limit, offset, null);
    }

    static forValuesContainingText(property: Property, text: string = null) {
        return new PropertyValueQuery(property, null, null, text);
    }
}

@jsonObject
export class Range {
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    from: Date | number
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
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

    toString(): string {
        return `${this.from}-${this.to}`;
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
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
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

    isEmpty() {
        return this.value === null && this.mwTitle === null && this.range === null;
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

    toString(): string {
        if (this.range) return this.range.toString();
        return this.mwTitle ? this.mwTitle.title : (this.value as string).toString();
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
        return new PropertyFacet(p, [new FacetValue(null, null,null)]);
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
        return this.propertyFacets.findFirst((e) => e.property.title === property.title);
    }

    isPropertyFacetSelected(property: Property): boolean {
        return this.findPropertyFacet(property) !== null;
    }

    isCategoryFacetSelected(category: string): boolean {
        return this.categoryFacets.findFirst((e: string) => e === category ) !== null;
    }

    isAnyCategorySelected() {
        return (this.categoryFacets || []).length > 0;
    }

    isAnyPropertySelected() {
        return (this.propertyFacets || []).length > 0;
    }

    isAnyFacetSelected() {
        return this.isAnyPropertySelected() || this.isAnyCategorySelected();
    }

    getRangeProperties(): Property[] {
        return this.propertyFacets
            .map((e) => e.property)
            .filter(p => p.isRangeProperty());
    }

    updateBaseQuery(base: BaseQuery): void {
        this.searchText = base.searchText;
        this.propertyFacets = ObjectTools.deepClone(base.propertyFacets);
        this.categoryFacets = ObjectTools.deepClone(base.categoryFacets);
        this.namespaceFacets = ObjectTools.deepClone(base.namespaceFacets);
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
export class ValueCount implements Sortable<ValueCount> {
    @jsonMember({deserializer: value => ValueDeserializer.deserializeValue(value)})
    value: string | number | Date | null;
    @jsonMember(MWTitleWithURL)
    mwTitle: MWTitleWithURL | null;
    @jsonMember(Range)
    range: Range | null;
    @jsonMember(Number)
    count: number;

    compareAlphabetically(that: ValueCount): number {
        if (this.value && that.value) {
            return this.value.toLocaleString().localeCompare(that.value.toLocaleString());
        } else if (this.mwTitle && that.mwTitle) {
            return this.mwTitle.displayTitle.toLocaleString().localeCompare(that.mwTitle.displayTitle.toLocaleString());
        }
        return 0;
    }
    compareByCount(that: ValueCount): number {
        return that.count - this.count;
    }

    compareToSelectedFirst(other: ValueCount, propertyFacet: PropertyFacet) {
        const facetValueA = FacetValue.fromValueCount(this);
        const facetValueB = FacetValue.fromValueCount(other);
        const containsA = propertyFacet.containsFacet(facetValueA);
        const containsB = propertyFacet.containsFacet(facetValueB);
        if (containsA === containsB) return 0;
        return containsA && !containsB ? -1 : 1;
    }

    serialize(): string {
        return this.mwTitle ? this.mwTitle.title : this.value.toString();
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
        if (!this.valueCounts ) { return null;}
        return this.valueCounts.findFirst((e) => e.property.title === property.title );
    }

    isEmpty() {
        return (this.valueCounts || []).length === 0;
    }
}


@jsonObject
export class PropertyFacetValues {
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL

    @jsonArrayMember(String, {deserializer: ValueDeserializer.arrayDeserializer})
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

export interface Sortable<T> {
    compareAlphabetically(that: T): number;
    compareByCount(that: T): number;
}

@jsonObject
export class CategoryFacetCount implements Sortable<CategoryFacetCount>{
    @jsonMember(String)
    category: string;
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(Number)
    count: number;

    compareAlphabetically(that: CategoryFacetCount): number {
        return this.category.toLowerCase().localeCompare(that.category.toLowerCase());
    }
    compareByCount(that: CategoryFacetCount): number {
        return that.count - this.count;
    }
}

@jsonObject
export class PropertyFacetCount implements Sortable<PropertyFacetCount>{
    @jsonMember(PropertyWithURL)
    property: PropertyWithURL;
    @jsonMember(Number)
    count: number;

    compareAlphabetically(that: PropertyFacetCount): number {
        return this.property.title.toLowerCase().localeCompare(that.property.title.toLowerCase());
    }
    compareByCount(that: PropertyFacetCount): number {
        return that.count - this.count;
    }
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
        return this.propertyFacets.findFirst((p) => p.property.title === property);
    }

    getCategoryFacetValue(category: string) {
        return this.categoryFacets.findFirst((c: CategoryFacetValue) => c.category === category);
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
        return this.namespaceFacetCounts.findFirst( (e: NamespaceFacetCount) => e.namespace.toString() === ns.toString(), ) != null;
    }

    getPropertyFacetCount(property: Property) {
        return this.propertyFacetCounts.findFirst((p: PropertyFacetCount) => p.property.title === property.title);
    }

    getPropertyFacetCountByItemId(itemId: string) {
        return this.propertyFacetCounts.findFirst(
            (pfc: PropertyFacetCount) => pfc.property.getItemId() === itemId);
    }

}

@jsonObject
export class CategoryNode {
    @jsonMember(String)
    category: string;

    @jsonMember(String)
    displayTitle: string | null;

    @jsonArrayMember(() => CategoryNode)
    children: CategoryNode[];

    parent: CategoryNode | null;

    constructor(category: string, children: CategoryNode[], displayTitle: string = null) {
        this.category = category;
        this.children = children;
        this.displayTitle = displayTitle;
    }

    createParentReferences(node: CategoryNode|null = null): CategoryNode {
        if (node === null) node = this;
        node.children.forEach(child => {
            child.parent = node;
            this.createParentReferences(child);
        });
        return node;
    }

    contains(text: string) {
        const parts = text.split(/\s+/);
        return parts.every(part => this.category.toLowerCase().includes(part.toLowerCase())
        || (this.displayTitle && this.displayTitle.toLowerCase().includes(part.toLowerCase())));
    }

    filterForText(text: string) {
        if (text.trim() === '') return this;
        const allMatchingNodes = this.filterNodes_((c)=> c.contains(text), this);
        if (allMatchingNodes.length === 0) return new CategoryNode("__ROOT__", []);
        const allCategoriesOnPath = this.getCategoriesOnPathToRoot(allMatchingNodes);
        return this.copyTree_((c)=> allCategoriesOnPath.includes(c.category), this)
            .createParentReferences();
    }

    filterForCategories(categories: string[]): CategoryNode {
        if (categories.length === 0) return this;
        const allMatchingNodes = this.filterNodes_((c)=> categories.includes(c.category), this);
        if (allMatchingNodes.length === 0) return new CategoryNode("__ROOT__", []);
        const allCategoriesOnPath = this.getCategoriesOnPathToRoot(allMatchingNodes);
        return this.copyTree_((c)=> allCategoriesOnPath.includes(c.category), this)
            .createParentReferences();
    }

    getNodeItemIds(node: CategoryNode = this): string[] {
        const found = node.children.map(child => child.category + child.parent?.category)
            .concat(node.parent ? node.category+ node.parent.category : node.category);
        node.children.forEach(node => found.push(...this.getNodeItemIds(node)));
        return found;
    }

    private getCategoriesOnPathToRoot(allMatchingNodes: CategoryNode[]) {
        const allCategoriesOnPath: any = {};
        allMatchingNodes.forEach(node => {
            do {
                allCategoriesOnPath[node.category] = true;
                node = node.parent;
            } while (node !== undefined)
        });
        return Object.keys(allCategoriesOnPath);
    }

    private copyTree_(predicate: (node: CategoryNode) => boolean, node: CategoryNode): CategoryNode {
        if (!predicate(node)) return null;
        const newNode = new CategoryNode(node.category, [], node.displayTitle);
        node.children
            .filter(child => predicate(child))
            .forEach(child => {
                const c = this.copyTree_(predicate, child);
                if (c !== null) {
                    newNode.children.push(c);
                }
        });
        return newNode;
    }

    private filterNodes_(predicate:(child: CategoryNode) => boolean, node: CategoryNode) {
        const found = node.children.filter(child => predicate(child));
        node.children.forEach(node => found.push(...this.filterNodes_(predicate, node)));
        return found;
    }
}
