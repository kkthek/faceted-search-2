import React, {useContext, useEffect, useState} from "react";
import {WikiContext} from "../index";
import {Box, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";

class DropdownEntry {

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    id: string
    label: string
}

function CategoryDropdown(prop: {
    onCategoryDropDownClick: (c: string)=>void
}) {
    let wikiContext = useContext(WikiContext);
    let categoryFilter = wikiContext.config['fs2gCategoryFilter'];
    let showCategories = wikiContext.config['fs2gShowCategories'];
    let useCategoryDropdown = wikiContext.config.fs2gCategoryFilter.length !== 0;
    if (!useCategoryDropdown) return;
    if (!showCategories) return;

    let entries = [];
    for(let category in categoryFilter) {
        let id = category === '' ? '-no-filter-' : category;
        let label = categoryFilter[category];
        label = label.replace('&nbsp;', '\u00A0');
        entries.push(new DropdownEntry(id, label));
    }

    const [category, setCategory] = useState(entries[0].id);

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
        prop.onCategoryDropDownClick(event.target.value === '-no-filter-' ? '' : event.target.value);
    };

    let categoryOptions = entries.map((entry) => <MenuItem key={entry.id} value={entry.id}>{entry.label}</MenuItem>);
    return <Box className={'fs-category-dropdown'}>
        <Typography>Available categories</Typography>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={category}
            size={'small'}
            sx={{"marginLeft": "10px"}}
            onChange={handleChange}

        >{categoryOptions}</Select>
    </Box>
}

export default CategoryDropdown;