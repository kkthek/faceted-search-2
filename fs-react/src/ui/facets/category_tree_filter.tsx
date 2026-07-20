import React, {Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useMemo, useState} from "react";
import {SearchStateDocument, TextFilters} from "../../common/datatypes";
import {useDebounce} from "../../custom_ui/custom_hooks";
import EventHandler from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";
import {TextField} from "@mui/material";
import {TYPING_DELAY, WikiContext} from "../../index";
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
    const globalFilterText = prop.textFilters['category_tree'] ?? '';
    const [localFilterText, setLocalFilterText] = useState(globalFilterText);
    const debouncedSearchValue = useDebounce(localFilterText, TYPING_DELAY);
    const filteredTree = useMemo(() => {
        return fullTree
            .filterForCategories(categories)
            .filterForText(localFilterText);
    }, [categories, localFilterText]);

    useEffect(() => {
        if (!prop.treeState) return;
        prop.setCategoryTree([filteredTree, fullTree]);
        setGlobalFilter(debouncedSearchValue)
    }, [debouncedSearchValue]);

    useEffect(() => {
        setLocalFilterText(globalFilterText);
    }, [globalFilterText]);

    if (!prop.treeState) return;

    const onKeyDown = function (e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Escape") {
            setGlobalFilter('');
        }
        e.stopPropagation();
    }

    const setGlobalFilter = function (text: string): void {
        const f = ObjectTools.deepClone(prop.textFilters);
        f['category_tree'] = text;
        prop.eventHandler.setTextFilters(f);
    }

    const onChange = function (text: string): void {
        setLocalFilterText(text);
    }

    return <TextField id={'category-tree-filter-input'}
                      placeholder={wikiContext.msg('fs-filter-category-tree')}
                      sx={{marginTop: '5px', marginBottom: '5px'}}
                      size={'small'}
                      variant="standard"
                      value={localFilterText}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyDown={onKeyDown}
    />;

}

export default CategoryTreeFilter;