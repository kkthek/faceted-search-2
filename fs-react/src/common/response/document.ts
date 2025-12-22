import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {PropertyFacetValues} from "./property_facet_values";
import {CategoryFacetValue} from "./category_facet_value";
import {NamespaceFacetValue} from "./namespace_facet_value";
import {ElementWithURL} from "../datatypes";

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