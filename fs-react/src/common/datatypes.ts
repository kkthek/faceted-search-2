/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */

import Tools from "../util/tools";

/**
 * Request types
 */

export class BaseQuery {
    searchText: string;
    categoryFacets: string[];
    namespaceFacets: number[];
    propertyFacets: PropertyFacet[];

}

export class BaseQueryClass extends BaseQuery{
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

}

export class StatQuery extends BaseQuery {
    statsProperties: Property[]
}

export class FacetsQuery extends BaseQuery {
    facetQueries: RangeQuery[]
    facetProperties: Property[]

}

export class PropertyFacet {
    property: string
    type: Datatype
    value: ValueType|void;
    mwTitle: MWTitle|void;
    range: Range|void


}
export class PropertyFacetClass extends PropertyFacet {
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

export class Range {
    from: string
    to: string
}

export class Property {
    title: string
    type: Datatype
}

export class MWTitle {
    title: string
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

export class MWTitleWithURL extends MWTitle {
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

export class SolrFacetResponse {
    valueCounts: PropertyValueCount[];

}

export class SolrFacetResponseClass extends SolrFacetResponse {
    getPropertyValueCount(property: Property): PropertyValueCount {
        return Tools.findFirst(this.valueCounts || [], (e) => e.property.title, property.title);
    }
}

export class PropertyWithURL extends Property {
    displayTitle: string;
    url: string
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

export class PropertyValueCount {
    property: PropertyWithURL;
    values: ValueCount[]

}

export class ValueCount {
    value: string|null;
    mwTitle: MWTitleWithURL|null;
    range: Range|null;
    count: number;

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

