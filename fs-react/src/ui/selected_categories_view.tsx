import React from "react";
import {SolrDocumentsResponse,} from "../common/datatypes";

import Tools from "../util/tools";


function SelectedCategoriesView(prop: {
    results: SolrDocumentsResponse,
    selectedCategories: string[],

}) {
    if (!prop.results) return;

    const categories = prop.results.categoryFacetCounts.map((v, i) => {
            let isSelectedFacet = Tools.findFirst(prop.selectedCategories, (e) => e, v.category) !== null;
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