import DocumentQueryBuilder from "./document_query_builder";
import FacetQueryBuilder from "./facet_query_builder";
import {
    BaseQuery,
    DocumentsResponse,
    FacetResponse,
    FacetValue,
    Property,
    PropertyFacet,
    PropertyValueQuery,
    Sort
} from "./datatypes";
import Client from "./client";
import {Dispatch, SetStateAction} from "react";
import {WikiContextInterface} from "./wiki_context";

export interface SearchStateDocument {
    documentResponse: DocumentsResponse;
    query: BaseQuery
}

export interface SearchStateFacet {
    facetsResponse: FacetResponse;
    query: BaseQuery
}


class EventHandler {

    private readonly currentDocumentsQueryBuilder: DocumentQueryBuilder;
    private readonly currentFacetsQueryBuilder: FacetQueryBuilder;
    private readonly client: Client;
    private readonly setSearchState: Dispatch<SetStateAction<SearchStateDocument>>;
    private readonly setFacetState: Dispatch<SetStateAction<SearchStateFacet>>;
    private readonly setExpandedFacets: Dispatch<SetStateAction<string[]>>;
    private readonly setError: Dispatch<SetStateAction<string>>;
    private readonly facetValueLimit: number;
    private expandedFacets: string[];

    constructor(currentDocumentsQueryBuilder: DocumentQueryBuilder,
                currentFacetsQueryBuilder: FacetQueryBuilder,
                setDocumentState: Dispatch<SetStateAction<SearchStateDocument>>,
                setFacetState: Dispatch<SetStateAction<SearchStateFacet>>,
                setExpandedFacets: Dispatch<SetStateAction<string[]>>,
                setError: Dispatch<SetStateAction<string>>,
                wikiContext: WikiContextInterface,
                client: Client) {
        this.currentDocumentsQueryBuilder = currentDocumentsQueryBuilder;
        this.currentFacetsQueryBuilder = currentFacetsQueryBuilder;
        this.client = client;
        this.setSearchState = setDocumentState;
        this.setFacetState = setFacetState;
        this.setError = setError;
        this.facetValueLimit = wikiContext.config.fs2gFacetValueLimit;

        this.expandedFacets = [];
        this.setExpandedFacets = setExpandedFacets;

        this.createClosuresForEventHandlers();
    }

    private createClosuresForEventHandlers() {
        let objPrototype = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(objPrototype).forEach((p) => {
            if (typeof objPrototype[p] === 'function' && p.startsWith('on')) {
                objPrototype[p] = objPrototype[p].bind(this);
            }
        })

    }


    onSearchClick(text: string) {
        this.currentDocumentsQueryBuilder
            .withSearchText(text)
            .withOffset(0);

        this.updateDocuments();
        this.updateFacets();
    }

    onSortChange(sort: Sort) {
        this.currentDocumentsQueryBuilder
            .clearSorts()
            .withSort(sort)
            .withOffset(0);

        this.updateDocuments();
    }

    onPropertyClick(p: Property) {
        this.currentDocumentsQueryBuilder
            .withPropertyFacet(PropertyFacet.facetForAnyValue(p))
            .withOffset(0);

        this.expandFacet(p.getItemId());
        this.updateDocuments();
        this.updateFacetValuesForProperty(p);
    }

    onExpandFacetClick(p: Property) {
        this.expandFacet(p.getItemId());
        this.updateFacetValuesForProperty(p, this.facetValueLimit);
    }

    onExpandSelectedFacetClick(itemId: string) {
        this.expandFacet(itemId);
    }

    onCollapseFacetClick(itemId: string) {
        this.expandedFacets = this.expandedFacets.filter(id => id !== itemId)
        this.setExpandedFacets(this.expandedFacets);
    }

    private expandFacet(itemId: string) {
        this.expandedFacets = [...this.expandedFacets, itemId];
        this.setExpandedFacets(this.expandedFacets);
    }


    onValueClick(propertyFacet: PropertyFacet) {
        let property = propertyFacet.getProperty();
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property)
            .withPropertyFacet(propertyFacet);

