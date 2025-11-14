import React, {useContext, useEffect, useState} from "react";
import EventHandler from "../../common/event_handler";
import Client from "../../common/client";
import {CategoryNode} from "../../common/datatypes";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import {Typography} from "@mui/material";
import {WikiContext} from "../../index";

function CategoryTree(prop: {
    client: Client,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    if (!wikiContext.config['fs2gShowCategoryTree']) return;
    const [categoryTree, setCategoryTree] = useState<CategoryNode>(null);
    useEffect(() => {
        prop.client.getCategoryTree().then((response) => {
            setCategoryTree(response);
        });
    }, [prop.client]);

    if (!categoryTree) return;

    return <div id={'fs-category-tree'}>
        <Typography>Category Tree</Typography>
        <SimpleTreeView>
            {categoryTree.children.map(node => <CategoryItem key={node.category} node={node}
                                                             eventHandler={prop.eventHandler}/>)}
        </SimpleTreeView>
    </div>
}

function CategoryItem(prop: { node: CategoryNode, eventHandler: EventHandler }) {

    return <CustomTreeItem key={prop.node.category} itemId={prop.node.category}
                           label={prop.node.category}
                           itemAction={() => prop.eventHandler.onCategoryClick(prop.node.category)}>
        {prop.node.children.map(node => <CategoryItem key={node.category} node={node}
                                                      eventHandler={prop.eventHandler}/>)}
    </CustomTreeItem>

}

export default CategoryTree;