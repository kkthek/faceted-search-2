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
import {SolrResponse} from "./common/datatypes";
import ResultView from "./ui/result_view";
import SolrClient from "./solr_api/solr_client";
import QueryBuilder from "./common/query_builder";

const client: SolrClient = new SolrClient('http://localhost:9000/proxy');
const initialSearch = client.search(new QueryBuilder().build());

function App() {

    const [searchResult, setSearchResult] = useState((): SolrResponse => null);
    const queryBuilder = new QueryBuilder();

    function onSearchClick(text: string) {
        let query = queryBuilder
            .withSearchText(text)
            .build();
        client.search(query).then(response => setSearchResult(response))
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