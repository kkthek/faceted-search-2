import {TypedJSON} from "typedjson";
import {Property} from "../property";
import {FacetValue} from "../request/facet_value";
import {PropertyFacet} from "../request/property_facet";
import {Sort} from "../request/sort";
import {DocumentQuery} from "../request/document_query";

class DocumentQueryBuilder {

    private query: DocumentQuery;

    constructor() {
        this.query = new DocumentQuery(
            "",
            [],
            [],
            [],
            [],
            [],

            10,
            0
        );
    }

    clearAllFacets() {
        this.query.categoryFacets = [];
        this.query.propertyFacets = [];
        this.query.namespaceFacets = [];
        return this;
    }

    withQueryFromJson(json: string) {
        const deserializer = new TypedJSON(DocumentQuery);
        this.query = deserializer.parse(json);
        this.query.extraProperties = this.query.extraProperties ?? [];
        return this;
    }

    withSearchText(text: string): DocumentQueryBuilder {
        this.query.searchText = text;
        return this;
    }

    withPropertyFacet(facet: PropertyFacet): DocumentQueryBuilder {
        const existingFacet = this.query.findPropertyFacet(facet.property);
        if (existingFacet === null) {
            this.query.propertyFacets.push(facet);
        } else {
            existingFacet.addValuesFromFacet(facet);
        }
        return this;
    }

    clearFacetsForProperty(property: Property): DocumentQueryBuilder {
        this.query.removePropertyFacet(property);
        return this;
    }

    withoutPropertyFacet(pf: PropertyFacet, facetValue: FacetValue = null) {
        if (facetValue === null) {
            this.query.removePropertyFacet(pf.property);
        } else {
            const existingFacet = this.query.findPropertyFacet(pf.property);
            existingFacet.removeValue(facetValue);
            if (existingFacet.hasNoValues()) {
                this.query.removePropertyFacet(pf.property);
            }
        }
        return this;
    }

    existsPropertyFacetForProperty(p: Property): boolean {
        return this.query.findPropertyFacet(p) !== null;
    }

    withCategoryFacet(category: string): DocumentQueryBuilder {
        if (category === '') {
            return this;
        }
        this.query.categoryFacets.push(category);
        return this;
    }

    withoutCategoryFacet(category: string): DocumentQueryBuilder {
        this.query.categoryFacets.removeFirst((e: string) => e === category);
        return this;
    }

    clearCategoryFacets(): DocumentQueryBuilder {
        this.query.categoryFacets = [];
        return this;
    }

    withNamespaceFacets(namespaces: number[]): DocumentQueryBuilder {
        this.query.namespaceFacets = namespaces;
        return this;
    }

    withExtraProperty(property: Property): DocumentQueryBuilder {
        this.query.extraProperties.push(property);
        return this;
    }

    clearSorts(): DocumentQueryBuilder {
        this.query.sorts = [];
        return this;
    }

    withSort(sort: Sort): DocumentQueryBuilder {
        this.query.sorts.push(sort);
        return this;
    }

    withLimit(limit: number): DocumentQueryBuilder {
        this.query.limit = limit;
        return this;
    }
    
    withOffset(offset: number): DocumentQueryBuilder {
        this.query.offset = offset;
        return this;
    }

    build(): DocumentQuery {
        return this.query;
    }


}

export default DocumentQueryBuilder;