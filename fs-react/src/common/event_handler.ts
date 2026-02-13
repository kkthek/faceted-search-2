import DocumentQueryBuilder from "./query_builders/document_query_builder";
import FacetQueryBuilder from "./query_builders/facet_query_builder";
import {TextFilters} from "./datatypes";
import Client from "./client";
import {Dispatch, SetStateAction} from "react";
import {WikiContextAccessor} from "./wiki_context";
import {Property} from "./property";
import {PropertyValueQuery} from "./request/property_value_query";
import {FacetValue} from "./request/facet_value";
import {PropertyFacet} from "./request/property_facet";
import {Sort} from "./request/sort";
import {BaseQuery} from "./request/base_query";
import {FacetResponse} from "./response/facet_response";
import {DocumentsResponse} from "./response/documents_response";
import QueryUtils from "../util/query_utils";

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
    private readonly setTextFiltersState: Dispatch<SetStateAction<TextFilters>>;
    private readonly setLoadPromise: Dispatch<SetStateAction<Promise<any>>>;
    private readonly wikiContext: WikiContextAccessor;
    private expandedFacets: string[];

    constructor(currentDocumentsQueryBuilder: DocumentQueryBuilder,
                currentFacetsQueryBuilder: FacetQueryBuilder,
                setDocumentState: Dispatch<SetStateAction<SearchStateDocument>>,
                setFacetState: Dispatch<SetStateAction<SearchStateFacet>>,
                setExpandedFacets: Dispatch<SetStateAction<string[]>>,
                setError: Dispatch<SetStateAction<string>>,
                setTextFilters: Dispatch<SetStateAction<TextFilters>>,
                setLoadPromise: Dispatch<SetStateAction<Promise<any>>>,
                wikiContext: WikiContextAccessor,
                client: Client) {
        this.currentDocumentsQueryBuilder = currentDocumentsQueryBuilder;
        this.currentFacetsQueryBuilder = currentFacetsQueryBuilder;
        this.client = client;
        this.setSearchState = setDocumentState;
        this.setFacetState = setFacetState;
        this.setError = setError;
        this.setTextFiltersState = setTextFilters;
        this.setLoadPromise = setLoadPromise;
        this.wikiContext = wikiContext;

        this.expandedFacets = [];
        this.setExpandedFacets = setExpandedFacets;

        this.createClosuresForEventHandlers();
    }

    setTextFilters(filter: TextFilters): void {
        this.setTextFiltersState(filter);
    }

    private resetTextFilters(): void {
        this.setTextFiltersState({});
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

        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacets()
        ]));
    }

    onSortChange(sort: Sort) {
        this.currentDocumentsQueryBuilder
            .clearSorts()
            .withSort(sort)
            .withOffset(0);

        this.setLoadPromise(this.updateDocuments());
    }

    onPropertyClick(p: Property) {
        this.currentDocumentsQueryBuilder
            .withPropertyFacet(PropertyFacet.facetForAnyValue(p))
            .withOffset(0);

        this.expandFacet(p.getItemId());
        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacetValuesForProperty(p, this.wikiContext.config.fs2gFacetValueLimit)
        ]));
    }

    onExpandFacetClick(p: Property) {
        this.expandFacet(p.getItemId());
        this.setLoadPromise(this.updateFacetValuesForProperty(p, this.wikiContext.config.fs2gFacetValueLimit));
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
            .withPropertyFacet(propertyFacet);

        this.expandFacet(property.getItemId());
        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacetValuesForProperty(property, this.wikiContext.config.fs2gFacetValueLimit)
        ]));
    }

    onValuesClick(propertyFacets: PropertyFacet[], removeOld: boolean = true) {

        propertyFacets.forEach((pf) => {
            if (removeOld) {
                this.currentDocumentsQueryBuilder.withoutPropertyFacet(pf);
            }
            this.currentDocumentsQueryBuilder
                .withOffset(0)
                .withPropertyFacet(pf);
        });


        let properties = propertyFacets.map(pf => pf.getProperty());
        properties.forEach(property => {
            this.expandFacet(property.getItemId());
        });
        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacetValuesForProperties(properties, this.wikiContext.config.fs2gFacetValueLimit)
        ]));
    }

    onRemoveAllFacetsForProperty(property: Property) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property);

        this.currentFacetsQueryBuilder
            .clearRangeQueriesForProperty(property)
            .clearPropertyValueQueryForProperty(property);

        this.expandFacet(property.getItemId());
        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacetValuesForProperty(property, this.wikiContext.config.fs2gFacetValueLimit)
        ]));

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

        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacetValuesForProperty(property, this.wikiContext.config.fs2gFacetValueLimit)
        ]));
    }

    onFacetValueContains(text: string, property: Property) {

        if (property.isRangeProperty()) {
            return;
        }

        let propertyValueConstraint = new PropertyValueQuery(
            property,
            this.wikiContext.config.fs2gFacetValueLimit,
            null,
            text === '' ? null : text);
        if (this.currentFacetsQueryBuilder.existsPropertyValueQuery(propertyValueConstraint)) {
            return;
        }

        this.currentFacetsQueryBuilder.withPropertyValueQuery(propertyValueConstraint);
        this.setLoadPromise(this.updateFacets());
    }

    onShowAllValues(property: Property, filterText: string) {
        if (property.isRangeProperty()) {
            return;
        }

        let propertyValueQuery = PropertyValueQuery.forValuesContainingText(property, filterText);
        if (this.currentFacetsQueryBuilder.existsPropertyValueQuery(propertyValueQuery)) {
            return;
        }

        this.currentFacetsQueryBuilder.withPropertyValueQuery(propertyValueQuery);
        this.setLoadPromise(this.updateFacets());
    }

    onNamespaceClick(namespaces: number[]) {
        this.currentDocumentsQueryBuilder
            .withNamespaceFacets(namespaces)
            .withOffset(0);

        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacets()
        ]));
    }

    onCategoryClick(category: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withCategoryFacet(category);

        this.resetTextFilters();
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacets()
        ]));
    }

    onCategoryDropDownClick(category: string) {
        this.currentDocumentsQueryBuilder
            .clearCategoryFacets();
        return this.onCategoryClick(category);
    }

    onCategoryRemoveClick(category: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutCategoryFacet(category);

        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacets()
        ]));
    }

    onPageIndexClick(pageIndex: number, limit: number) {
        this.currentDocumentsQueryBuilder
            .withOffset((pageIndex - 1) * limit);

        this.setLoadPromise(this.updateDocuments());
    }

    onRemoveAllFacetsClick() {
        this.currentDocumentsQueryBuilder.clearAllFacets();
        this.currentFacetsQueryBuilder
            .clearAllRangeQueries()
            .clearAllPropertyValueQueries()
            .withPropertyValueQuery(QueryUtils.prepareTagCloudValueQuery(this.wikiContext));

        this.setExpandedFacets([]);
        this.setLoadPromise(Promise.all([
            this.updateDocuments(),
            this.updateFacets()
        ]));
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

        return this.updateFacets();

    }

    private updateFacetValuesForProperty(property: Property, facetValueLimit: number = null) {
        return this.updateFacetValuesForProperties([property], facetValueLimit);
    }

    private updateDocuments() {
        return this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
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

    private updateFacets() {
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder.build());
        return this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
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