import React from "react";
import {PropertyFacet,} from "../common/datatypes";
import FacetValues from "./facet_values_view";
import {SearchStateFacet} from "./event_handler";


function SelectedFacetsView(prop: {
    searchStateDocument: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet) => void,
}) {
    if (!prop.searchStateDocument) return;

    const facetValues = prop.searchStateDocument.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateDocument.query;
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
                                 query={prop.searchStateDocument.query}
                                 onRemoveClick={prop.onRemoveClick}
                    />
                </div> : '');
        }
    );


    return <div id={'fs-selected-facetview'}>
        <ul>
            {facetValues}
        </ul>
    </div>;
}

export default SelectedFacetsView;