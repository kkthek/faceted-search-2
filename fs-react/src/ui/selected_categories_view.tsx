import React from "react";
import {SearchStateDocument} from "./event_handler";


function SelectedCategoriesView(prop: {
    searchStateDocument: SearchStateDocument,
    onCategoryRemove: (c: string) => void
}) {
    if (!prop.searchStateDocument) return;

    const categories = prop.searchStateDocument.documentResponse.categoryFacetCounts.map((v, i) => {
            let query = prop.searchStateDocument.query;
            let isSelectedFacet = query.isCategoryFacetSelected(v.category);
            return (isSelectedFacet ?
                <li key={v.category}>
                    <span>({v.count}) {v.category}</span>
                    <span onClick={() => prop.onCategoryRemove(v.category)}>[R]</span>
                </li> : '');
        }
    );

    return <div id={'fs-selected-categoriesview'}>
        <ul>
            {categories}
        </ul>
    </div>;
}

export default SelectedCategoriesView;