import React from "react";
import {PropertyFacet, PropertyResponse, SolrFacetResponse, ValueCount,} from "../common/datatypes";

import Tools from "../util/tools";
import FacetValues from "./facet_values_view";


function SelectedFacetsView(prop: {
    results: SolrFacetResponse,
    selectedFacets: PropertyFacet[],
    onPropertyClick: (p: PropertyResponse) => void
    onValueClick: (p: PropertyResponse, v: ValueCount) => void
}) {
    if (!prop.results) return;

    const facetValues = prop.results.valueCounts.map((v, i) => {
            let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, v.property.title) !== null;
            return (isSelectedFacet ?
                <FacetValues key={v.property.title} propertyValueCount={v} onValueClick={prop.onValueClick}/> : '');
        }
    );


    return <div id={'fs-selected-facetview'}>
        <ul>
            {facetValues}
        </ul>
    </div>;
}

export default SelectedFacetsView;