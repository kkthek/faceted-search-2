import React, {useContext, useState} from "react";
import {WikiContext} from "../../index";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import ConfigUtils from "../../util/config_utils";
import EventHandler from "../../common/event_handler";

import {Sort} from "../../common/request/sort";

interface SortConfig {
    [key: string]: Sort;
}

function SortView(prop : {
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    const defaultSortOrder = wikiContext.config['fs2gDefaultSortOrder'];
    const showSortView = wikiContext.config['fs2gShowSortOrder'];
    const headerControlOrder = wikiContext.config['fs2gHeaderControlOrder'];
    if (!showSortView) return;

    const sorts: SortConfig = {
        score: ConfigUtils.getSortByName('score'),
        newest: ConfigUtils.getSortByName('newest'),
        oldest: ConfigUtils.getSortByName('oldest'),
        ascending: ConfigUtils.getSortByName('ascending'),
        descending: ConfigUtils.getSortByName('descending')
    };
    
    const [sort, setSort] = useState(defaultSortOrder);

    const handleChange = (event: SelectChangeEvent) => {
        prop.eventHandler.onSortChange(sorts[event.target.value]);
        setSort(event.target.value);
    };

    const entries = Object.keys(sorts).map(id =>
        <MenuItem key={id} value={id}>{wikiContext.msg('fs-'+id)}</MenuItem>
    );

    const marginLeft = headerControlOrder[0] === 'sortView' ? '0px' : '10px';

    return <FormControl id={'sort-order-select-control'}>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={sort}
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