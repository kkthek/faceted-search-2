import DocumentQueryBuilder from "../common/document_query_builder";
import FacetQueryBuilder from "../common/facet_query_builder";
import {
    BaseQuery,
    Datatype,
    PropertyFacet,
    PropertyResponse,
    SolrDocumentsResponse,
    SolrFacetResponse,
    Stats,
    ValueCount
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

    private currentDocumentsQueryBuilder: DocumentQueryBuilder;
    private currentFacetsQueryBuilder: FacetQueryBuilder;
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
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
        this.currentFacetsQueryBuilder.update(this.currentDocumentsQueryBuilder.build());
        this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
            this.setFacetState({
                facetsResponse: response,
                query: this.currentFacetsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
    }

    onPropertyClick(p: PropertyResponse) {
        this.currentDocumentsQueryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: null, mwTitle:null, range: null}
        );
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
        this.updateFacetValues(p);
    }

    onExpandClick(p: PropertyResponse) {
        this.updateFacetValues(p);
    }

    onValueClick(p: PropertyResponse, v: ValueCount) {
        this.currentDocumentsQueryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: v.value, mwTitle:v.mwTitle, range: v.range}
        );
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
        this.updateFacetValues(p);

    }

    onSelectedPropertyClick(p: PropertyResponse) {
        console.log(p);
    }

    onRemovePropertyFacet(p: PropertyResponse, v: ValueCount) {
        this.currentDocumentsQueryBuilder.withoutPropertyFacetConstraint(
            {property: p.title, type: p.type, value: v?.value, mwTitle:v?.mwTitle, range: v?.range})
        console.log(v);
        console.log(this.currentDocumentsQueryBuilder);
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
        this.currentFacetsQueryBuilder.update(this.currentDocumentsQueryBuilder.build());
        this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
            this.setFacetState({
                facetsResponse: response,
                query: this.currentFacetsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
    }

    onNamespaceClick(n: number) {
        this.currentDocumentsQueryBuilder.withNamespaceFacet(n);
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
    }

    onCategoryClick(c: string) {
        this.currentDocumentsQueryBuilder.withCategoryFacet(c);
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchState({
                documentResponse: response,
                query: this.currentDocumentsQueryBuilder.build()
            });
        }).catch((e) => { console.log("query failed: " + e)});
    }

    private updateFacetValues(p: PropertyResponse) {
        this.currentFacetsQueryBuilder.update(this.currentDocumentsQueryBuilder.build());
        if ((p.type === Datatype.datetime || p.type === Datatype.number) ) {
            const sqb = new StatQueryBuilder();
            sqb.update(this.currentDocumentsQueryBuilder.build());
            sqb.withStatField({title: p.title, type: p.type} );
            this.client.searchStats(sqb.build()).then((r) => {
                let stat: Stats = r.stats[0];
                this.currentFacetsQueryBuilder.withoutFacetQuery({title: p.title, type: p.type})
                stat.clusters.forEach((r) => {
                    this.currentFacetsQueryBuilder.withFacetQuery({property: p.title, type: p.type, range: r})
                });
                this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
                    this.setFacetState({
                        facetsResponse: response,
                        query: this.currentFacetsQueryBuilder.build()
                    });
                }).catch((e) => { console.log("query failed: " + e)});
            });
        } else {
            this.currentFacetsQueryBuilder.withFacetProperties({title: p.title, type: p.type})
            this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
                this.setFacetState({
                    facetsResponse: response,
                    query: this.currentFacetsQueryBuilder.build()
                });
            }).catch((e) => { console.log("query failed: " + e)});

        }
    }
}

export default EventHandler;