import React from "react";

import Tools from "../util/tools";
import {SearchStateDocument} from "./event_handler";


function SelectedCategoriesView(prop: {
    searchStateDocument: SearchStateDocument
}) {
    if (!prop.searchStateDocument) return;

    const categories = prop.searchStateDocument.documentResponse.categoryFacetCounts.map((v, i) => {
            let isSelectedFacet = Tools.isCategoryFacetSelected(prop.searchStateDocument.query, v.category);
            return (isSelectedFacet ?
                <li key={v.category}>({v.count}) {v.category}</li> : '');
        }
    );


    return <div id={'fs-selected-categoriesview'}>
        <ul>
            {categories}
        </ul>
    </div>;
}

export default SelectedCategoriesView;