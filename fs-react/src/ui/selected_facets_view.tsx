import React from "react";
import {PropertyFacet, PropertyResponse, SolrFacetResponse, ValueCount,} from "../common/datatypes";

import Tools from "../util/tools";
import FacetValues from "./facet_values_view";
import {SearchStateDocument, SearchStateFacet} from "./event_handler";


function SelectedFacetsView(prop: {
    searchStateDocument: SearchStateFacet,
    onPropertyClick: (p: PropertyResponse) => void
    onValueClick: (p: PropertyResponse, v: ValueCount) => void
}) {
    if (!prop.searchStateDocument) return;

    const facetValues = prop.searchStateDocument.facetsResponse.valueCounts.map((v, i) => {
            let isSelectedFacet = Tools.findFirst(prop.searchStateDocument.query.propertyFacets, (e) => e.property, v.property.title) !== null;
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