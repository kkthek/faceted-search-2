import React, {useContext, useEffect, useState} from "react";
import {WikiContext} from "../index";
import {Box, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import DocumentQueryBuilder from "../common/document_query_builder";
import {DocumentQuery} from "../common/datatypes";
import EventHandler from "../common/event_handler";

class DropdownEntry {

    readonly id: string
    readonly label: string

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    static createEntries(categoryFilters: any) {
        let entries = [];
        for(let category in categoryFilters) {
            let id = category === '' ? '-no-filter-' : category;
            let label = categoryFilters[category];
            label = this.decodeHtml(label);
            entries.push(new DropdownEntry(id, label));
        }
        return entries;
    }

    static decodeHtml(html: string) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
}

function CategoryDropdown(prop: {
    documentQuery: DocumentQuery,
    eventHandler: EventHandler
}) {
    let wikiContext = useContext(WikiContext);
    let categoryFilter = wikiContext.config['fs2gCategoryFilter'];
    let showCategories = wikiContext.config['fs2gShowCategories'];
    let useCategoryDropdown = wikiContext.isObjectConfigured('fs2gCategoryFilter');
    if (!useCategoryDropdown) return;
    if (!showCategories) return;

    let entries = DropdownEntry.createEntries(categoryFilter);
    let categoryFacets = prop.documentQuery.categoryFacets;
    let preselectedCategory = categoryFacets.length > 0 ? categoryFacets[0] : '-no-filter-';
    const [category, setCategory] = useState(preselectedCategory);
    useEffect(() => {
        setCategory(preselectedCategory);
    }, [preselectedCategory])

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
        prop.eventHandler.onCategoryDropDownClick(event.target.value === '-no-filter-' ? '' : event.target.value);
    };

    let categoryOptions = entries.map((entry) =>
        <MenuItem key={entry.id} value={entry.id}>{entry.label}</MenuItem>
    );

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