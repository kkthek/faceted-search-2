import DocumentQueryBuilder from "../common/document_query_builder";
import FacetQueryBuilder from "../common/facet_query_builder";
import {
    BaseQuery,
    Property,
    PropertyFacet,
    PropertyValueConstraint,
    SolrDocumentsResponse,
    SolrFacetResponse,
    Sort
} from "../common/datatypes";
import StatQueryBuilder from "../common/stat_query_builder";
import Client from "../common/client";

export interface SearchStateDocument {
    documentResponse: SolrDocumentsResponse;
    query: BaseQuery
}
export interface SearchStateFacet {
    facetsResponse: SolrFacetResponse;
    query: BaseQuery
}


class EventHandler {

    private readonly currentDocumentsQueryBuilder: DocumentQueryBuilder;
    private readonly currentFacetsQueryBuilder: FacetQueryBuilder;
    private readonly client: Client;
    private readonly setSearchState: React.Dispatch<React.SetStateAction<SearchStateDocument>>;
    private readonly setFacetState: React.Dispatch<React.SetStateAction<SearchStateFacet>>;
    private readonly setSortState: React.Dispatch<React.SetStateAction<Sort>>;


    constructor(  currentDocumentsQueryBuilder: DocumentQueryBuilder,
                  currentFacetsQueryBuilder: FacetQueryBuilder,
                  setDocumentState: React.Dispatch<React.SetStateAction<SearchStateDocument>>,
                  setFacetState: React.Dispatch<React.SetStateAction<SearchStateFacet>>,
                  setSortState: React.Dispatch<React.SetStateAction<Sort>>,
                  client: Client) {
        this.currentDocumentsQueryBuilder = currentDocumentsQueryBuilder;
        this.currentFacetsQueryBuilder = currentFacetsQueryBuilder;
        this.client = client;
        this.setSearchState = setDocumentState;
        this.setFacetState = setFacetState;
        this.setSortState = setSortState;
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

        this.setSortState(sort);
        this.updateDocuments();
    }

    onPropertyClick(p: Property) {
        let propertyFacet = new PropertyFacet(p.title, p.type, null, null, null);
        this.currentDocumentsQueryBuilder
            .withPropertyFacet(propertyFacet)
            .withOffset(0);
        this.updateDocuments();
        this.updateFacetValuesForProperty(p);
    }

    onExpandClick(p: Property, limit: number) {
        this.updateFacetValuesForProperty(p, limit);
    }

    onValueClick(p: PropertyFacet) {
        let property = new Property(p.property, p.type);
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property)
            .withPropertyFacet(p);
        this.updateDocuments();
        this.updateFacetValuesForProperty(property);

    }

    onRemovePropertyFacet(p: PropertyFacet) {
        let property = new Property(p.property, p.type);
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .clearFacetsForProperty(property);
        this.currentFacetsQueryBuilder
            .clearFacetsQueriesForProperty(property)
            .clearPropertyValueConstraintForProperty(property)
            .updateBaseQuery(this.currentDocumentsQueryBuilder);

        this.updateDocuments();
        const rangeProperties = this.currentFacetsQueryBuilder.build().getRangeProperties();
        if (rangeProperties.length === 0) {
            this.updateFacets();
        } else {
            this.requestNewRanges(rangeProperties)
                .then((e) => {
                    this.updateFacets();
                }).catch((e) => {
                    console.error("Request to backend failed");
                    console.error(e);
                });
        }
    }

    onFacetContains(text: string, limit: number, property: Property) {

        this.currentFacetsQueryBuilder.withPropertyValueConstraint(
            new PropertyValueConstraint(
                property.title,
                property.type,
                text === '' ? limit : null,
                null,
                text === '' ? null : text)
        );
        this.updateFacets();
    }

    onNamespaceClick(n: number) {
        this.currentDocumentsQueryBuilder
            .toggleNamespaceFacet(n)
            .withOffset(0);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onCategoryClick(c: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withCategoryFacet(c);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onCategoryRemoveClick(c: string) {
        this.currentDocumentsQueryBuilder
            .withOffset(0)
            .withoutCategoryFacet(c);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onPageIndexClick(pageIndex: number, limit : number) {
        this.currentDocumentsQueryBuilder.withOffset(pageIndex * limit);
        this.updateDocuments();
    }

    private updateFacetValuesForProperty(p: Property, limit: number = null) {

        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        if (p.isRangeProperty()) {
            this.requestNewRanges([p])
                .then(() => {
                    this.updateFacets();
                })
                .catch((e) => {
                    console.error("Request to backend failed");
                    console.error(e);
            });
        } else {
            let pwc = new PropertyValueConstraint(p.title, p.type, limit, null, null);
            this.currentFacetsQueryBuilder.withPropertyValueConstraint(pwc);
            this.updateFacets();

        }
    }

    private async requestNewRanges(properties: Property[]) {
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
        });
    }

}

export default EventHandler;