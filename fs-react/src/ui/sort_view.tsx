import React, {useContext, useState} from "react";
import {WikiContext} from "../index";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import ConfigUtils from "../util/config_utils";
import EventHandler from "../common/event_handler";

function SortView(prop : {
    eventHandler: EventHandler
}) {
    let wikiContext = useContext(WikiContext);
    let defaultSortOrder = wikiContext.config['fs2gDefaultSortOrder'];
    let showSortView = wikiContext.config['fs2gShowSortOrder'];
    if (!showSortView) return;

    let sorts: any = {
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


    return <FormControl id={'sort-order-select-control'}>
        <InputLabel id="sort-order-select-label">Sort order</InputLabel>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={sort}
            label="Sort order"
            size={'small'}
            onChange={handleChange}
        >
            <MenuItem value={'score'}>{wikiContext.msg('score_desc')}</MenuItem>
            <MenuItem value={'newest'}>{wikiContext.msg('_MDAT_desc')}</MenuItem>
            <MenuItem value={'oldest'}>{wikiContext.msg('_MDAT_asc')}</MenuItem>
            <MenuItem value={'ascending'}>{wikiContext.msg('displaytitle_asc')}</MenuItem>
            <MenuItem value={'descending'}>{wikiContext.msg('displaytitle_desc')}</MenuItem>
        </Select>
    </FormControl>

}

export default SortView;