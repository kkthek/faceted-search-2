/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from "./ui/search_bar";
import { useState, useEffect } from 'react';
import {PropertyResponse, SolrDocumentsResponse} from "./common/datatypes";
import ResultView from "./ui/result_view";
import Client from "./common/client";
import DocumentQueryBuilder from "./common/query_builder";
import FacetView from "./ui/facet_view";
import SelectedFacetsView from "./ui/selected_facets";

const browserWindow = window as any;
let solrProxyUrl;
if (browserWindow.mw) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/EnhancedRetrieval/v1/proxy";
} else {
    solrProxyUrl = "http://localhost:9000";
}
let queryBuilder = new DocumentQueryBuilder();
const client: Client = new Client(solrProxyUrl);
const initialSearch = client.searchDocuments(queryBuilder.build());

function App() {

    const [searchResult, setSearchResult] = useState((): SolrDocumentsResponse => null);
    const [selectedFacetsResults, setSelectedFacetsResults] = useState((): SolrDocumentsResponse => null);

    function onSearchClick(text: string) {
        queryBuilder = queryBuilder
            .withSearchText(text);
        client.searchDocuments(queryBuilder.build()).then(response => {
            setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
    }

    function onPropertyClick(p: PropertyResponse) {
        queryBuilder = queryBuilder.withPropertyFacetConstraint(
            {property: p.title, type: p.type, value: null, mwTitle:null, range: null}
        );
        client.searchDocuments(queryBuilder.build()).then(response => {
            setSearchResult(response);
        }).catch((e) => { console.log("query failed: " + e)});
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
                <SelectedFacetsView results={searchResult} documentQueryBuilder={queryBuilder} onPropertyClick={onSelectedPropertyClick}/>
                <FacetView results={searchResult} onPropertyClick={onPropertyClick}/>
            </div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}>
                <ResultView results={searchResult ? searchResult.docs : []}/>
            </div>
        </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);