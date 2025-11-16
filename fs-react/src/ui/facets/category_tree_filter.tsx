import React, {Dispatch, KeyboardEvent, MutableRefObject, SetStateAction, useContext, useEffect, useState} from "react";
import {CategoryNode, Property} from "../../common/datatypes";
import {WikiContext} from "../../index";
import {useDebounce} from "../../util/custom_hooks";
import EventHandler from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";

function CategoryTreeFilter(prop : {
    setCategoryTree: Dispatch<SetStateAction<[CategoryNode, CategoryNode]>>,
    treeState: [CategoryNode, CategoryNode]
}) {

    const [text, setText] = useState((): string => '');
    const [filteredTree, fullTree] = prop.treeState;

    const debouncedSearchValue = useDebounce(text, 500);
    useEffect(() => {
        if (!prop.treeState) return;
        prop.setCategoryTree([ fullTree.filterNodes(text), fullTree]);
    }, [debouncedSearchValue]);

    if (!prop.treeState) return;

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.setCategoryTree([ fullTree.filterNodes(text), fullTree ]);
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