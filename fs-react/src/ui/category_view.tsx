import {CategoryFacetCount} from "../common/datatypes";
import React, {useContext} from "react";
import {SearchStateDocument} from "./event_handler";
import {WikiContext} from "../index";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import {SimpleTreeView} from "@mui/x-tree-view";

function FacetViewCategory( prop: {
    title: string,
    categoryFacetCount: CategoryFacetCount|null,
    selectedCategories: string[],
    onCategoryClick: (c: string)=>void,
}) {
    let isSelectedFacet = prop.selectedCategories.indexOf(prop.categoryFacetCount.category) > -1;
    if (isSelectedFacet) {
        return;
    }
    let title = prop.categoryFacetCount.displayTitle != '' ? prop.categoryFacetCount.displayTitle : prop.title;
    let count = prop.categoryFacetCount?.count;
    return <CustomTreeItem itemId={prop.categoryFacetCount.category}
                           label={title + " (" + count + ")"}
                           onClick={() => prop.onCategoryClick(prop.title)}
                     className={'fs-facets'}>

    </CustomTreeItem>
}
function CategoryView( prop: {
    searchStateDocument: SearchStateDocument,
    onCategoryClick: (c: string)=>void,

}) {
    let wikiContext = useContext(WikiContext);
    let showCategories = wikiContext.config['fs2gShowCategories'];
    let shownCategoryFacets = wikiContext.config['fs2gShownCategoryFacets'];
    if (!prop.searchStateDocument || !showCategories) return;

    const categoryFacetCounts = prop.searchStateDocument.documentResponse.categoryFacetCounts;

    const listItems = categoryFacetCounts
        .filter((facetCount) => shownCategoryFacets.includes(facetCount.category) || shownCategoryFacets.length === 0)
        .map((facetCount,i) => {

            return <FacetViewCategory key={facetCount.category}
                                      title={facetCount.category}
                                      categoryFacetCount={facetCount}
                                      onCategoryClick={prop.onCategoryClick}
                                      selectedCategories={prop.searchStateDocument.query.categoryFacets}
            />
        }
    );
    return <div id={'fs-categoryview'}>
        <h3>Available categories</h3>
        <SimpleTreeView expansionTrigger={'iconContainer'} disableSelection disabledItemsFocusable>
            {listItems}
        </SimpleTreeView>
    </div>;
}

export default CategoryView;