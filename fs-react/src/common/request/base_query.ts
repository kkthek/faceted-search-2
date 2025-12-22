import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {PropertyFacet} from "./property_facet";
import {Property} from "../property";
import ObjectTools from "../../util/object_tools";

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
        return this.categoryFacets.findFirst((e: string) => e === category) !== null;
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