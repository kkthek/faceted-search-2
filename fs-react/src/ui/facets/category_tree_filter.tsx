import React, {Dispatch, KeyboardEvent, SetStateAction, useEffect, useState} from "react";
import {CategoryNode} from "../../common/datatypes";
import {useDebounce} from "../../util/custom_hooks";
import {SearchStateDocument} from "../../common/event_handler";

function CategoryTreeFilter(prop : {
    setCategoryTree: Dispatch<SetStateAction<[CategoryNode, CategoryNode]>>,
    treeState: [CategoryNode, CategoryNode],
    searchStateDocument: SearchStateDocument
}) {

    const [text, setText] = useState((): string => '');
    const [filteredTree, fullTree] = prop.treeState;
    const categories = prop.searchStateDocument?.documentResponse
        .categoryFacetCounts.map(cfc => cfc.category) ?? [];

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
    onChange={(e) => setText(e.target.value)}
    onKeyDown={onKeyDown}
    />;

}
export default CategoryTreeFilter;