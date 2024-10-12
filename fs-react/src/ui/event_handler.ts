import DocumentQueryBuilder from "../common/document_query_builder";
import FacetQueryBuilder from "../common/facet_query_builder";
import {
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

class EventHandler {

    private currentDocumentsQueryBuilder: DocumentQueryBuilder;
    private currentFacetsQueryBuilder: FacetQueryBuilder;
    private readonly client: Client;
    private readonly setSearchResult: React.Dispatch<React.SetStateAction<SolrDocumentsResponse>>;
    private readonly setSelectedFacetsResults: React.Dispatch<React.SetStateAction<SolrFacetResponse>>;
    private readonly setSelectedFacets: React.Dispatch<React.SetStateAction<PropertyFacet[]>>;
    private readonly setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    private readonly setSelectedNamespace: React.Dispatch<React.SetStateAction<number>>;


    constructor(  setSearchResult: React.Dispatch<React.SetStateAction<SolrDocumentsResponse>>,
                  setSelectedFacetsResults: React.Dispatch<React.SetStateAction<SolrFacetResponse>>,
                  setSelectedFacets: React.Dispatch<React.SetStateAction<PropertyFacet[]>>,
                  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
                  setSelectedNamespace: React.Dispatch<React.SetStateAction<number>>,
                  client: Client) {
        this.currentDocumentsQueryBuilder = new DocumentQueryBuilder();
        this.currentFacetsQueryBuilder = new FacetQueryBuilder();
        this.client = client;
        this.setSearchResult = setSearchResult;
        this.setSelectedFacetsResults = setSelectedFacetsResults;
        this.setSelectedFacets = setSelectedFacets;
        this.setSelectedCategories = setSelectedCategories;
        this.setSelectedNamespace = setSelectedNamespace;

    }

    onSearchClick(text: string) {
        this.currentDocumentsQueryBuilder = this.currentDocumentsQueryBuilder
            .withSearchText(text);
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
        this.currentFacetsQueryBuilder.update(this.currentDocumentsQueryBuilder.build());
        this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
            this.setSelectedFacetsResults(response);
            this.setSelectedFacets(this.currentFacetsQueryBuilder.build().propertyFacets)
        }).catch((e) => { console.log("query failed: " + e)});
    }

    onPropertyClick(p: PropertyResponse) {
        this.currentDocumentsQueryBuilder = this.currentDocumentsQueryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: null, mwTitle:null, range: null}
        );
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
        this.updateFacetValues(p);
    }

    onExpandClick(p: PropertyResponse) {
        this.updateFacetValues(p);
    }

    onValueClick(p: PropertyResponse, v: ValueCount) {
        this.currentDocumentsQueryBuilder = this.currentDocumentsQueryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: v.value, mwTitle:v.mwTitle, range: v.range}
        );
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
        this.updateFacetValues(p);

    }

    onSelectedPropertyClick(p: PropertyResponse) {
        console.log(p);
    }

    onNamespaceClick(n: number) {
        this.currentDocumentsQueryBuilder = this.currentDocumentsQueryBuilder.withNamespaceFacet(n);
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSelectedNamespace(this.currentDocumentsQueryBuilder.build().namespaceFacets[0]);
            this.setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
    }

    onCategoryClick(c: string) {
        this.currentDocumentsQueryBuilder = this.currentDocumentsQueryBuilder.withCategoryFacet(c);
        this.client.searchDocuments(this.currentDocumentsQueryBuilder.build()).then(response => {
            this.setSelectedCategories(this.currentDocumentsQueryBuilder.build().categoryFacets);
            this.setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
    }

    private updateFacetValues(p: PropertyResponse) {
        this.currentFacetsQueryBuilder.update(this.currentDocumentsQueryBuilder.build());
        if (p.type === Datatype.datetime || p.type === Datatype.number) {
            const sqb = new StatQueryBuilder();
            sqb.update(this.currentDocumentsQueryBuilder.build());
            sqb.withStatField({title: p.title, type: p.type} );
            this.client.searchStats(sqb.build()).then((r) => {
                let stat: Stats = r.stats[0];
                stat.clusters.forEach((r) => {
                    this.currentFacetsQueryBuilder.withFacetQuery({property: p.title, type: p.type, range: r})
                });
                this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
                    this.setSelectedFacetsResults(response);
                    this.setSelectedFacets(this.currentFacetsQueryBuilder.build().propertyFacets)
                }).catch((e) => { console.log("query failed: " + e)});
            });
        } else {
            this.currentFacetsQueryBuilder.withFacetProperties({title: p.title, type: p.type})
            this.client.searchFacets(this.currentFacetsQueryBuilder.build()).then(response => {
                this.setSelectedFacetsResults(response);
                this.setSelectedFacets(this.currentFacetsQueryBuilder.build().propertyFacets)
            }).catch((e) => { console.log("query failed: " + e)});

        }
    }
}

export default EventHandler;