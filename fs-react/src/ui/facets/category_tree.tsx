import React, {useContext, useEffect, useState} from "react";


import {SimpleTreeView} from "@mui/x-tree-view";
import {Box, Typography} from "@mui/material";
import {SearchStateDocument} from "app/common/datatypes";
import Client from "app/common/client";
import EventHandler from "app/common/event_handler";
import {TYPING_DELAY, WikiContext} from "app/index";
import {CategoryNode} from "app/common/response/category_node";
import {useDebounce} from "app/custom_ui/custom_hooks";
import CategoryTreeFilter from "app/ui/facets/category_tree_filter";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import FacetWithCount from "app/ui/common/facet_with_count";


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

    return <Box id={'fs-category-tree'}>
        <Typography variant={"subtitle1"}>{wikiContext.msg('fs-category-tree')}</Typography>
        <CategoryTreeFilter filterText={filterText}
                            setFilterText={setFilterText}
        />
        <SimpleTreeView expandedItems={expandedFacets}
                        disableSelection
                        disabledItemsFocusable
                        onItemExpansionToggle={handleItemExpansionToggle}
        >
            {filteredTree.children.map(node => <CategoryItem key={node.getItemId()}
                                                             node={node}
                                                             searchStateDocument={prop.searchStateDocument}
                                                             eventHandler={prop.eventHandler}/>)}
        </SimpleTreeView>
    </Box>
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

    const itemId = prop.node.getItemId();
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