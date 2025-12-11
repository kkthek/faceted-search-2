import {DocumentQuery, FacetValue, Property, PropertyFacet, Sort} from "./datatypes";
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
        const pf = this.query.propertyFacets.findFirst((e: PropertyFacet) => e.property.title === propertyFacetConstraint.property.title);
        if (pf === null) {
            this.query.propertyFacets.push(propertyFacetConstraint);
        } else {
            propertyFacetConstraint.values.forEach(vNew => {
                if (!pf.values.some(vOld => vOld.equals(vNew))) {
                    pf.values.push(vNew);
                }
            });

        }
        return this;
    }

    clearFacetsForProperty(property: Property): DocumentQueryBuilder {
        this.query.propertyFacets.removeAll((e: PropertyFacet) => e.property.title === property.title);
        return this;
    }

    withoutPropertyFacet(pf: PropertyFacet, facetValue: FacetValue = null) {
        if (facetValue === null) {
            this.query.propertyFacets.removeFirst( (e: PropertyFacet) => e.property.equals(pf.property));
        } else {
            const f = this.query.propertyFacets.findFirst((e: PropertyFacet) => e.property.equals(pf.property));
            f.values.removeFirst((v: FacetValue) => v.equals(facetValue));
            if (f.values.length === 0) {
                this.withoutPropertyFacet(pf);
            }
        }
        return this;
    }

    existsPropertyFacetForProperty(p: Property): boolean {
        return this.query.propertyFacets.findFirst( (e: PropertyFacet) => e.property.title === p.title) !== null;
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