import React, {useContext} from "react";
import {SimpleTreeView} from "@mui/x-tree-view";
import DeleteIcon from "@mui/icons-material/Delete";
import {SearchStateDocument} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import FacetWithCount from "app/ui/common/facet_with_count";


function SelectedCategoriesView(prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    const showCategories = wikiContext.config['fs2gShowCategories'];
    if (!prop.searchStateDocument || !showCategories) return;

    const query = prop.searchStateDocument.query;
    const categoryFacetCounts = prop.searchStateDocument.documentResponse.categoryFacetCounts;
    const categoryTreeItems = categoryFacetCounts.map((v) => {
            const isSelectedFacet = query.isCategoryFacetSelected(v.category);
            if (!isSelectedFacet) return;
            return  <CustomTreeItem key={v.category}
                                    itemId={v.category}
                                    actionIcon={DeleteIcon}
                                    label={<FacetWithCount displayTitle={v.displayTitle} count={v.count} />}
                                    action={() => prop.eventHandler.onCategoryRemoveClick(v.category)} />
        }
    );

    return <div id={'fs-selected-categoriesview'}>
        <SimpleTreeView expansionTrigger={'iconContainer'} disableSelection disabledItemsFocusable>
            {categoryTreeItems}
        </SimpleTreeView>
    </div>;
}

export default SelectedCategoriesView;