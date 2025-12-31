import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {TextFilters} from "../../common/datatypes";
import {WikiContext} from "../../index";
import {useDebounce} from "../../custom_ui/custom_hooks";
import EventHandler from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";
import {TextField} from "@mui/material";
import {Property} from "../../common/property";

function FacetFilter(prop : {
    property: Property
    numberOfValues: number
    eventHandler: EventHandler,
    width?: string
    textFilters: TextFilters
}) {

    const wikiContext = useContext(WikiContext);

    const [unchanged, setUnchanged] = useState((): boolean => true);

    let text = prop.textFilters[prop.property?.title] ?? '';
    const debouncedSearchValue = useDebounce(text, 500);
    useEffect(() => {
        if (!prop.property) return;
        if (unchanged && debouncedSearchValue === '') return;
        prop.eventHandler.onFacetValueContains(debouncedSearchValue, prop.property)
    }, [debouncedSearchValue]);

    if (!prop.property) return;
    const unsuitableProperty = prop.property.isRangeProperty() || prop.property.isBooleanProperty();
    const needsNoFilter = prop.numberOfValues < wikiContext.config.fs2gFacetValueLimit;
    if (unsuitableProperty || (unchanged && needsNoFilter)) {
        return;
    }

    const onChange = function(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setFilter(e.target.value);
        setUnchanged(false);
    }

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.eventHandler.onFacetValueContains(text, prop.property);
        } else if (e.key === "Escape") {
            setFilter('');
        }
        e.stopPropagation();
    }

    const setFilter = function(text: string): void {
        const f = ObjectTools.deepClone(prop.textFilters);
        f[prop.property.title] = text;
        prop.eventHandler.setTextFilters(f);
    }

    return <TextField
                  id={prop.property.title+"-filter-input"}
                  style={{width: prop.width ?? '50%'}}
                  placeholder={wikiContext.msg('fs-filter-property', prop.property.title)}
                  size={'small'}
                  variant="standard"
                  value={text}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
    />;

}


export default FacetFilter;