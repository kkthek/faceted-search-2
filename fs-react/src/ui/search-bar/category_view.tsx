import React, {useContext} from "react";
import {SimpleTreeView} from "@mui/x-tree-view";
import {Box, Typography} from "@mui/material";
import {CategoryFacetCount} from "app/common/response/category_facet_count";
import EventHandler from "app/common/event_handler";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import FacetWithCount from "app/ui/common/facet_with_count";
import {SearchStateDocument} from "app/common/datatypes";
import {WikiContext} from "app/index";
import ConfigUtils from "app/util/config_utils";

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
    showLabel: boolean
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
        .sort(ConfigUtils.getSortFunction(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount) => {

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
        noCategoriesItem =  <CustomTreeItem itemId={'none'} label={<FacetWithCount displayTitle={wikiContext.msg('fs-none')}/>}></CustomTreeItem>;
    }

    return <Box id={'fs-category-view'}>
        {prop.showLabel ? <Typography key={'fs-available-categories'}
                    variant={"subtitle1"}>{wikiContext.msg('fs-available-categories')}
        </Typography> : ''}
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