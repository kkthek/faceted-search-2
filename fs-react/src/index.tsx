/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React, {createContext, useState} from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from "./ui/search-bar/search_bar_view";
import ResultView from "./ui/search-results/result_view";
import Client from "./common/client";
import DocumentQueryBuilder from "./common/document_query_builder";
import FacetView from "./ui/facets/facet_view";
import SelectedFacetsView from "./ui/facets/selected_facets_view";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "./common/event_handler";
import CategoryView from "./ui/search-bar/category_view";
import SelectedCategoriesView from "./ui/facets/selected_categories_view";
import NamespaceView from "./ui/search-bar/namespace_view";
import FacetQueryBuilder from "./common/facet_query_builder";
import SortView from "./ui/search-bar/sort_view";
import {Datatype, Property, PropertyValueQuery, TextFilters} from "./common/datatypes";
import CategoryDropdown from "./ui/search-bar/category_dropdown";
import {Divider, ThemeProvider, Typography} from "@mui/material";
import ErrorView from "./ui/common/error_view";
import SaveSearchLink from "./ui/search-bar/save_search_link";
import {WikiContextInterface, WikiContextInterfaceMock} from "./common/wiki_context";
import RemoveAllFacetsButton from "./ui/facets/remove_all_facets_button";
import "./util/array_ext";
import TagCloudFacet from "./ui/facets/tag_cloud";
import CategoryTree from "./ui/facets/category_tree";
import DEFAULT_THEME from "./custom_ui/theme";
import SelectedFacetsHeader from "./ui/facets/selected_facets_header";

const browserWindow = window as any;
const isInWikiContext = !!browserWindow.mw;
let wikiContext: WikiContextInterface = null;

let solrProxyUrl: string;
let globals: any = {};

if (isInWikiContext) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    globals.mwApiUrl = wgServer + wgScriptPath + "/api.php";
    globals.mwRestUrl = wgServer + wgScriptPath + "/rest.php";
    solrProxyUrl = globals.mwRestUrl + "/FacetedSearch2/v1/proxy";
    wikiContext = new WikiContextInterface(
        browserWindow.mw.config.values,
        browserWindow.mw.user.options.values,
        browserWindow.mw.user.getName(),
        browserWindow.mw.msg,
        globals
    );
} else {
    solrProxyUrl = "http://localhost:9000";
    globals.mwRestUrl = solrProxyUrl;
    globals.mwApiUrl = solrProxyUrl + '/api.php';
}

const client: Client = new Client(solrProxyUrl);
export const WikiContext = createContext<WikiContextInterface>(null);

const currentDocumentsQueryBuilder = new DocumentQueryBuilder();
const currentFacetsQueryBuilder = new FacetQueryBuilder();

const urlParams = new URLSearchParams(window.location.search);
const q = urlParams.get('q');
const searchText = urlParams.get('search');


function App() {
    const [searchStateDocument, setSearchStateDocument] = useState((): SearchStateDocument => null);
    const [searchFacetState, setSearchFacetState] = useState((): SearchStateFacet => null);
    const [expandedFacets, setExpandedFacets] = useState<string[]>([]);
    const [textFilters, setTextFilters] = useState<TextFilters>({});
    const [error, setError] = useState('');

    const eventHandler = new EventHandler(
        currentDocumentsQueryBuilder,
        currentFacetsQueryBuilder,
        setSearchStateDocument,
        setSearchFacetState,
        setExpandedFacets,
        setError,
        setTextFilters,
        wikiContext,
        client
    );

    const headerControlsOrder = wikiContext.config.fs2gHeaderControlOrder.calculatePermutation(
        ['sortView', 'searchView', 'saveSearchLink', 'categoryDropDown']
    );
    const facetControlsOrder = wikiContext.config.fs2gFacetControlOrder.calculatePermutation(
        ['selectedFacetLabel', 'selectedFacetView', 'selectedCategoryView', 'removeAllFacets', 'divider',
            'facetView', 'categoryLabel', 'categoryDropDown', 'categoryView', 'categoryTree']);

    const currentDocumentQuery = currentDocumentsQueryBuilder.build();
    return <WikiContext.Provider value={wikiContext}>
        <ThemeProvider theme={DEFAULT_THEME}>
        <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>
                {[
                    <SortView key={'sortView'}
                              eventHandler={eventHandler}
                    />,
                    <SearchBar key={'searchBar'}
                               searchText={currentDocumentQuery.searchText}
                               restoreFromQuery={q !== null}
                               eventHandler={eventHandler}
                               query={currentDocumentQuery}

                    />,
                    <SaveSearchLink key={'saveSearchLink'}
                                    documentQuery={currentDocumentQuery}
                    />,
                    <CategoryDropdown key={'categoryView'}
                                      documentQuery={currentDocumentQuery}
                                      eventHandler={eventHandler}
                    />
                ].reorder(headerControlsOrder)}

            </div>

            <NamespaceView key={'namespaceView'}
                           searchStateDocument={searchStateDocument}
                           eventHandler={eventHandler}
            />

            <TagCloudFacet key={'tagCloud'}
                           searchStateFacets={searchFacetState}
                           eventHandler={eventHandler}
                           textFilters={textFilters}
            />

            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                {[
                    <SelectedFacetsHeader searchFacetState={searchFacetState}/>,

                    <SelectedFacetsView key={'selectedFacetView'}
                                        client={client}
                                        searchStateDocument={searchStateDocument}
                                        searchStateFacet={searchFacetState}
                                        expandedFacets={expandedFacets}
                                        eventHandler={eventHandler}
                                        textFilters={textFilters}

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
                               textFilters={textFilters}
                    />,
                    <Typography key={'fs-available-categories'}
                                variant={"subtitle1"}>{wikiContext.msg('fs-available-categories')}</Typography>,
                    <CategoryDropdown key={'categoryDropDown'}
                                      documentQuery={currentDocumentQuery}
                                      eventHandler={eventHandler}
                    />,
                    <CategoryView key={'categoryView'}
                                  searchStateDocument={searchStateDocument}
                                  eventHandler={eventHandler}
                    />,
                    <CategoryTree key={'categoryTree'}
                                  client={client}
                                  searchStateDocument={searchStateDocument}
                                  textFilters={textFilters}
                                  eventHandler={eventHandler}
                    />
                ].reorder(facetControlsOrder)}
            </div>
            <div id={'fs-results'}>
                <ResultView results={searchStateDocument?.documentResponse.docs ?? []}
                            numResults={searchStateDocument?.documentResponse.numResults ?? 0}
                            pageOffset={currentDocumentQuery.offset}
                            eventHandler={eventHandler}
                            client={client}/>
            </div>

            <ErrorView error={error} setError={setError}/>
        </div>
        </ThemeProvider>
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
    if (wikiContext.config.fs2gTagCloudProperty) {
        currentFacetsQueryBuilder.withPropertyValueQuery(PropertyValueQuery.forAllValues(
            new Property(wikiContext.config.fs2gTagCloudProperty, Datatype.string),
            wikiContext.config.fs2gFacetValueLimit
        ));
    }
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