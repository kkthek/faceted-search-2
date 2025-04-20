import React, {useContext, useState} from "react";
import {Datatype, Order, Property, Sort} from "../common/datatypes";
import {WikiContext} from "../index";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

function SortView(prop : {
    onChange: (sort: Sort) => void
}) {
    let wikiContext = useContext(WikiContext);
    let defaultSortOrder = wikiContext.config['fs2gDefaultSortOrder'];
    let showSortView = wikiContext.config['fs2gShowSortOrder'];
    if (!showSortView) return;

    let sorts: any = {
        score: getSortByName('score'),
        newest: getSortByName('newest'),
        oldest: getSortByName('oldest'),
        ascending: getSortByName('ascending'),
        descending: getSortByName('descending')
    };
    
    const [sort, setSort] = useState(defaultSortOrder);

    const handleChange = (event: SelectChangeEvent) => {
        prop.onChange(sorts[event.target.value]);
        setSort(event.target.value);
    };


    return <FormControl>
        <InputLabel id="sort-order-select-label">Sort order</InputLabel>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={sort}
            label="Sort order"
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

let getSortByName = function(name: string): Sort {
    switch(name) {
        case 'newest': return new Sort(new Property('_MDAT', Datatype.datetime), Order.desc);
        case 'oldest': return new Sort(new Property('_MDAT', Datatype.datetime), Order.asc);
        case 'ascending': return new Sort(new Property('displaytitle', Datatype.internal), Order.asc);
        case 'descending': return new Sort(new Property('displaytitle', Datatype.internal), Order.desc);
        default:
        case 'score': return new Sort(new Property('score', Datatype.internal), Order.desc);
    }
}

export default SortView;