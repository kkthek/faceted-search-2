import React, {useContext} from "react";
import EventHandler, {SearchStateDocument} from "../common/event_handler";
import {WikiContext} from "../index";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import FacetWithCount from "./facet_with_count";


function SelectedCategoriesView(prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    let wikiContext = useContext(WikiContext);
    let showCategories = wikiContext.config['fs2gShowCategories'];
    if (!prop.searchStateDocument || !showCategories) return;

    const categories = prop.searchStateDocument.documentResponse.categoryFacetCounts.map((v, i) => {
            let query = prop.searchStateDocument.query;
            let isSelectedFacet = query.isCategoryFacetSelected(v.category);
            if (!isSelectedFacet) return;
            return  <CustomTreeItem key={v.category}
                                    itemId={v.category}
                                    actionIcon={DeleteIcon}
                                    label={<FacetWithCount
                                        displayTitle={v.category}
                                        count={v.count}
                                    />}
                                    action={() => prop.eventHandler.onCategoryRemoveClick(v.category)} />
        }
    );

    return <div id={'fs-selected-categoriesview'}>
        <SimpleTreeView expansionTrigger={'iconContainer'} disableSelection disabledItemsFocusable>
            {categories}
        </SimpleTreeView>
    </div>;
}

export default SelectedCategoriesView;