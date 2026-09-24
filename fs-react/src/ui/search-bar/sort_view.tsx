import React, {useContext} from "react";
import {FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import EventHandler from "app/common/event_handler";
import {SearchStateDocument} from "app/common/datatypes";
import {WikiContext} from "app/index";
import {Sort} from "app/common/request/sort";
import ConfigUtils from "app/util/config_utils";
import {DocumentQuery} from "app/common/request/document_query";

function SortView(prop : {
    eventHandler: EventHandler,
    searchStateDocument: SearchStateDocument
}) {
    const wikiContext = useContext(WikiContext);
    const showSortView = wikiContext.config['fs2gShowSortOrder'];
    if (!showSortView || !prop.searchStateDocument) return;

    const allSorts: Sort[] = ConfigUtils.getAllSorts();

    const handleChange = (event: SelectChangeEvent) => {
        const sort = ConfigUtils.getSortByKeyOrDefault(event.target.value);
        prop.eventHandler.onSortChange(sort);
    };

    const entries = allSorts.map(s =>
        <MenuItem key={s.getKey()} value={s.getKey()}>{wikiContext.msg('fs-'+s.getKey())}</MenuItem>
    );

    const documentQuery = prop.searchStateDocument.query as DocumentQuery;

    return <FormControl id={'sort-order-select-control'}>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={documentQuery.sorts[0].getKey()}
            size={'small'}
            autoWidth={true}
            onChange={handleChange}
        >
            {entries}
        </Select>
    </FormControl>

}

export default SortView;