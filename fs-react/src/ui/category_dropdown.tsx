import React, {useContext, useEffect, useState} from "react";
import {WikiContext} from "../index";
import {Box, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {DocumentQuery} from "../common/datatypes";
import EventHandler from "../common/event_handler";

const NO_CATEGORY_FILTER = '-no-category-filter-';

class DropdownEntry {

    readonly id: string
    readonly label: string

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    static createEntries(categoryFilters: any) {
        const entries = [];
        for(let category in categoryFilters) {
            let id = category === '' ? NO_CATEGORY_FILTER : category;
            let label = categoryFilters[category];
            label = this.decodeHtml(label);
            entries.push(new DropdownEntry(id, label));
        }
        return entries;
    }

    private static decodeHtml(html: string) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
}

function CategoryDropdown(prop: {
    documentQuery: DocumentQuery,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    const categoryFilter = wikiContext.config['fs2gCategoryFilter'];
    const showCategories = wikiContext.config['fs2gShowCategories'];
    const useCategoryDropdown = wikiContext.isObjectConfigured('fs2gCategoryFilter');
    if (!useCategoryDropdown) return;
    if (!showCategories) return;


    const entries = DropdownEntry.createEntries(categoryFilter);
    const categoryFacets = prop.documentQuery.categoryFacets;
    const preSelectedCategory = categoryFacets.length > 0 ? categoryFacets[0] : NO_CATEGORY_FILTER;
    const [selectedCategory, setSelectedCategory] = useState(preSelectedCategory);

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value);
        const category = event.target.value === NO_CATEGORY_FILTER ? '' : event.target.value;
        prop.eventHandler.onCategoryDropDownClick(category);
    };

    const categoryOptions = entries.map((entry) =>
        <MenuItem key={entry.id} value={entry.id}>{entry.label}</MenuItem>
    );

    return <Box className={'fs-category-dropdown'}>
        <Typography>{wikiContext.msg('fs-available-categories')}</Typography>
        <Select
            labelId="sort-order-select-label"
            id="sort-order-select"
            value={selectedCategory}
            size={'small'}
            sx={{"marginLeft": "10px"}}
            onChange={handleChange}

        >{categoryOptions}</Select>
    </Box>
}

export default CategoryDropdown;