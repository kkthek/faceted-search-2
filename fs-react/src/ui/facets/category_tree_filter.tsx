import React, {Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useMemo} from "react";
import {TextFilters} from "../../common/datatypes";
import {useDebounce} from "../../custom_ui/custom_hooks";
import EventHandler, {SearchStateDocument} from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";
import {TextField} from "@mui/material";
import {WikiContext} from "../../index";
import {CategoryNode} from "../../common/response/category_node";

function CategoryTreeFilter(prop: {
    setCategoryTree: Dispatch<SetStateAction<[CategoryNode, CategoryNode]>>,
    treeState: [CategoryNode, CategoryNode],
    searchStateDocument: SearchStateDocument,
    textFilters: TextFilters,
    eventHandler: EventHandler
}) {

    const wikiContext = useContext(WikiContext);
    const [, fullTree] = prop.treeState;
    const categories = prop.searchStateDocument?.documentResponse
        .categoryFacetCounts.map(cfc => cfc.category) ?? [];
    const text = prop.textFilters['category_tree'] ?? '';
    const debouncedSearchValue = useDebounce(text, 500);
    const filteredTree = useMemo(() => {
        return fullTree
            .filterForCategories(categories)
            .filterForText(text);
    }, [categories, text]);

    useEffect(() => {
        if (!prop.treeState) return;
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
                      sx={{marginTop: '5px', marginBottom: '5px'}}
                      size={'small'}
                      variant="standard"
                      value={text}
                      onChange={(e) => setFilter(e.target.value)}
                      onKeyDown={onKeyDown}
    />;

}

export default CategoryTreeFilter;