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
import DocumentQueryBuilder from "./common/query_builders/document_query_builder";
import FacetView from "./ui/facets/facet_view";
import SelectedFacetsView from "./ui/facets/selected_facets_view";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "./common/event_handler";
import CategoryView from "./ui/search-bar/category_view";
import SelectedCategoriesView from "./ui/facets/selected_categories_view";
import NamespaceView from "./ui/search-bar/namespace_view";
import FacetQueryBuilder from "./common/query_builders/facet_query_builder";
import SortView from "./ui/search-bar/sort_view";
import {TextFilters} from "./common/datatypes";
import CategoryDropdown from "./ui/search-bar/category_dropdown";
import {Divider, ThemeProvider, Typography} from "@mui/material";
import ErrorView from "./ui/common/error_view";
import SaveSearchLink from "./ui/search-bar/save_search_link";
import {WikiContextAccessor} from "./common/wiki_context";
import RemoveAllFacetsButton from "./ui/facets/remove_all_facets_button";
import "./util/array_ext";
import TagCloudFacet from "./ui/facets/tag_cloud";
import CategoryTree from "./ui/facets/category_tree";
import DEFAULT_THEME from "./custom_ui/theme";
import SelectedFacetsHeader from "./ui/facets/selected_facets_header";
import {Property} from "./common/property";
import {ErrorBoundary} from "react-error-boundary";
import ErrorComponent from "./ui/common/error_component";
import {BarLoader} from "react-spinners";
import Box from "@mui/material/Box";
import Loader from "./util/loader";
import QueryUtils from "./util/query_utils";
import {initializeDevContext} from "./util/dev_context";

const browserWindow = window as any;
const isInWikiContext = !!browserWindow.mw;
let wikiContext: WikiContextAccessor = null;
let client: Client = null;

export const WikiContext = createContext<WikiContextAccessor>(null);

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
    const [loadPromise, setLoadPromise] = useState<Promise<any>>(null);

    const eventHandler = new EventHandler(
        currentDocumentsQueryBuilder,
        currentFacetsQueryBuilder,
        setSearchStateDocument,
        setSearchFacetState,
        setExpandedFacets,
        setError,
        setTextFilters,
        setLoadPromise,
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
        <Box id={'fs-content'}>
            <Box height={'5px'} width={'100%'}>
                <Loader loadPromise={loadPromise} loaderComponent={<BarLoader width={'100%'} />}/>
            </Box>
            <Box id={'fs-header'} className={'fs-boxes'}>
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

            </Box>

            <NamespaceView key={'namespaceView'}
                           searchStateDocument={searchStateDocument}
                           eventHandler={eventHandler}
            />

            <TagCloudFacet key={'tagCloud'}
                           searchStateFacets={searchFacetState}
                           eventHandler={eventHandler}
                           textFilters={textFilters}
            />

            <Box id={'fs-facets'} className={'fs-boxes fs-body'}>
                {[
                    <SelectedFacetsHeader key={'selectedFacetHeader'} query={currentDocumentQuery}/>,

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
                                           query={currentDocumentQuery}
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
                                variant={"subtitle1"}>{wikiContext.msg('fs-available-categories')}
                    </Typography>,
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
            </Box>
            <Box id={'fs-results'}>
                <ResultView results={searchStateDocument?.documentResponse.docs ?? []}
                            numResults={searchStateDocument?.documentResponse.numResults ?? 0}
                            pageOffset={currentDocumentQuery.offset}
                            eventHandler={eventHandler}
                            client={client}/>
            </Box>
            <ErrorView error={error} setError={setError}/>
        </Box>
        </ThemeProvider>
    </WikiContext.Provider>;
}


function applyQueryConstraints() {
    currentDocumentsQueryBuilder.withLimit(wikiContext.config['fs2gHitsPerPage']);
    if (wikiContext.isObjectConfigured('fs2gCategoryFilter')) {
        const firstCategory = wikiContext.getFirstInObject('fs2gCategoryFilter');
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

    currentFacetsQueryBuilder.withPropertyValueQuery(QueryUtils.prepareTagCloudValueQuery(wikiContext));
}

function render(children: React.ReactNode) {
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(children);
}

function startApp(params: {
    client: Client,
    wikiContext: WikiContextAccessor
}) {
    client = params.client;
    wikiContext = params.wikiContext;
    applyQueryConstraints();
    render(<ErrorBoundary FallbackComponent={ErrorComponent}>
            <App/>
    </ErrorBoundary>);
}

if (isInWikiContext) {
    const accessor = WikiContextAccessor.fromMWConfig(browserWindow.mw);
    const wikiClient = new Client(accessor.getSolrProxyUrl());

    startApp({
        wikiContext: accessor,
        client: wikiClient,
    });
} else {
    initializeDevContext()
        .then(startApp)
        .catch((e) => render(<ErrorComponent error={e}/>));
}