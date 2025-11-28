import React, {Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useState} from "react";
import {CategoryNode, TextFilters} from "../../common/datatypes";
import {useDebounce} from "../../util/custom_hooks";
import EventHandler, {SearchStateDocument} from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";
import {TextField} from "@mui/material";
import {WikiContext} from "../../index";

function CategoryTreeFilter(prop: {
    setCategoryTree: Dispatch<SetStateAction<[CategoryNode, CategoryNode]>>,
    treeState: [CategoryNode, CategoryNode],
    searchStateDocument: SearchStateDocument,
    textFilters: TextFilters,
    eventHandler: EventHandler
}) {

    const wikiContext = useContext(WikiContext);
    const [filteredTree, fullTree] = prop.treeState;
    const categories = prop.searchStateDocument?.documentResponse
        .categoryFacetCounts.map(cfc => cfc.category) ?? [];
    const text = prop.textFilters['category_tree'] ?? '';
    const debouncedSearchValue = useDebounce(text, 500);
    useEffect(() => {
        if (!prop.treeState) return;
        const filteredTree = fullTree
            .filterForCategories(categories)
            .filterForText(text);
        prop.setCategoryTree([filteredTree, fullTree]);
    }, [debouncedSearchValue]);

    if (!prop.treeState) return;

    const onKeyDown = function (e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.setCategoryTree([fullTree.filterForText(text), fullTree]);
        } else if (e.key === "Escape") {
            setFilter('');
        }
        e.stopPropagation();
    }

    const setFilter = function (text: string): void {
        const f = ObjectTools.deepClone(prop.textFilters);
        f['category_tree'] = text;
        prop.eventHandler.setTextFilters(f);
    }

    return <TextField id={'category-tree-filter-input'}
                      placeholder={wikiContext.msg('fs-filter-category-tree')}
                      size={'small'}
                      variant="standard"
                      value={text}
                      onChange={(e) => setFilter(e.target.value)}
                      onKeyDown={onKeyDown}
    />;

}

export default CategoryTreeFilter;