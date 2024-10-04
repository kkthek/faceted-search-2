import React from "react";
import {
    PropertyResponse,
    PropertyValueCount,
    SolrDocumentsResponse,
    SolrFacetResponse,
    ValueCount
} from "../common/datatypes";
import DocumentQueryBuilder from "../common/document_query_builder";
import Tools from "../util/tools";
import {FacetViewProperty} from "./facet_view";


function SelectedFacet(prop: { propertyValueCount: PropertyValueCount }) {
    const listItems = prop.propertyValueCount.values.map((v, i) => {
        return <li>{v.value === null ? v.mwTitle.displayTitle : v.value}:{v.count}</li>
    });
    return <div>
        <span>({prop.propertyValueCount.property.title})</span>
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
}

function SelectedFacetsView(prop: {
    results: SolrFacetResponse,
    onPropertyClick: (p: PropertyResponse) => void
}) {
    if (!prop.results) return;

    const listItems = prop.results.valueCounts.map((v, i) => {

            return <SelectedFacet key={v.property.title}
                                  propertyValueCount={v}
            />
        }
    );


    return <div id={'fs-selected-facetview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default SelectedFacetsView;