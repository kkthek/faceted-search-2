/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from "./ui/search_bar_view";
import {PropertyFacet, SolrDocumentsResponse, SolrFacetResponse} from "./common/datatypes";
import ResultView from "./ui/result_view";
import Client from "./common/client";
import DocumentQueryBuilder from "./common/document_query_builder";
import FacetView from "./ui/facet_view";
import SelectedFacetsView from "./ui/selected_facets_view";
import EventHandler from "./ui/event_handler";

const browserWindow = window as any;
let solrProxyUrl;
if (browserWindow.mw) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/EnhancedRetrieval/v1/proxy";
} else {
    solrProxyUrl = "http://localhost:9000";
}

const client: Client = new Client(solrProxyUrl);
const initialSearch = client.searchDocuments(new DocumentQueryBuilder().build());

function App() {

    const [searchDocumentResult, setSearchDocumentResult] = useState((): SolrDocumentsResponse => null);
    const [searchFacetResults, setSearchFacetResults] = useState((): SolrFacetResponse => null);
    const [selectedFacets, setSelectedFacets] = useState((): PropertyFacet[] => []);

    const eventHandler = new EventHandler(setSearchDocumentResult, setSearchFacetResults, setSelectedFacets, client);

    const [initialSearchState, setInitialSearch] = useState(initialSearch);
    useEffect(
        () => {
            setInitialSearch(initialSearch);
            initialSearchState.then(response => setSearchDocumentResult(response))
                .catch((e) => { console.log("query failed: " + e)});
        },
        [initialSearch]
    );

    return <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>
                <SearchBar onClick={eventHandler.onSearchClick.bind(eventHandler)}/>
            </div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                <div id={'fs-selected-facets'}>
                    <SelectedFacetsView selectedFacets={selectedFacets}
                                        results={searchFacetResults}
                                        onPropertyClick={eventHandler.onSelectedPropertyClick.bind(eventHandler)}
                                        onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                    />
                </div>
                <div>
                    <FacetView selectedFacets={selectedFacets}
                               facets={searchFacetResults}
                               results={searchDocumentResult}
                               onPropertyClick={eventHandler.onPropertyClick.bind(eventHandler)}
                               onExpandClick={eventHandler.onExpandClick.bind(eventHandler)}
                               onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                    />
                </div>
            </div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}>
                <ResultView results={searchDocumentResult ? searchDocumentResult.docs : []}/>
            </div>
        </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);