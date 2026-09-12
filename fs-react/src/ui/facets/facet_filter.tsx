import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {SearchStateFacet, TextFilters} from "../../common/datatypes";
import {TYPING_DELAY, WikiContext} from "../../index";
import {useDebounce} from "../../custom_ui/custom_hooks";
import EventHandler from "../../common/event_handler";
import ObjectTools from "../../util/object_tools";
import {TextField} from "@mui/material";
import {Property} from "../../common/property";
import {FacetsQuery} from "../../common/request/facets_query";
import {PropertyValueQuery} from "../../common/request/property_value_query";

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