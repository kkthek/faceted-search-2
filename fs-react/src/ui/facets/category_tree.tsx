import React, {useContext, useEffect, useState} from "react";
import EventHandler, {SearchStateDocument} from "../../common/event_handler";
import Client from "../../common/client";
import {CategoryNode} from "../../common/datatypes";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import {Typography} from "@mui/material";
import {WikiContext} from "../../index";
import CategoryTreeFilter from "./category_tree_filter";
import FacetWithCount from "../common/facet_with_count";

function CategoryTree(prop: {
    client: Client,
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    if (!wikiContext.config['fs2gShowCategoryTree']) return;

    const [categoryTree, setCategoryTree] = useState<[CategoryNode, CategoryNode]>([null, null]);

    useEffect(() => {
        (async function fetchData() {
            const response = await prop.client.getCategoryTree();
            let tree = response.createParentReferences();
            setCategoryTree([tree, tree]);
        }());
    }, [prop.client]);

    const [filteredTree, fullTree] = categoryTree;
    if (!filteredTree) return;

    return <div id={'fs-category-tree'}>
        <Typography>Category Tree</Typography>
        <CategoryTreeFilter setCategoryTree={setCategoryTree} treeState={categoryTree} />
        <SimpleTreeView>
            {filteredTree.children.map(node => <CategoryItem key={node.category + node.parent.category}
                                                             node={node}
                                                             searchStateDocument={prop.searchStateDocument}
                                                             eventHandler={prop.eventHandler}/>)}
        </SimpleTreeView>
    </div>
}

function CategoryItem(prop: {
    node: CategoryNode,
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {

    const categoryFacetCount = prop.searchStateDocument?.documentResponse.categoryFacetCounts
        .find(v => v.category === prop.node.category);

    return <CustomTreeItem key={prop.node.category + prop.node.parent.category}
                           itemId={prop.node.category}
                           label={<FacetWithCount displayTitle={prop.node.displayTitle ?? prop.node.category}
                               count={categoryFacetCount?.count}
                           />}
                           itemAction={() => prop.eventHandler.onCategoryClick(prop.node.category)}>
        {prop.node.children.map(node => <CategoryItem key={node.category + node.parent.category}
                                                      node={node}
                                                      searchStateDocument={prop.searchStateDocument}
                                                      eventHandler={prop.eventHandler}/>)}
    </CustomTreeItem>

}

export default CategoryTree;