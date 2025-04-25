import React, {useContext} from "react";
import {SearchStateDocument} from "./event_handler";
import {WikiContext} from "../index";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";


function SelectedCategoriesView(prop: {
    searchStateDocument: SearchStateDocument,
    onCategoryRemove: (c: string) => void
}) {
    let wikiContext = useContext(WikiContext);
    let showCategories = wikiContext.config['fs2gShowCategories'];
    if (!prop.searchStateDocument || !showCategories) return;

    const categories = prop.searchStateDocument.documentResponse.categoryFacetCounts.map((v, i) => {
            let query = prop.searchStateDocument.query;
            let isSelectedFacet = query.isCategoryFacetSelected(v.category);
            if (!isSelectedFacet) return;
            return  <CustomTreeItem itemId={v.category}
                                    actionIcon={DeleteIcon}
                                    label={v.category}
                                    action={() => prop.onCategoryRemove(v.category)} />
        }
    );

    return <div id={'fs-selected-categoriesview'}>
        <SimpleTreeView expansionTrigger={'iconContainer'} disableSelection disabledItemsFocusable>
            {categories}
        </SimpleTreeView>
    </div>;
}

export default SelectedCategoriesView;