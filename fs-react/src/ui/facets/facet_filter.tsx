import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {SearchStateFacet} from "app/common/datatypes";
import {Property} from "app/common/property";
import EventHandler from "app/common/event_handler";
import {TYPING_DELAY, WikiContext} from "app/index";
import {FacetsQuery} from "app/common/request/facets_query";
import {useDebounce} from "app/custom_ui/custom_hooks";

function FacetFilter(prop : {
    property: Property
    searchStateFacets: SearchStateFacet,
    numberOfValues: number
    eventHandler: EventHandler,
    width?: string
}) {

    const wikiContext = useContext(WikiContext);
    const [unchanged, setUnchanged] = useState((): boolean => true);

    const facetsQuery = prop.searchStateFacets.query as FacetsQuery;
    const propertyValueQuery = facetsQuery.findPropertyValueQuery(prop.property);
    const initialFilterValue = propertyValueQuery?.valueContains ?? '';
    const [filterText, setFilterText] = useState(initialFilterValue);
    const debouncedSearchValue = useDebounce(filterText, TYPING_DELAY);

    useEffect(() => {
        if (!prop.property || unchanged) return;
        prop.eventHandler.onFacetValueContains(debouncedSearchValue, prop.property);
    }, [debouncedSearchValue]);

    if (!prop.property) return;
    const unsuitableProperty = prop.property.isRangeProperty() || prop.property.isBooleanProperty();
    const needsNoFilter = prop.numberOfValues < wikiContext.config.fs2gFacetValueLimit;
    if (unsuitableProperty || (unchanged && needsNoFilter)) {
        return;
    }

    const onChange = function(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setFilterText(e.target.value);
        setUnchanged(false);
    }

    const onKeyDown = function(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Escape") {
            setFilterText('');
        }
        e.stopPropagation();
    }

    return <TextField
                  id={prop.property.title+"-filter-input"}
                  style={{width: prop.width ?? '50%'}}
                  placeholder={wikiContext.msg('fs-filter-property', prop.property.title)}
                  size={'small'}
                  variant="standard"
                  value={filterText}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
    />;

}


export default FacetFilter;