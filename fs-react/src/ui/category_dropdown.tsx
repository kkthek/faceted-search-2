import React, {useContext} from "react";
import {WikiContext} from "../index";

class DropdownEntry {

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    id: string
    label: string
}

function CategoryDropdown(prop: {
    onCategoryClick: (c: string)=>void
}) {
    let wikiContext = useContext(WikiContext);
    let categoryFilter = wikiContext.config['fsg2CategoryFilter'];

    let entries = [];
    for(let category in categoryFilter) {
        entries.push(new DropdownEntry(category, categoryFilter[category]));
    }
    let categoryOptions = entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>);
    return <div><select onChange={(option) => prop.onCategoryClick(option.target.value)}>
        {categoryOptions}
    </select></div>
}

export default CategoryDropdown;