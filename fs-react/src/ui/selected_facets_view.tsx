import React from "react";
import {PropertyFacet,} from "../common/datatypes";
import FacetValues from "./facet_values_view";
import {SearchStateFacet} from "./event_handler";


function SelectedFacetsView(prop: {
    searchStateFacet: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet) => void,
}) {
    if (!prop.searchStateFacet) return;

    const facetValues = prop.searchStateFacet.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateFacet.query;
            let isSelectedFacet = query.isPropertyFacetSelected(v.property);

            let propertyFacet = query.findPropertyFacet(v.property);
            if (!propertyFacet) return '';
            let hasValue = propertyFacet.hasValue() || propertyFacet.hasRange();

            return (isSelectedFacet ?
                <div key={v.property.title}>
                    <span>({v.property.title})</span>
                    {!hasValue ? <span onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
                    <FacetValues key={v.property.title}
                                 propertyValueCount={v}
                                 onValueClick={prop.onValueClick}
                                 removable={hasValue}
                                 query={prop.searchStateFacet.query}
                                 onRemoveClick={prop.onRemoveClick}
                    />
                </div> : '');
        }
    );


    return <div>
        <ul>
            {facetValues}
        </ul>
    </div>;
}

export default SelectedFacetsView;