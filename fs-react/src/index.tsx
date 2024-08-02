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
import {SolrDocumentsResponse} from "./common/datatypes";
import ResultView from "./ui/result_view";
import Client from "./common/client";
import DocumentQueryBuilder from "./common/query_builder";

const browserWindow = window as any;
let solrProxyUrl;
if (browserWindow.mw) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/EnhancedRetrieval/v1/proxy";
} else {
    solrProxyUrl = "http://localhost:9000/proxy";
}
const client: Client = new Client(solrProxyUrl);
const initialSearch = client.searchDocuments(new DocumentQueryBuilder().build());

function App() {

    const [searchResult, setSearchResult] = useState((): SolrDocumentsResponse => null);
    const queryBuilder = new DocumentQueryBuilder();

    function onSearchClick(text: string) {
        let query = queryBuilder
            .withSearchText(text)
            .build();
        client.searchDocuments(query).then(response => setSearchResult(response))
            .catch((e) => { console.log("query failed: " + e)});
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
            <div id={'fs-header'} className={'fs-boxes'}><SearchBar onClick={onSearchClick}/></div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>Facets</div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}><ResultView results={searchResult ? searchResult.docs : []}/></div>
        </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);