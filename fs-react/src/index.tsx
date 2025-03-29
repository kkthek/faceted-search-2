/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React, {createContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from "./ui/search_bar_view";
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
import PagingView from "./ui/paging_view";
import SortView from "./ui/sort_view";
import {Sort, WikiContextInterface} from "./common/datatypes";

const browserWindow = window as any;
let solrProxyUrl;

let wikiContext: WikiContextInterface = {
    config: {},
    msg: (id: string) => id
};

if (browserWindow.mw) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/FacetedSearch2/v1/proxy";
    wikiContext.config = browserWindow.mw.config.values;
    wikiContext.msg = browserWindow.mw.msg;
} else {
    wikiContext.config = {
                    'wgFormattedNamespaces': {0: 'Main', 14: 'Category', 10: 'Template'},
                    'fsgFacetValueLimit': 20
    };
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
    const [sortState, setSortState] = useState((): Sort => null);

    const eventHandler = new EventHandler(
        currentDocumentsQueryBuilder,
        currentFacetsQueryBuilder,
        setSearchStateDocument,
        setSearchFacetState,
        setSortState,
        client
    );

    useEffect(
        () => {
            initialSearch.then(response => {
                setSearchStateDocument({
                    documentResponse: response,
                    query: currentDocumentsQueryBuilder.build()
                });
            }).catch((e) => {
                    console.error("Request to backend failed");
                    console.error(e);
            });
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
                <SortView sort={sortState}
                          onChange={eventHandler.onSortChange.bind(eventHandler)}/>
            </div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                <div id={'fs-selected-facets'}>
                    <h3>Selected facets</h3>
                    {  (searchFacetState == null || searchFacetState.query.isAnyPropertySelected())
                    && (searchStateDocument == null || searchStateDocument.query.isAnyCategorySelected())
                        ? '(no facets selected)':''}
                    <SelectedFacetsView searchStateFacet={searchFacetState}
                                        onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                                        onRemoveClick={eventHandler.onRemovePropertyFacet.bind(eventHandler)}
                    />
                    <SelectedCategoriesView searchStateDocument={searchStateDocument}
                                            onCategoryRemove={eventHandler.onCategoryRemoveClick.bind(eventHandler)}
                    />
                    <hr className="fs-separatorLine"/>
                </div>
                <div id={'fs-facets-existing'}>
                    <h3>Available properties</h3>
                    <FacetView searchStateDocument={searchStateDocument}
                               searchStateFacets={searchFacetState}
                               onPropertyClick={eventHandler.onPropertyClick.bind(eventHandler)}
                               onExpandClick={eventHandler.onExpandClick.bind(eventHandler)}
                               onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                               onRemoveClick={eventHandler.onRemovePropertyFacet.bind(eventHandler)}
                               onFilterContainsClick={eventHandler.onFacetContains.bind(eventHandler)}
                    />
                    <h3>Available categories</h3>
                    <CategoryView searchStateDocument={searchStateDocument}
                                  onCategoryClick={eventHandler.onCategoryClick.bind(eventHandler)}
                    />
                </div>
            </div>
            <div id={'fs-results'}>
                <ResultView results={searchStateDocument ? searchStateDocument.documentResponse.docs : []}/>
                <PagingView searchStateDocument={searchStateDocument}
                            onPageIndexClick={eventHandler.onPageIndexClick.bind(eventHandler)}
                />
            </div>
            </div>
        </WikiContext.Provider>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);