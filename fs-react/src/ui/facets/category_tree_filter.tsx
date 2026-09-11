import React, {Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useMemo, useState} from "react";
import {SearchStateDocument, TextFilters} from "../../common/datatypes";
import {useDebounce} from "../../custom_ui/custom_hooks";
import EventHandler from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";
import {TextField} from "@mui/material";
import {TYPING_DELAY, WikiContext} from "../../index";
import {CategoryNode} from "../../common/response/category_node";

function CategoryTreeFilter(prop: {
    filterText: string,
    setFilterText: Dispatch<SetStateAction<string>>
}) {

    const wikiContext = useContext(WikiContext);

    const onKeyDown = function (e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Escape") {
            prop.setFilterText('');
        }
        e.stopPropagation();
    }

    const onChange = function (text: string): void {
        prop.setFilterText(text);
    }

    return <TextField id={'category-tree-filter-input'}
                      placeholder={wikiContext.msg('fs-filter-category-tree')}
                      sx={{marginTop: '5px', marginBottom: '5px'}}
                      size={'small'}
                      variant="standard"
                      value={prop.filterText}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyDown={onKeyDown}
    />;

}

export default CategoryTreeFilter;