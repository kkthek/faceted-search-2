import DocumentQueryBuilder from "../common/document_query_builder";
import FacetQueryBuilder from "../common/facet_query_builder";
import {
    BaseQuery,
    Datatype,
    Property,
    PropertyFacet, PropertyFacetClass,
    SolrDocumentsResponse,
    SolrFacetResponse,
    Stats
} from "../common/datatypes";
import StatQueryBuilder from "../common/stat_query_builder";
import Client from "../common/client";
import Tools from "../util/tools";

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

    constructor(  currentDocumentsQueryBuilder: DocumentQueryBuilder,
                  currentFacetsQueryBuilder: FacetQueryBuilder,
                  setDocumentState: React.Dispatch<React.SetStateAction<SearchStateDocument>>,
                  setFacetState: React.Dispatch<React.SetStateAction<SearchStateFacet>>,
                  client: Client) {
        this.currentDocumentsQueryBuilder = currentDocumentsQueryBuilder;
        this.currentFacetsQueryBuilder = currentFacetsQueryBuilder;
        this.client = client;
        this.setSearchState = setDocumentState;
        this.setFacetState = setFacetState;

    }

    onSearchClick(text: string) {
        this.currentDocumentsQueryBuilder.withSearchText(text);
        this.updateDocuments();
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        this.updateFacets();
    }

    onPropertyClick(p: Property) {
        let propertyFacet:PropertyFacet = { property: p.title, type: p.type, value: null, mwTitle: null, range: null};
        this.currentDocumentsQueryBuilder.withPropertyFacet(propertyFacet);
        this.updateDocuments();
        this.updateFacetValuesForProperty(p);
    }

    onExpandClick(p: Property) {
        this.updateFacetValuesForProperty(p);
    }

    onValueClick(p: PropertyFacet) {
        let property = {title: p.property, type: p.type};
        this.currentDocumentsQueryBuilder.clearFacetsForProperty(property);
        this.currentDocumentsQueryBuilder.withPropertyFacet(p);
        this.updateDocuments();
        this.updateFacetValuesForProperty(property);

    }

    onRemovePropertyFacet(p: PropertyFacet) {
        let property = {title: p.property, type: p.type};
        this.currentDocumentsQueryBuilder.clearFacetsForProperty(property);
        this.currentFacetsQueryBuilder.clearFacetsForProperty(property);
        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);

        this.updateDocuments();
        this.updateFacets();
    }

    onNamespaceClick(n: number) {
        this.currentDocumentsQueryBuilder.toggleNamespaceFacet(n);
        this.updateDocuments();
    }

    onCategoryClick(c: string) {
        this.currentDocumentsQueryBuilder.withCategoryFacet(c);
        this.updateDocuments();
    }

    onCategoryRemoveClick(c: string) {
        this.currentDocumentsQueryBuilder.withoutCategoryFacet(c);
        this.updateDocuments();
    }

    private updateFacetValuesForProperty(p: Property) {

        this.currentFacetsQueryBuilder.updateBaseQuery(this.currentDocumentsQueryBuilder);
        if ((p.type === Datatype.datetime || p.type === Datatype.number) ) {
            const sqb = new StatQueryBuilder();
            sqb.updateBaseQuery(this.currentDocumentsQueryBuilder);
            sqb.withStatField(p);
            this.client.searchStats(sqb.build()).then((r) => {
                let stat: Stats = r.stats[0];
                this.currentFacetsQueryBuilder.clearFacetsForProperty(p);
                stat.clusters.forEach((r) => {
                    this.currentFacetsQueryBuilder.withFacetQuery({property: p.title, type: p.type, range: r})
                });
                this.updateFacets();
            });
        } else {
            this.currentFacetsQueryBuilder.withFacetProperties(p);
            this.updateFacets();

        }
    }

    private updateDocuments() {
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
    }

    private updateFacets() {
        this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
            this.setFacetState({
                facetsResponse: response,
                query: this.currentFacetsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
    }
}

export default EventHandler;