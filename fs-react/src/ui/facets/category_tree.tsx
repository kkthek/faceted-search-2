import React, {useContext, useEffect, useState} from "react";
import EventHandler from "../../common/event_handler";
import Client from "../../common/client";
import {SearchStateDocument} from "../../common/datatypes";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import {Typography} from "@mui/material";
import {TYPING_DELAY, WikiContext} from "../../index";
import CategoryTreeFilter from "./category_tree_filter";
import FacetWithCount from "../common/facet_with_count";
import {CategoryNode} from "../../common/response/category_node";
import {useDebounce} from "../../custom_ui/custom_hooks";


function CategoryTree(prop: {
    client: Client,
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    if (!wikiContext.config['fs2gShowCategoryTree']) return;

    const [categoryTree, setCategoryTree] = useState<[CategoryNode, CategoryNode]>([null, null]);
    const [expandedFacets, setExpandedFacets] = useState<string[]>([]);
    const [filterText, setFilterText] = useState('');
    const debouncedFilterText = useDebounce(filterText, TYPING_DELAY);
    const categories = prop.searchStateDocument?.documentResponse.getCategoriesFromFacetCounts() ?? [];

    useEffect(() => {

        const [filteredTree, fullTree] = categoryTree;
        if (!filteredTree) {
            (async function fetchCategoryTree() {
                const response = await prop.client.getCategoryTree();
                const tree = response.createParentReferences();
                setCategoryTree([tree, tree]);
                setExpandedFacets(tree.getNodeItemIds());
            }());
        } else {

            const newFilteredTree = fullTree
                .filterForCategories(categories)
                .filterForText(debouncedFilterText);
            setCategoryTree([newFilteredTree, fullTree]);
            setExpandedFacets(newFilteredTree.getNodeItemIds());

        }
    }, [JSON.stringify(categories), debouncedFilterText]);

    const [filteredTree] = categoryTree;
    if (!filteredTree) return;

    const handleItemExpansionToggle = (
        event: React.SyntheticEvent | null,
        itemId: string,
        isExpanded: boolean,
    ) => {

        if (isExpanded) {
            setExpandedFacets([...expandedFacets, itemId]);
        } else {
            setExpandedFacets(expandedFacets.filter(id => id !== itemId));
        }

    };

    return <div id={'fs-category-tree'}>
        <Typography variant={"subtitle1"}>{wikiContext.msg('fs-category-tree')}</Typography>
        <CategoryTreeFilter filterText={filterText}
                            setFilterText={setFilterText}
        />
        <SimpleTreeView expandedItems={expandedFacets}
                        disableSelection
                        disabledItemsFocusable
                        onItemExpansionToggle={handleItemExpansionToggle}
        >
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

    if (!prop.searchStateDocument) {
        return;
    }
    const documentResponse = prop.searchStateDocument.documentResponse;
    const categoryFacetCount = documentResponse.getCategoryFacetCount(prop.node.category);

    let itemId = prop.node.getItemId();
    return <CustomTreeItem key={itemId}
                           itemId={itemId}
                           label={<FacetWithCount displayTitle={prop.node.displayTitle ?? prop.node.category}
                           count={categoryFacetCount?.count}/>}
                           itemAction={() => prop.eventHandler.onCategoryClick(prop.node.category)}>
        {prop.node.children.map(node => <CategoryItem key={node.getItemId()}
                                                      node={node}
                                                      searchStateDocument={prop.searchStateDocument}
                                                      eventHandler={prop.eventHandler}/>)}
    </CustomTreeItem>

}

export default CategoryTree;