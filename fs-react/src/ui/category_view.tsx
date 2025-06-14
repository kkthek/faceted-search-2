import {CategoryFacetCount} from "../common/datatypes";
import React, {useContext} from "react";
import EventHandler, {SearchStateDocument} from "../common/event_handler";
import {WikiContext} from "../index";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import {SimpleTreeView} from "@mui/x-tree-view";
import {Box, Typography} from "@mui/material";
import ConfigUtils from "../util/config_utils";

function FacetViewCategory( prop: {
    title: string,
    categoryFacetCount: CategoryFacetCount|null,
    selectedCategories: string[],
    eventHandler: EventHandler
}) {

    let title = prop.categoryFacetCount.displayTitle != '' ? prop.categoryFacetCount.displayTitle : prop.title;
    let count = prop.categoryFacetCount?.count;
    return <CustomTreeItem itemId={prop.categoryFacetCount.category}
                           label={title + " (" + count + ")"}
                           onClick={() => prop.eventHandler.onCategoryClick(prop.title)}
                     className={'fs-facets'}>

    </CustomTreeItem>
}
function CategoryView( prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler

}) {
    let wikiContext = useContext(WikiContext);
    let showCategories = wikiContext.config['fs2gShowCategories'];
    let shownCategoryFacets = wikiContext.config['fs2gShownCategoryFacets'];
    let useCategoryDropdown = wikiContext.isObjectConfigured('fs2gCategoryFilter');
    if (useCategoryDropdown) return;
    if (!prop.searchStateDocument || !showCategories) return;

    const categoryFacetCounts = prop.searchStateDocument.documentResponse.categoryFacetCounts;

    const listItems = categoryFacetCounts
        .filter((facetCount) => shownCategoryFacets.includes(facetCount.category) || shownCategoryFacets.length === 0)
        .filter((facetCount) => !prop.searchStateDocument.query.categoryFacets.includes(facetCount.category))
        .sort(ConfigUtils.getSortFunctionForCategoryFacets(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount,i) => {

            return <FacetViewCategory key={facetCount.category}
                                      title={facetCount.category}
                                      categoryFacetCount={facetCount}
                                      eventHandler={prop.eventHandler}
                                      selectedCategories={prop.searchStateDocument.query.categoryFacets}
            />
        }
    );

    return <Box id={'fs-category-view'}>
        <Typography>{wikiContext.msg('fs-available-categories')}</Typography>
        <SimpleTreeView expansionTrigger={'iconContainer'} disableSelection disabledItemsFocusable>
            {listItems}
            {listItems.length === 0 ? <CustomTreeItem itemId={'none'} label={'none'}></CustomTreeItem>: ''}
        </SimpleTreeView>
    </Box>;
}

export default CategoryView;