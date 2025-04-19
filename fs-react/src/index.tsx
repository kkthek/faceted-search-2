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
import {Property, Sort, WikiContextInterface} from "./common/datatypes";
import CategoryDropdown from "./ui/category_dropdown";

const browserWindow = window as any;
let solrProxyUrl;

let wikiContext: WikiContextInterface = {
    config: {},
    msg: (id: string) => id
};

const isInWikiContext = browserWindow.mw !== undefined;

if (isInWikiContext) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/FacetedSearch2/v1/proxy";
    wikiContext.config = browserWindow.mw.config.values;
    wikiContext.msg = browserWindow.mw.msg;
} else {
    solrProxyUrl = "http://localhost:9000";
}

const client: Client = new Client(solrProxyUrl);
export let WikiContext = createContext(null);

const currentDocumentsQueryBuilder = new DocumentQueryBuilder();
const currentFacetsQueryBuilder = new FacetQueryBuilder();

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

            client.searchDocuments(currentDocumentsQueryBuilder.build())
                .then(response => {
                    setSearchStateDocument({
                        documentResponse: response,
                        query: currentDocumentsQueryBuilder.build()
                    });
            }).catch((e) => {
                console.error("Request to backend failed");
                console.error(e);
            });
        },
        []
    );

    let anyFacetSelected = searchFacetState?.query.isAnyPropertySelected()
        || searchStateDocument?.query.isAnyCategorySelected();
    let useCategoryDropdown = wikiContext.config.fs2gCategoryFilter.length === 0;

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
                    {anyFacetSelected ? '' : '(no facets selected)'}
                    <SelectedFacetsView searchStateFacet={searchFacetState}
                                        onValueClick={eventHandler.onValueClick.bind(eventHandler)}
                                        onRemoveClick={eventHandler.onRemovePropertyFacet.bind(eventHandler)}
                                        onFacetValueContainsClick={eventHandler.onFacetValueContains.bind(eventHandler)}
                                        onExpandClick={eventHandler.onExpandClick.bind(eventHandler)}
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
                               onValuesClick={eventHandler.onValuesClick.bind(eventHandler)}
                               onRemoveClick={eventHandler.onRemovePropertyFacet.bind(eventHandler)}
                               onFacetValueContainsClick={eventHandler.onFacetValueContains.bind(eventHandler)}
                    />
                    {useCategoryDropdown ?
                        <CategoryView searchStateDocument={searchStateDocument}
                                      onCategoryClick={eventHandler.onCategoryClick.bind(eventHandler)}
                        /> :
                        <CategoryDropdown onCategoryClick={eventHandler.onCategoryClick.bind(eventHandler)}/>
                    }

                </div>
            </div>
            <div id={'fs-results'}>
                <ResultView results={searchStateDocument ? searchStateDocument.documentResponse.docs : []} client={client}/>
                <PagingView searchStateDocument={searchStateDocument}
                            onPageIndexClick={eventHandler.onPageIndexClick.bind(eventHandler)}
                />
            </div>
        </div>
    </WikiContext.Provider>;
}

async function getSettingsForDevContext() {
    let settings = await client.getSettingsForDevContext();
    wikiContext.config = settings;
    applyQueryConstraintsFromConfig();
}

function applyQueryConstraintsFromConfig() {
    wikiContext.config.fs2gExtraPropertiesToRequest.forEach((p: Property) => {
        currentDocumentsQueryBuilder.withExtraProperty(p);
    });
    currentDocumentsQueryBuilder.withLimit(wikiContext.config['fs2gHitsPerPage']);

}

function startApp() {
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);
}

if (isInWikiContext) {
    applyQueryConstraintsFromConfig();
    startApp();
} else {
    getSettingsForDevContext().then(() => startApp());
}