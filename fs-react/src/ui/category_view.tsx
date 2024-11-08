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

        <span onClick={() => prop.onCategoryClick(prop.title)}>{prop.title}</span>
        <span>({prop.categoryFacetCount?.count})</span>
        <span>{prop.categoryFacetCount.displayTitle}</span>
    </li>
}
function CategoryView( prop: {
    searchStateDocument: SearchStateDocument,
    onCategoryClick: (c: string)=>void,

}) {
    if (!prop.searchStateDocument) return;

    const categoryFacetCounts = prop.searchStateDocument.documentResponse.categoryFacetCounts;

    const listItems = categoryFacetCounts.map((facetCount,i) => {

            return <FacetViewCategory key={facetCount.category}
                                      title={facetCount.category}
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