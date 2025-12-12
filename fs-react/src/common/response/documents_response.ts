import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {Document} from "./document";
import {CategoryFacetCount} from "./category_facet_count";
import {PropertyFacetCount} from "./property_facet_count";
import {NamespaceFacetCount} from "./namespace_facet_count";
import {Property} from "../property";

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
        return this.namespaceFacetCounts.findFirst((e: NamespaceFacetCount) => e.namespace.toString() === ns.toString(),) != null;
    }

    getPropertyFacetCount(property: Property) {
        return this.propertyFacetCounts.findFirst((p: PropertyFacetCount) => p.property.title === property.title);
    }

    getPropertyFacetCountByItemId(itemId: string) {
        return this.propertyFacetCounts.findFirst(
            (pfc: PropertyFacetCount) => pfc.property.getItemId() === itemId);
    }

}