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

function App() {

    const client: SolrClient = new SolrClient('http://localhost/main/mediawiki');
    const [searchResult, setSearchResult] = useState((): SolrResponse => null);

    function onSearchClick(text: string) {
        let queryBuilder = new QueryBuilder();
        let query = queryBuilder
            .withSearchText(text)
            .build();
        client.search(query).then(response => setSearchResult(response));
    }

    const initialSearch = client.search(new QueryBuilder().build());
    const [, setInitialSearch] = useState(initialSearch);
    useEffect(
        () => {
            setInitialSearch(initialSearch);
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