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
import CreateArticleLink from "./ui/create_article";
import ConfigUtils from "./util/config_utils";
import {useDebounce} from "./util/custom_hooks";
import Tools from "./util/tools";
import SaveSearchLink from "./ui/save_search_link";
import {WikiContextInterface, WikiContextInterfaceMock} from "./common/wiki_context";
import RemoveAllFacetsButton from "./ui/remove_all_facets_button";

const browserWindow = window as any;
const isInWikiContext = !!browserWindow.mw;
let wikiContext: WikiContextInterface = null;

let solrProxyUrl;
if (isInWikiContext) {
    const wgServer = browserWindow.mw.config.get("wgServer");
    const wgScriptPath = browserWindow.mw.config.get("wgScriptPath");
    solrProxyUrl = wgServer + wgScriptPath + "/rest.php/FacetedSearch2/v1/proxy";
    wikiContext = new WikiContextInterface(
        browserWindow.mw.config.values,
        browserWindow.mw.user.options.values,
        browserWindow.mw.user.getName(),
        browserWindow.mw.msg
    );
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
    const [error, setError] = React.useState('');
    const [searchText, setSearchText] = useState(currentDocumentsQueryBuilder.build().searchText);
    const [expandedFacets, setExpandedFacets] = useState<string[]>([]);

    const eventHandler = new EventHandler(
        currentDocumentsQueryBuilder,
        currentFacetsQueryBuilder,
        setSearchStateDocument,
        setSearchFacetState,
        setError,
        client
    );

    const debouncedSearchValue = useDebounce(searchText, 500);
    useEffect(() => {
        eventHandler.onSearchClick(debouncedSearchValue);
    }, [debouncedSearchValue]);

    let anyFacetSelected = searchFacetState?.query.isAnyPropertySelected()
        || searchStateDocument?.query.isAnyCategorySelected();

    return <WikiContext.Provider value={wikiContext}>
        <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>
                {Tools.reorder([
                    <SortView key={'sortView'}
                              onChange={eventHandler.onSortChange}
                    />,
                    <SearchBar key={'searchBar'}
                               onClick={eventHandler.onSearchClick}
                               textState={[searchText, setSearchText]}
                    />,

                    <CreateArticleLink key={'createArticleLink'} searchText={searchText}/>,
                    <SaveSearchLink key={'saveSearchLink'}
                                    documentQuery={currentDocumentsQueryBuilder.build()}
                                    facetQuery={currentFacetsQueryBuilder.build()}
                    />
                ], ConfigUtils.calculatePermutation(wikiContext.config.fs2gHeaderControlOrder,
                    ['sortView', 'searchView', 'createArticleView', 'saveSearchLink']))}

            </div>

                <NamespaceView key={'namespaceView'} searchStateDocument={searchStateDocument}
                               onNamespaceClick={eventHandler.onNamespaceClick}
                />

            <div id={'fs-facets'} className={'fs-boxes fs-body'}>
                {Tools.reorder([
                    <Box key={'selectedFacetLabel'}>
                        <Typography>{wikiContext.msg('fs-selected-facets')}</Typography>
                        {anyFacetSelected ? '' : "("+wikiContext.msg('fs-no-facets-selected')+")"}
                    </Box>,
                    <SelectedFacetsView key={'selectedFacetView'}
                                        client={client}
                                        searchStateFacet={searchFacetState}
                                        expandedFacets={[expandedFacets, setExpandedFacets]}
                                        eventHandler={eventHandler}

                    />,
                    <SelectedCategoriesView key={'selectedCategoryView'}
                                            searchStateDocument={searchStateDocument}
                                            onCategoryRemove={eventHandler.onCategoryRemoveClick}
                    />,
                    <RemoveAllFacetsButton key={'removeAllFacets'}
                                           searchStateFacet={searchFacetState}
                                           onRemoveAllFacetsClick={eventHandler.onRemoveAllFacetsClick}
                    />,
                    <Divider key={'divider'}/>,

                    <FacetView key={'facetView'}
                               client={client}
                               searchStateDocument={searchStateDocument}
                               searchStateFacets={searchFacetState}
                               expandedFacets={[expandedFacets, setExpandedFacets]}
                               eventHandler={eventHandler}
                    />,

                    <CategoryDropdown key={'categoryView'}
                                      documentQuery={currentDocumentsQueryBuilder.build()}
                                      onCategoryDropDownClick={eventHandler.onCategoryDropDownClick}/>,
                    <CategoryView key={'categoryDropDown'} searchStateDocument={searchStateDocument}
                                  onCategoryClick={eventHandler.onCategoryClick}
                    />
                    ], ConfigUtils.calculatePermutation(wikiContext.config.fs2gFacetControlOrder,
                    ['selectedFacetLabel', 'selectedFacetView', 'selectedCategoryView', 'removeAllFacets', 'divider',
                    'facetView', 'categoryView', 'categoryDropDown']))}
            </div>
            <div id={'fs-results'}>
                <ResultView results={searchStateDocument ? searchStateDocument.documentResponse.docs : []}
                            numResults={searchStateDocument ? searchStateDocument.documentResponse.numResults : 0}
                            onPageIndexClick={eventHandler.onPageIndexClick}
                            client={client}/>
            </div>

            <ErrorView error={error} setError={setError}/>
        </div>
    </WikiContext.Provider>;
}


function applyQueryConstraintsFromConfig() {
    wikiContext.config.fs2gExtraPropertiesToRequest.forEach((p: Property) => {
        currentDocumentsQueryBuilder.withExtraProperty(p);
    });
    currentDocumentsQueryBuilder.withLimit(wikiContext.config['fs2gHitsPerPage']);
    if (wikiContext.isObjectConfigured('fs2gCategoryFilter')) {
        let firstCategory = wikiContext.getFirstInObject('fs2gCategoryFilter');
        currentDocumentsQueryBuilder.withCategoryFacet(firstCategory);
    }
}

function applyQueryConstraintsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    const searchText = urlParams.get('search');
    if (searchText !== null) {
        currentDocumentsQueryBuilder.withSearchText(searchText);
    }

    const dq = urlParams.get('dq');
    const fq = urlParams.get('fq');
    if (dq !== null && fq !== null) {
        currentDocumentsQueryBuilder.withQueryFromJson(dq);
        currentFacetsQueryBuilder.withQueryFromJson(fq);
    }
}

function startApp() {
    applyQueryConstraintsFromConfig();
    applyQueryConstraintsFromURL();
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);
}

if (isInWikiContext) {
    startApp();
} else {
    client.getSettingsForDevContext().then(result => {
        wikiContext = new WikiContextInterfaceMock(result.settings, result.options, result.lang);
        startApp();
    });
}