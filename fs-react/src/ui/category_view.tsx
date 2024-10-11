import {CategoryFacetCount, CategoryFacetValue, PropertyResponse, SolrDocumentsResponse} from "../common/datatypes";
import Tools from "../util/tools";
import React from "react";

function FacetViewCategory( prop: {
    title: string,
    categoryFacetCount: CategoryFacetCount|null,
    selectedCategories: string[],
    onCategoryClick: (c: string)=>void,
}) {
    let isSelectedFacet = Tools.findFirst(prop.selectedCategories, (e) => e, prop.categoryFacetCount.category) !== null;
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
    results: SolrDocumentsResponse,
    selectedCategories: string[],
    onCategoryClick: (c: string)=>void,

}) {
    if (!prop.results) return;
    let categories = prop.results.docs.flatMap((doc, i) => {
        return doc.categoryFacets;
    });
    const uniqueCategories = Tools.createUniqueArray(categories, (p: CategoryFacetValue) => { return p.category });

    const listItems = uniqueCategories.map((category,i) => {
            const facetCount = Tools.findFirst(prop.results.categoryFacetCounts,
                (c) => c.category, category.category);

            return <FacetViewCategory key={category.category}
                                      title={category.category}
                                      categoryFacetCount={facetCount}
                                      onCategoryClick={prop.onCategoryClick}
                                      selectedCategories={prop.selectedCategories}
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