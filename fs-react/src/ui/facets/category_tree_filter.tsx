import React, {Dispatch, KeyboardEvent, SetStateAction, useEffect, useState} from "react";
import {CategoryNode, TextFilters} from "../../common/datatypes";
import {useDebounce} from "../../util/custom_hooks";
import EventHandler, {SearchStateDocument} from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";

function CategoryTreeFilter(prop : {
    setCategoryTree: Dispatch<SetStateAction<[CategoryNode, CategoryNode]>>,
    treeState: [CategoryNode, CategoryNode],
    searchStateDocument: SearchStateDocument,
    textFilters: TextFilters,
    eventHandler: EventHandler
}) {

    const [filteredTree, fullTree] = prop.treeState;
    const categories = prop.searchStateDocument?.documentResponse
        .categoryFacetCounts.map(cfc => cfc.category) ?? [];
    let text = prop.textFilters['category_tree'] ?? '';
    const debouncedSearchValue = useDebounce(text, 500);
    useEffect(() => {
        if (!prop.treeState) return;
        const filteredTree = fullTree
            .filterForCategories(categories)
            .filterForText(text);
        prop.setCategoryTree([ filteredTree, fullTree ]);
    }, [debouncedSearchValue]);

    if (!prop.treeState) return;

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.setCategoryTree([ fullTree.filterForText(text), fullTree ]);
        }
        e.stopPropagation();
    }
    return <input type={'text'}

    id={'category-tree-filter-input'}
    placeholder={'Filter...'}
    value={text}
    onChange={(e) => {
        const f = ObjectTools.deepClone(prop.textFilters);
        f['category_tree'] = e.target.value;
        prop.eventHandler.setTextFilters(f);
    }}
    onKeyDown={onKeyDown}
    />;

}
export default CategoryTreeFilter;