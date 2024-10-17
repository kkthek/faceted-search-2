/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React, {createContext, useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from "./ui/search_bar_view";
import {PropertyFacet, SolrDocumentsResponse, SolrFacetResponse} from "./common/datatypes";
import ResultView from "./ui/result_view";
import Client from "./common/client";
import DocumentQueryBuilder from "./common/document_query_builder";
import FacetView from "./ui/facet_view";
import SelectedFacetsView from "./ui/selected_facets_view";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "./ui/event_handler";
import CategoryView from "./ui/category_view";
import SelectedCategoriesView from "./ui/selected_categories_view";
import NamespaceView from "./ui/namespace_view";
import FacetQueryBuilder from "./common/facet_query_builder";

const browserWindow = window as any;
let solrProxyUrl;
let wikiContext = {};
if (browserWindow.mw) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/EnhancedRetrieval/v1/proxy";
    wikiContext = browserWindow.mw.config.values;
} else {
    wikiContext = {'wgFormattedNamespaces': {0: 'Main', 14: 'Category', 10: 'Template'}};
    solrProxyUrl = "http://localhost:9000";
}

const client: Client = new Client(solrProxyUrl);
export let WikiContext = createContext(null);

const currentDocumentsQueryBuilder = new DocumentQueryBuilder();
const currentFacetsQueryBuilder = new FacetQueryBuilder();
const initialSearch = client.searchDocuments(currentDocumentsQueryBuilder.build());

function App() {
    const [searchStateDocument, setSearchStateDocument] = useState((): SearchStateDocument => null);
    const [searchFacetState, setSearchFacetState] = useState((): SearchStateFacet => null);

    const eventHandler = new EventHandler(
        currentDocumentsQueryBuilder,
        currentFacetsQueryBuilder,
        setSearchStateDocument,
        setSearchFacetState,
        client
    );

    useEffect(
        () => {
            initialSearch.then(response => {
                setSearchStateDocument({
                    documentResponse: response,
                    query: currentDocumentsQueryBuilder.build()
                });
            })
                .catch((e) => { console.log("query failed: " + e)});
        },
        [initialSearch]
    );

    return <WikiContext.Provider value={wikiContext}>
            <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>
                <SearchBar onClick={eventHandler.onSearchClick.bind(eventHandler)}/>
                <NamespaceView searchStateDocument={searchStateDocument}
                               onNamespaceClick={eventHandler.onNamespaceClick.bind(eventHandler)}
                />
            </div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                <div id={'fs-selected-facets'}>
                    <SelectedFacetsView searchStateDocument={searchFacetState}
                                        onPropertyClick={eventHandler.onSelectedPropertyClick.bind(eventHandler)}
                                        onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                    />
                    <SelectedCategoriesView searchStateDocument={searchStateDocument}
                    />
                </div>
                <div>
                    <FacetView searchStateDocument={searchStateDocument}
                               searchStateFacets={searchFacetState}
                               onPropertyClick={eventHandler.onPropertyClick.bind(eventHandler)}
                               onExpandClick={eventHandler.onExpandClick.bind(eventHandler)}
                               onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                    />
                    <CategoryView searchStateDocument={searchStateDocument}
                                  onCategoryClick={eventHandler.onCategoryClick.bind(eventHandler)}
                    />
                </div>
            </div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}>
                <ResultView results={searchStateDocument ? searchStateDocument.documentResponse.docs : []}/>
            </div>
            </div>
        </WikiContext.Provider>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);