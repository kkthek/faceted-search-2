import {CategoryFacetCount, CategoryFacetValue, PropertyResponse, SolrDocumentsResponse} from "../common/datatypes";
import Tools from "../util/tools";
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
    let categories = prop.searchStateDocument.documentResponse.docs.flatMap((doc, i) => {
        return doc.categoryFacets;
    });
    const uniqueCategories = Tools.makeArrayUnique(categories, (p: CategoryFacetValue) => { return p.category });

    const listItems = uniqueCategories.map((category,i) => {
            const facetCount = Tools.findFirst(prop.searchStateDocument.documentResponse.categoryFacetCounts,
                (c) => c.category, category.category);

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