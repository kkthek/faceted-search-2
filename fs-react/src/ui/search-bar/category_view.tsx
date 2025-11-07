import {CategoryFacetCount} from "../../common/datatypes";
import React, {useContext} from "react";
import EventHandler, {SearchStateDocument} from "../../common/event_handler";
import {WikiContext} from "../../index";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import {SimpleTreeView} from "@mui/x-tree-view";
import {Box, Typography} from "@mui/material";
import ConfigUtils from "../../util/config_utils";
import FacetWithCount from "../common/facet_with_count";

function FacetViewCategory( prop: {
    categoryTitle: string,
    categoryFacetCount: CategoryFacetCount|null,
    selectedCategories: string[],
    eventHandler: EventHandler
}) {

    let displayTitle= prop.categoryFacetCount.displayTitle;
    if (displayTitle === '') {
        displayTitle = prop.categoryTitle;
    }
    const count = prop.categoryFacetCount.count;
    return <CustomTreeItem itemId={prop.categoryFacetCount.category}
                           label={<FacetWithCount displayTitle={displayTitle} count={count}/>}
                           onClick={() => prop.eventHandler.onCategoryClick(prop.categoryTitle)}
                     className={'fs-facets'}>

    </CustomTreeItem>
}
function CategoryView( prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler

}) {
    const wikiContext = useContext(WikiContext);
    const showCategories = wikiContext.config['fs2gShowCategories'];
    const shownCategoryFacets = wikiContext.config['fs2gShownCategoryFacets'];
    const useCategoryDropdown = wikiContext.isObjectConfigured('fs2gCategoryFilter');
    if (useCategoryDropdown) return;
    if (!prop.searchStateDocument || !showCategories) return;

    const categoryFacetCounts = prop.searchStateDocument.documentResponse.categoryFacetCounts;
    const selectedCategoryFacets = prop.searchStateDocument.query.categoryFacets;

    const listItems = categoryFacetCounts
        .filter((facetCount) => shownCategoryFacets.containsOrEmpty(facetCount.category))
        .filter((facetCount) => !selectedCategoryFacets.includes(facetCount.category))
        .sort(ConfigUtils.getSortFunctionForCategoryFacets(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount,i) => {

            return <FacetViewCategory key={facetCount.category}
                                      categoryTitle={facetCount.category}
                                      categoryFacetCount={facetCount}
                                      eventHandler={prop.eventHandler}
                                      selectedCategories={selectedCategoryFacets}
            />
        }
    );

    let noCategoriesItem;
    if (listItems.length === 0) {
        noCategoriesItem =  <CustomTreeItem itemId={'none'} label={<FacetWithCount displayTitle={'none'}/>}></CustomTreeItem>;
    }

    return <Box id={'fs-category-view'}>
        <SimpleTreeView expansionTrigger={'iconContainer'}
                        disableSelection
                        disabledItemsFocusable
        >
            {listItems}
            {noCategoriesItem}
        </SimpleTreeView>
    </Box>;
}

export default CategoryView;