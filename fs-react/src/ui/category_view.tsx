import {CategoryFacetCount} from "../common/datatypes";
import React from "react";
import {SearchStateDocument} from "./event_handler";

function FacetViewCategory( prop: {
    title: string,
    categoryFacetCount: CategoryFacetCount|null,
    selectedCategories: string[],
    onCategoryClick: (c: string)=>void,
}) {
    let isSelectedFacet = prop.selectedCategories.indexOf(prop.categoryFacetCount.category) > -1;
    if (isSelectedFacet) {
        return;
    }
    return <li key={prop.categoryFacetCount.category} className={'fs-facets'}>

        <span>({prop.categoryFacetCount?.count})</span>
        <span onClick={() => prop.onCategoryClick(prop.title)}>{prop.title}</span>
        <span>{prop.categoryFacetCount.displayTitle}</span>
    </li>
}
function CategoryView( prop: {
    searchStateDocument: SearchStateDocument,
    onCategoryClick: (c: string)=>void,

}) {
    if (!prop.searchStateDocument) return;

    const uniqueCategories = prop.searchStateDocument.documentResponse.getUniqueCategories();

    const listItems = uniqueCategories.map((category,i) => {
            const facetCount = prop.searchStateDocument.documentResponse.getCategoryFacetCount(category.category);

            return <FacetViewCategory key={category.category}
                                      title={category.category}
                                      categoryFacetCount={facetCount}
                                      onCategoryClick={prop.onCategoryClick}
                                      selectedCategories={prop.searchStateDocument.query.categoryFacets}
            />
        }
    );
    return <div id={'fs-categoryview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default CategoryView;