import DocumentQueryBuilder from "./document_query_builder";
import FacetQueryBuilder from "./facet_query_builder";
import {
    BaseQuery,
    DocumentsResponse,
    FacetResponse,
    Property,
    PropertyFacet,
    PropertyValueConstraint,
    RangeQuery,
    Sort
} from "./datatypes";
import StatQueryBuilder from "./stat_query_builder";
import Client from "./client";
import {Dispatch, SetStateAction} from "react";

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
    private readonly setError: Dispatch<SetStateAction<string>>;

    constructor(currentDocumentsQueryBuilder: DocumentQueryBuilder,
                currentFacetsQueryBuilder: FacetQueryBuilder,
                setDocumentState: Dispatch<SetStateAction<SearchStateDocument>>,
                setFacetState: Dispatch<SetStateAction<SearchStateFacet>>,
                setError: Dispatch<SetStateAction<string>>,
                client: Client) {
        this.currentDocumentsQueryBuilder = currentDocumentsQueryBuilder;
        this.currentFacetsQueryBuilder = currentFacetsQueryBuilder;
        this.client = client;
        this.setSearchState = setDocumentState;
        this.setFacetState = setFacetState;
        this.setError = setError;

        this.onSearchClick = this.onSearchClick.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onPropertyClick = this.onPropertyClick.bind(this);
        this.onValueClick = this.onValueClick.bind(this);
        this.onValuesClick = this.onValuesClick.bind(this);
        this.onRemovePropertyFacet = this.onRemovePropertyFacet.bind(this);
        this.onFacetValueContains = this.onFacetValueContains.bind(this);
        this.onNamespaceClick = this.onNamespaceClick.bind(this);
        this.onCategoryClick = this.onCategoryClick.bind(this);
        this.onCategoryDropDownClick = this.onCategoryDropDownClick.bind(this);
        this.onCategoryRemoveClick = this.onCategoryRemoveClick.bind(this);
        this.onPageIndexClick = this.onPageIndexClick.bind(this);
        this.onRemoveAllFacetsClick = this.onRemoveAllFacetsClick.bind(this);
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

        this.updateDocuments();
        this.updateFacetValuesForProperties(p);
    }

    onExpandClick(p: Property, limit: number) {
        this.updateFacetValuesForProperties(p, limit);
    }

    onValueClick(propertyFacet: PropertyFacet) {
        let property = propertyFacet.getProperty();
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property)
            .withPropertyFacet(propertyFacet);

        this.updateDocuments();
        this.updateFacetValuesForProperties(property);
    }

    onValuesClick(propertyFacets: PropertyFacet[], property: Property) {

        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property);

        propertyFacets.forEach((pf) => this.currentDocumentsQueryBuilder.withPropertyFacet(pf));

        this.updateDocuments();
        this.updateFacetValuesForProperties(property);
    }

    onRemovePropertyFacet(propertyFacet: PropertyFacet) {

        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutPropertyFacet(propertyFacet);

        let property = propertyFacet.getProperty();
        if (!this.currentDocumentsQueryBuilder.existsPropertyFacetForProperty(property)) {
            this.currentFacetsQueryBuilder
            .clearFacetsQueriesForProperty(property);
        }

        this.updateDocuments();
        this.updateFacetValuesForProperties(property);
    }

    onFacetValueContains(text: string, limit: number, property: Property) {

        this.currentFacetsQueryBuilder.withPropertyValueConstraint(
            new PropertyValueConstraint(
                property,
                text === '' ? limit : null,
                null,
                text === '' ? null : text)
        );

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
            .withOffset(0)
            .clearCategoryFacets()
            .withCategoryFacet(category);

        this.updateDocuments();
        this.updateFacets();
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
            .withOffset((pageIndex-1) * limit);

        this.updateDocuments();
    }

    onRemoveAllFacetsClick() {
        this.currentDocumentsQueryBuilder.clearAllFacets();

        this.updateDocuments();
        this.updateFacets();
    }

    private updateFacetValuesForProperties(property: Property, limit: number = null) {

        if (!property.isRangeProperty()) {
            this.currentFacetsQueryBuilder.withPropertyValueConstraint(
                new PropertyValueConstraint(
                    property,
                    limit,
                    null,
                    null));

        }

        const rangeProperties = this.currentFacetsQueryBuilder.build().getRangeProperties();
        this.requestRanges(property.isRangeProperty() ? [property, ...rangeProperties] : rangeProperties)
            .then(() => this.updateFacets())
            .catch((e) => {
                console.error("Requesting new ranges failed");
                console.error(e);
                this.setError(e.message);
            });

    }

    private async requestRanges(properties: Property[]) {

        if (properties.length === 0) {
            return;
        }

        const sqb = new StatQueryBuilder();
        sqb.updateBaseQuery(this.currentDocumentsQueryBuilder.build());
        properties.forEach((p) => sqb.withStatField(p));

        let response = await this.client.searchStats(sqb.build());
        response.stats.forEach((stat) => {

            this.currentFacetsQueryBuilder.clearFacetsQueriesForProperty(stat.property);
            stat.clusters.forEach((range) => {
                this.currentFacetsQueryBuilder.withFacetQuery(new RangeQuery(stat.property, range));
            });
        });

    }

    private updateDocuments() {
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => {
            console.error("Request to backend failed");
            console.error(e);
            this.setError(e.message);
        });
    }

    private updateFacets() {
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder.build());
        this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
            this.setFacetState({
                facetsResponse: response,
                query: this.currentFacetsQueryBuilder.build()
            });
        }).catch((e) => {
            console.error("Request to backend failed");
            console.error(e);
            this.setError(e.message);
        });
    }

}

export default EventHandler;