import React, {useContext} from "react";
import {WikiContext} from "../../index";
import {FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import ConfigUtils from "../../util/config_utils";
import EventHandler from "../../common/event_handler";

import {Sort} from "../../common/request/sort";
import {DocumentQuery} from "../../common/request/document_query";
import {SearchStateDocument} from "../../common/datatypes";

function SortView(prop : {
    eventHandler: EventHandler,
    searchStateDocument: SearchStateDocument
}) {
    const wikiContext = useContext(WikiContext);
    const showSortView = wikiContext.config['fs2gShowSortOrder'];
    const headerControlOrder = wikiContext.config['fs2gHeaderControlOrder'];
    if (!showSortView || !prop.searchStateDocument) return;

    const allSorts: Sort[] = ConfigUtils.getAllSorts();

    const handleChange = (event: SelectChangeEvent) => {
        const sort = allSorts.findFirst((s: Sort) => s.getKey() === event.target.value);
        prop.eventHandler.onSortChange(sort);
    };

    const entries = allSorts.map(s =>
        <MenuItem key={s.getKey()} value={s.getKey()}>{wikiContext.msg('fs-'+s.getKey())}</MenuItem>
    );

    const marginLeft = headerControlOrder[0] === 'sortView' ? '0px' : '10px';

    const documentQuery = prop.searchStateDocument.query as DocumentQuery;

    return <FormControl id={'sort-order-select-control'}>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={documentQuery.sorts[0].getKey()}
            label="Sort order"
            size={'small'}
            autoWidth={true}
            sx={{marginLeft: marginLeft}}
            onChange={handleChange}
        >
            {entries}
        </Select>
    </FormControl>

}

export default SortView;