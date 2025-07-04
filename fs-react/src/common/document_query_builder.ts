import {
    Datatype,
    DocumentQuery,
    DocumentsResponse,
    FacetValue,
    Order,
    Property,
    PropertyFacet,
    Sort
} from "./datatypes";
import Tools from "../util/tools";
import ConfigUtils from "../util/config_utils";
import {TypedJSON} from "typedjson";

class DocumentQueryBuilder {

    private query: DocumentQuery;

    constructor() {
        this.query = new DocumentQuery(
            "",
            [],
            [],
            [],
            [],
            [
                ConfigUtils.getSortByName('score'),
                ConfigUtils.getSortByName('ascending')
            ],

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

    withPropertyFacet(propertyFacetConstraint: PropertyFacet): DocumentQueryBuilder {
        this.query.propertyFacets.push(propertyFacetConstraint);
        return this;
    }

    clearFacetsForProperty(property: Property): DocumentQueryBuilder {
        Tools.removeAll(this.query.propertyFacets, (e) => e.property.title, property.title);
        return this;
    }

    withoutPropertyFacet(pf: PropertyFacet, facetValue: FacetValue = null) {
        if (facetValue === null) {
            Tools.removeFirstByPredicate(this.query.propertyFacets, (e) => e.equalsOrWithinRange(pf));
        } else {
            const f = Tools.findFirstByPredicate(this.query.propertyFacets, (e) => e.equalsOrWithinRange(pf));
            Tools.removeFirstByPredicate(f.values, (v) => v.equalsOrWithinRange(facetValue));
            if (f.values.length === 0) {
                this.withoutPropertyFacet(pf);
            }
        }
        return this;
    }

    existsPropertyFacetForProperty(p: Property): boolean {
        return Tools.findFirst(this.query.propertyFacets, (e) => e.property.title, p.title) !== null;
    }

    withCategoryFacet(category: string): DocumentQueryBuilder {
        if (category === '') {
            return this;
        }
        this.query.categoryFacets.push(category);
        return this;
    }

    withoutCategoryFacet(category: string): DocumentQueryBuilder {
        Tools.removeFirst(this.query.categoryFacets, (e) => e, category);
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