/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from "./ui/search_bar";
import {
    Datatype,
    PropertyResponse,
    SolrDocumentsResponse,
    SolrFacetResponse,
    Stats,
    ValueCount
} from "./common/datatypes";
import ResultView from "./ui/result_view";
import Client from "./common/client";
import DocumentQueryBuilder from "./common/document_query_builder";
import FacetView from "./ui/facet_view";
import SelectedFacetsView from "./ui/selected_facets";
import FacetQueryBuilder from "./common/facet_query_builder";
import StatQueryBuilder from "./common/stat_query_builder";

const browserWindow = window as any;
let solrProxyUrl;
if (browserWindow.mw) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/EnhancedRetrieval/v1/proxy";
} else {
    solrProxyUrl = "http://localhost:9000";
}
let currentDocumentsQueryBuilder = new DocumentQueryBuilder();
let currentFacetsQueryBuilder = new FacetQueryBuilder();
const client: Client = new Client(solrProxyUrl);
const initialSearch = client.searchDocuments(currentDocumentsQueryBuilder.build());

function App() {

    const [searchResult, setSearchResult] = useState((): SolrDocumentsResponse => null);
    const [selectedFacetsResults, setSelectedFacetsResults] = useState((): SolrFacetResponse => null);

    function onSearchClick(text: string) {
        currentDocumentsQueryBuilder = currentDocumentsQueryBuilder
            .withSearchText(text);
        client.searchDocuments(currentDocumentsQueryBuilder.build()).then(response => {
            setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
        currentFacetsQueryBuilder.update(currentDocumentsQueryBuilder.build());
        client.searchFacets(currentFacetsQueryBuilder.build()).then(response => {
            setSelectedFacetsResults(response);
        }).catch((e) => { console.log("query failed: " + e)});
    }

    function onPropertyClick(p: PropertyResponse) {
        currentDocumentsQueryBuilder = currentDocumentsQueryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: null, mwTitle:null, range: null}
        );
        client.searchDocuments(currentDocumentsQueryBuilder.build()).then(response => {
            setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
        updateFacets(p);
    }

    function updateFacets(p: PropertyResponse) {
        currentFacetsQueryBuilder.update(currentDocumentsQueryBuilder.build());
        if (p.type === Datatype.datetime || p.type === Datatype.number) {
            const sqb = new StatQueryBuilder();
            sqb.update(currentDocumentsQueryBuilder.build());
            sqb.withStatField({title: p.title, type: p.type} );
            client.searchStats(sqb.build()).then((r) => {
                let stat: Stats = r.stats[0];
                stat.clusters.forEach((r) => {
                    currentFacetsQueryBuilder.withFacetQuery({property: p.title, type: p.type, range: r})
                });
                client.searchFacets(currentFacetsQueryBuilder.build()).then(response => {
                    setSelectedFacetsResults(response);
                }).catch((e) => { console.log("query failed: " + e)});
            });
        } else {
            currentFacetsQueryBuilder.withFacetProperties({title: p.title, type: p.type})
            client.searchFacets(currentFacetsQueryBuilder.build()).then(response => {
                setSelectedFacetsResults(response);
            }).catch((e) => { console.log("query failed: " + e)});

        }
    }

    function onExpandClick(p: PropertyResponse) {
        updateFacets(p);

    }

    function onValueClick(p: PropertyResponse, v: ValueCount) {
        currentDocumentsQueryBuilder = currentDocumentsQueryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: v.value, mwTitle:v.mwTitle, range: v.range}
        );
        client.searchDocuments(currentDocumentsQueryBuilder.build()).then(response => {
            setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
        updateFacets(p);

    }

    function onSelectedPropertyClick(p: PropertyResponse) {
        console.log(p);
    }


    const [initialSearchState, setInitialSearch] = useState(initialSearch);
    useEffect(
        () => {
            setInitialSearch(initialSearch);
            initialSearchState.then(response => setSearchResult(response))
                .catch((e) => { console.log("query failed: " + e)});
        },
        [initialSearch]
    );

    return <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>
                <SearchBar onClick={onSearchClick}/>
            </div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                <div id={'fs-selected-facets'}>
                    <SelectedFacetsView facetsQueryBuilder={currentFacetsQueryBuilder}
                                        results={selectedFacetsResults}
                                        onPropertyClick={onSelectedPropertyClick}
                                        onValueClick={onValueClick}
                    />
                </div>
                <div>
                    <FacetView facetsQueryBuilder={currentFacetsQueryBuilder}
                               facets={selectedFacetsResults}
                               results={searchResult}
                               onPropertyClick={onPropertyClick}
                               onExpandClick={onExpandClick}
                               onValueClick={onValueClick}
                    />
                </div>
            </div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}>
                <ResultView results={searchResult ? searchResult.docs : []}/>
            </div>
        </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);