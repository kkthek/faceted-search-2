import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {TextFilters, Property} from "../../common/datatypes";
import {WikiContext} from "../../index";
import {useDebounce} from "../../util/custom_hooks";
import EventHandler from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";

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
        const f = ObjectTools.deepClone(prop.textFilters);
        f[prop.property.title] = e.target.value;
        prop.eventHandler.setTextFilters(f);
        setUnchanged(false);
    }

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            prop.eventHandler.onFacetValueContains(text, prop.property);
        }
        e.stopPropagation();
    }
    return <input type={'text'}
                  id={prop.property.title+"-filter-input"}
                  style={{width: prop.width ?? '50%'}}
                  placeholder={'Filter...'}
                  value={text}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
    />;

}


export default FacetFilter;