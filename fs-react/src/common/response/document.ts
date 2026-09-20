import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";
import {PropertyFacetValues} from "app/common/response/property_facet_values";
import {CategoryFacetValue} from "app/common/response/category_facet_value";
import {ElementWithURL, ValueType} from "app/common/datatypes";
import {NamespaceFacetValue} from "app/common/response/namespace_facet_value";


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

    containsFacetValue(property: string, value: ValueType): boolean {
        let propertyFacetValues = this.getPropertyFacetValues(property);
        if (propertyFacetValues === null) return false;
        if (value instanceof Date) {
            let values = propertyFacetValues.values as Date[];
            return values.findFirst((d: Date) => d.getTime() === (value as Date).getTime()) !== null;
        } else {
            let values = propertyFacetValues.values as ValueType[];
            return values.includes(value);
        }
    }

    getDisplayTitle(): string {
        return this.displayTitle;
    }

    getTitle(): string {
        return this.title;
    }

    getUrl(): string {
        return this.url;
    }
}