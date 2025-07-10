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
import EventHandler, {SearchStateDocument, SearchStateFacet} from "./common/event_handler";
import CategoryView from "./ui/category_view";
import SelectedCategoriesView from "./ui/selected_categories_view";
import NamespaceView from "./ui/namespace_view";
import FacetQueryBuilder from "./common/facet_query_builder";
import SortView from "./ui/sort_view";
import {Property} from "./common/datatypes";
import CategoryDropdown from "./ui/category_dropdown";
import {Box, Divider, Typography} from "@mui/material";
import ErrorView from "./custom_ui/error_view";
import ConfigUtils from "./util/config_utils";
import Tools from "./util/tools";
import SaveSearchLink from "./ui/save_search_link";
import {WikiContextInterface, WikiContextInterfaceMock} from "./common/wiki_context";
import RemoveAllFacetsButton from "./ui/remove_all_facets_button";

const browserWindow = window as any;
const isInWikiContext = !!browserWindow.mw;
let wikiContext: WikiContextInterface = null;

let solrProxyUrl: string;
let globals: any = {};

if (isInWikiContext) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/FacetedSearch2/v1/proxy";
    globals.mwApiUrl = wgServer + wgScriptPath + "/api.php";
    wikiContext = new WikiContextInterface(
        browserWindow.mw.config.values,
        browserWindow.mw.user.options.values,
        browserWindow.mw.user.getName(),
        browserWindow.mw.msg,
        globals
    );
} else {
    solrProxyUrl = "http://localhost:9000";
    globals.mwApiUrl = solrProxyUrl + '/api.php';
}

const client: Client = new Client(solrProxyUrl);
export let WikiContext = createContext(null);

const currentDocumentsQueryBuilder = new DocumentQueryBuilder();
const currentFacetsQueryBuilder = new FacetQueryBuilder();

const urlParams = new URLSearchParams(window.location.search);
const q = urlParams.get('q');
const searchText = urlParams.get('search');

function App() {
    const [searchStateDocument, setSearchStateDocument] = useState((): SearchStateDocument => null);
    const [searchFacetState, setSearchFacetState] = useState((): SearchStateFacet => null);
    const [error, setError] = React.useState('');

    const [expandedFacets, setExpandedFacets] = useState<string[]>([]);

    const eventHandler = new EventHandler(
        currentDocumentsQueryBuilder,
        currentFacetsQueryBuilder,
        setSearchStateDocument,
        setSearchFacetState,
        setExpandedFacets,
        setError,
        wikiContext,
        client
    );

    updateFacetsIfFromQuery(eventHandler);

    const anyFacetSelected = searchFacetState?.query.isAnyPropertySelected()
        || searchStateDocument?.query.isAnyCategorySelected();

    return <WikiContext.Provider value={wikiContext}>
        <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>
                {Tools.reorder([
                    <SortView key={'sortView'}
                              eventHandler={eventHandler}
                    />,
                    <SearchBar key={'searchBar'}
                               searchText={currentDocumentsQueryBuilder.build().searchText}
                               firstRenderRequired={q === null}
                               eventHandler={eventHandler}

                    />,
                    <SaveSearchLink key={'saveSearchLink'}
                                    documentQuery={currentDocumentsQueryBuilder.build()}
                    />
                ], ConfigUtils.calculatePermutation(wikiContext.config.fs2gHeaderControlOrder,
                    ['sortView', 'searchView', 'saveSearchLink']))}

            </div>

            <NamespaceView key={'namespaceView'}
                           searchStateDocument={searchStateDocument}
                           eventHandler={eventHandler}
            />

            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                {Tools.reorder([
                    <Box key={'selectedFacetLabel'}>
                        <Typography>{wikiContext.msg('fs-selected-facets')}</Typography>
                        {anyFacetSelected ? '' :
                            <span id={'fs-no-facet-selected'}>{"(" + wikiContext.msg('fs-no-facets-selected') + ")"}</span> }
                    </Box>,
                    <SelectedFacetsView key={'selectedFacetView'}
                                        client={client}
                                        searchStateDocument={searchStateDocument}
                                        searchStateFacet={searchFacetState}
                                        expandedFacets={expandedFacets}
                                        eventHandler={eventHandler}

                    />,
                    <SelectedCategoriesView key={'selectedCategoryView'}
                                            searchStateDocument={searchStateDocument}
                                            eventHandler={eventHandler}
                    />,
                    <RemoveAllFacetsButton key={'removeAllFacets'}
                                           searchStateFacet={searchFacetState}
                                           eventHandler={eventHandler}
                    />,
                    <Divider key={'divider'}/>,

                    <FacetView key={'facetView'}
                               client={client}
                               searchStateDocument={searchStateDocument}
                               searchStateFacets={searchFacetState}
                               expandedFacets={expandedFacets}
                               eventHandler={eventHandler}
                    />,

                    <CategoryDropdown key={'categoryView'}
                                      documentQuery={currentDocumentsQueryBuilder.build()}
                                      eventHandler={eventHandler}
                    />,
                    <CategoryView key={'categoryDropDown'}
                                  searchStateDocument={searchStateDocument}
                                  eventHandler={eventHandler}
                    />
                ], ConfigUtils.calculatePermutation(wikiContext.config.fs2gFacetControlOrder,
                    ['selectedFacetLabel', 'selectedFacetView', 'selectedCategoryView', 'removeAllFacets', 'divider',
                        'facetView', 'categoryView', 'categoryDropDown']))}
            </div>
            <div id={'fs-results'}>
                <ResultView results={searchStateDocument ? searchStateDocument.documentResponse.docs : []}
                            numResults={searchStateDocument ? searchStateDocument.documentResponse.numResults : 0}
                            eventHandler={eventHandler}
                            client={client}/>
            </div>

            <ErrorView error={error} setError={setError}/>
        </div>
    </WikiContext.Provider>;
}


function applyQueryConstraints() {
    currentDocumentsQueryBuilder.withLimit(wikiContext.config['fs2gHitsPerPage']);
    if (wikiContext.isObjectConfigured('fs2gCategoryFilter')) {
        let firstCategory = wikiContext.getFirstInObject('fs2gCategoryFilter');
        currentDocumentsQueryBuilder.withCategoryFacet(firstCategory);
    }
    if (searchText !== null) {
        currentDocumentsQueryBuilder.withSearchText(searchText);
    }
    if (q !== null) {
        currentDocumentsQueryBuilder.withQueryFromJson(atob(q));
        currentFacetsQueryBuilder.updateBaseQuery(currentDocumentsQueryBuilder.build());
    }
    wikiContext.config.fs2gExtraPropertiesToRequest.forEach((p: any) => {
        currentDocumentsQueryBuilder.withExtraProperty(new Property(p.title, p.type));
    });
}

function updateFacetsIfFromQuery(eventHandler: EventHandler) {
    if (q === null) {
        return;
    }
    // required because facet query is not stored in the URL for length optimization reasons
    // it must be re-created once
    useEffect(() => {
        const propertyFacets = Tools.deepClone(currentDocumentsQueryBuilder.build().propertyFacets);
        eventHandler.onValuesClick(propertyFacets);
    }, [q]);
}

function startApp() {
    applyQueryConstraints();
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);
}

if (isInWikiContext) {
    startApp();
} else {
    client.getSettingsForDevContext().then(result => {
        wikiContext = new WikiContextInterfaceMock(result, globals);
        startApp();
    });
}