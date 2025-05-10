import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {Property} from "../common/datatypes";
import {WikiContext} from "../index";
import {Button, TextField} from "@mui/material";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import {useDebounce} from "../util/custom_hooks";

function FacetFilter(prop : {
    property: Property
    numberOfValues: number
    onFilterContainsClick: (text: string, limit: number, property: Property) => void
}) {

    if (!prop.property) return;
    let wikiContext = useContext(WikiContext);
    let needsNoFilter = prop.numberOfValues < wikiContext.config.fs2gFacetValueLimit;
    let unsuitableProperty = prop.property.isRangeProperty() || prop.property.isBooleanProperty();
    const [text, setText] = useState((): string => '');
    const [unchanged, setUnchanged] = useState((): boolean => true);

    const debouncedSearchValue = useDebounce(text, 500);
    useEffect(() => {
        prop.onFilterContainsClick(debouncedSearchValue, wikiContext.config.fs2gFacetValueLimit, prop.property)
    }, [debouncedSearchValue]);

    if (unsuitableProperty || (unchanged && needsNoFilter)) {
        return;
    }

    const onChange = function(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setText(e.target.value);
        setUnchanged(false);
    }

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.onFilterContainsClick(text, wikiContext.config.fs2gFacetValueLimit, prop.property);
        }
        e.stopPropagation();
    }
    return <input type={'text'}
                  style={{marginLeft: '50px'}}
                  placeholder={'Filter...'}
                  value={text}
                  onChange={onChange}
                  onKeyDown={onKeyDown}/>;

}


export default FacetFilter;