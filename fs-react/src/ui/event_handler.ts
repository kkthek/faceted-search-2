import DocumentQueryBuilder from "../common/document_query_builder";
import FacetQueryBuilder from "../common/facet_query_builder";
import {
    BaseQuery,
    Property,
    PropertyFacet,
    PropertyValueConstraint,
    DocumentsResponse,
    FacetResponse,
    Sort
} from "../common/datatypes";
import StatQueryBuilder from "../common/stat_query_builder";
import Client from "../common/client";
import Tools from "../util/tools";

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
    private readonly setSearchState: React.Dispatch<React.SetStateAction<SearchStateDocument>>;
    private readonly setFacetState: React.Dispatch<React.SetStateAction<SearchStateFacet>>;
    private readonly setError: React.Dispatch<React.SetStateAction<string>>;

    constructor(currentDocumentsQueryBuilder: DocumentQueryBuilder,
                currentFacetsQueryBuilder: FacetQueryBuilder,
                setDocumentState: React.Dispatch<React.SetStateAction<SearchStateDocument>>,
                setFacetState: React.Dispatch<React.SetStateAction<SearchStateFacet>>,
                setError: React.Dispatch<React.SetStateAction<string>>,
                client: Client) {
        this.currentDocumentsQueryBuilder = currentDocumentsQueryBuilder;
        this.currentFacetsQueryBuilder = currentFacetsQueryBuilder;
        this.client = client;
        this.setSearchState = setDocumentState;
        this.setFacetState = setFacetState;
        this.setError = setError;
    }

    onSearchClick(text: string) {
        this.currentDocumentsQueryBuilder
            .withSearchText(text)
            .withOffset(0);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onSortChange(sort: Sort) {
        this.currentDocumentsQueryBuilder
            .clearSorts()
            .withSort(sort);

        this.updateDocuments();
    }

    onPropertyClick(p: Property) {
        let propertyFacet = new PropertyFacet(p.title, p.type, null, null, null);
        this.currentDocumentsQueryBuilder
            .withPropertyFacet(propertyFacet)
            .withOffset(0);
        this.updateDocuments();
        this.updateFacetValuesForProperties([p]);
    }

    onExpandClick(p: Property, limit: number) {
        this.updateFacetValuesForProperties([p], limit);
    }

    onValueClick(p: PropertyFacet) {
        let property = new Property(p.property, p.type);
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property)
            .withPropertyFacet(p);
        this.updateDocuments();
        this.updateFacetValuesForProperties([property]);

    }

    onValuesClick(propertyFacets: PropertyFacet[], property: Property) {

        this.currentDocumentsQueryBuilder
            .withOffset(0);

        this.currentDocumentsQueryBuilder
            .clearFacetsForProperty(property);
        propertyFacets.forEach((p) => {
            this.currentDocumentsQueryBuilder.withPropertyFacet(p);
        });

        this.updateDocuments();
        this.updateFacetValuesForProperties([property]);

    }

    onRemovePropertyFacet(p: PropertyFacet) {

        let property = new Property(p.property, p.type);
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutPropertyFacet(p);

        if (!this.currentDocumentsQueryBuilder.existsPropertyFacetForProperty(property)) {
            this.currentFacetsQueryBuilder
            .clearFacetsQueriesForProperty(property);
        }
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);

        this.updateDocuments();
        const rangeProperties = this.currentFacetsQueryBuilder.build().getRangeProperties();
        if (rangeProperties.length === 0) {
            this.updateFacets();
        } else {
            this.updateRanges(rangeProperties);
        }
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
            .toggleNamespacesFacet(namespaces)
            .withOffset(0);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onCategoryClick(category: string) {
        if (category === '') {
            this.currentDocumentsQueryBuilder
                .withOffset(0)
                .clearCategoryFacets();
        } else {
            this.currentDocumentsQueryBuilder
                .withOffset(0)
                .withCategoryFacet(category);
        }
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onCategoryRemoveClick(category: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutCategoryFacet(category);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onPageIndexClick(pageIndex: number, limit: number) {
        this.currentDocumentsQueryBuilder
            .withOffset(pageIndex * limit);
        this.updateDocuments();
    }

    private updateFacetValuesForProperties(properties: Property[], limit: number = null) {

        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);

        properties.forEach((p) => {
            if (p.isRangeProperty()) {
                this.updateRanges([p]);
            } else {
                this.currentFacetsQueryBuilder.withPropertyValueConstraint(
                    new PropertyValueConstraint(
                        p,
                        limit,
                        null,
                        null));

            }
        });
        this.updateFacets();
    }

    private async requestRangesAndUpdateFacets(properties: Property[]) {

        const sqb = new StatQueryBuilder();
        sqb.updateBaseQuery(this.currentDocumentsQueryBuilder);
        properties.forEach((p) => {
            sqb.withStatField(p);
        })
        let response = await this.client.searchStats(sqb.build());
        response.stats.forEach((stat) => {
            const p = stat.property;
            this.currentFacetsQueryBuilder.clearFacetsQueriesForProperty(p);
            stat.clusters.forEach((r) => {
                this.currentFacetsQueryBuilder.withFacetQuery({property: p.title, type: p.type, range: r})
            });
        });
        this.updateFacets();

    }

    private updateRanges(properties: Property[]) {
        this.requestRangesAndUpdateFacets(properties)
            .catch((e) => {
                console.error("Requesting new ranges failed");
                console.error(e);
                this.setError(e.message);
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