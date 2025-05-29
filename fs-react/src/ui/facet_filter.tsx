import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {Property} from "../common/datatypes";
import {WikiContext} from "../index";
import {useDebounce} from "../util/custom_hooks";
import EventHandler from "../common/event_handler";

function FacetFilter(prop : {
    property: Property
    numberOfValues: number
    eventHandler: EventHandler
}) {

    let wikiContext = useContext(WikiContext);
    const [text, setText] = useState((): string => '');
    const [unchanged, setUnchanged] = useState((): boolean => true);

    const debouncedSearchValue = useDebounce(text, 500);
    useEffect(() => {
        if (!prop.property) return;
        prop.eventHandler.onFacetValueContains(debouncedSearchValue, wikiContext.config.fs2gFacetValueLimit, prop.property)
    }, [debouncedSearchValue]);

    if (!prop.property) return;
    let unsuitableProperty = prop.property.isRangeProperty() || prop.property.isBooleanProperty();
    let needsNoFilter = prop.numberOfValues < wikiContext.config.fs2gFacetValueLimit;
    if (unsuitableProperty || (unchanged && needsNoFilter)) {
        return;
    }

    const onChange = function(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setText(e.target.value);
        setUnchanged(false);
    }

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.eventHandler.onFacetValueContains(text, wikiContext.config.fs2gFacetValueLimit, prop.property);
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