        this.expandFacet(property.getItemId());
        this.updateDocuments();
        this.updateFacetValuesForProperty(property);
    }

    onValuesClick(propertyFacets: PropertyFacet[]) {

        propertyFacets.forEach((pf) => {
            this.currentDocumentsQueryBuilder
                .withOffset(0)
                .clearFacetsForProperty(pf.property)
                .withPropertyFacet(pf);
        });

        this.updateDocuments();

        let properties = propertyFacets.map(pf => pf.getProperty());
        properties.forEach(property => {
            this.expandFacet(property.getItemId());
        });
        this.updateFacetValuesForProperties(properties);
    }

    onRemoveAllFacetsForProperty(property: Property) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property);

        this.currentFacetsQueryBuilder
            .clearRangeQueriesForProperty(property)
            .clearPropertyValueQueryForProperty(property);

        this.expandFacet(property.getItemId());
        this.updateDocuments();
        this.updateFacetValuesForProperty(property);
    }

    onRemovePropertyFacet(propertyFacet: PropertyFacet, facetValue: FacetValue = null) {

        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutPropertyFacet(propertyFacet, facetValue);

        let property = propertyFacet.getProperty();
        let existsFacets = this.currentDocumentsQueryBuilder.existsPropertyFacetForProperty(property);
        if (!existsFacets) {
            this.currentFacetsQueryBuilder
                .clearRangeQueriesForProperty(property)
                .clearPropertyValueQueryForProperty(property);
        }

        this.updateDocuments();
        this.updateFacetValuesForProperty(property, existsFacets ? null : this.facetValueLimit);
    }

    onFacetValueContains(text: string, property: Property) {

        if (property.isRangeProperty()) {
            return;
        }

        let propertyValueConstraint = new PropertyValueQuery(
            property,
            text === '' ? this.facetValueLimit : null,
            null,
            text === '' ? null : text);
        if (this.currentFacetsQueryBuilder.existsPropertyValueQuery(propertyValueConstraint)) {
            return;
        }

        this.currentFacetsQueryBuilder.withPropertyValueQuery(propertyValueConstraint);
        this.updateFacets();
    }

    onShowAllValues(property: Property) {
        if (property.isRangeProperty()) {
            return;
        }

        let propertyValueQuery = PropertyValueQuery.forAllValues(property);
        if (this.currentFacetsQueryBuilder.existsPropertyValueQuery(propertyValueQuery)) {
            return;
        }

        this.currentFacetsQueryBuilder.withPropertyValueQuery(propertyValueQuery);
        this.updateFacets();
    }

    onNamespaceClick(namespaces: number[]) {
        this.currentDocumentsQueryBuilder
            .withNamespaceFacets(namespaces)
            .withOffset(0);

        this.updateDocuments();
        this.updateFacets();
    }

    onCategoryClick(category: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withCategoryFacet(category);

        this.updateDocuments();
        this.updateFacets();
    }

    onCategoryDropDownClick(category: string) {
        this.currentDocumentsQueryBuilder
            .clearCategoryFacets();
        this.onCategoryClick(category);
    }

    onCategoryRemoveClick(category: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutCategoryFacet(category);

        this.updateDocuments();
        this.updateFacets();
    }

    onPageIndexClick(pageIndex: number, limit: number) {
        this.currentDocumentsQueryBuilder
            .withOffset((pageIndex - 1) * limit);

        this.updateDocuments();
    }

    onRemoveAllFacetsClick() {
        this.currentDocumentsQueryBuilder.clearAllFacets();
        this.currentFacetsQueryBuilder
            .clearAllRangeQueries()
            .clearAllPropertyValueQueries();
        this.setExpandedFacets([]);
        this.updateDocuments();
        this.updateFacets();
    }

    private updateFacetValuesForProperties(properties: Property[], facetValueLimit: number = null) {

        properties
            .filter(p => !p.isRangeProperty())
            .forEach(property => {

                this.currentFacetsQueryBuilder.withPropertyValueQuery(
                    new PropertyValueQuery(
                        property,
                        facetValueLimit,
                        null,
                        null));


            })

        properties
            .filter(p => p.isRangeProperty())
            .forEach(p => {
                this.currentFacetsQueryBuilder.clearRangeQueriesForProperty(p);
                this.currentFacetsQueryBuilder.withRangeQuery(p);
            });

        this.updateFacets();

    }

    private updateFacetValuesForProperty(property: Property, facetValueLimit: number = null) {
        this.updateFacetValuesForProperties([property], facetValueLimit);
    }

    public updateDocuments() {
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => {
            if (e.name === 'AbortError') return;
            console.error("Request to backend failed");
            console.error(e);
            this.setError(e.message);
        });
    }

    public updateFacets() {
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder.build());
        this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
            this.setFacetState({
                facetsResponse: response,
                query: this.currentFacetsQueryBuilder.build()
            });
        }).catch((e) => {
            if (e.name === 'AbortError') return;
            console.error("Request to backend failed");
            console.error(e);
            this.setError(e.message);
        });
    }

}

export default EventHandler;