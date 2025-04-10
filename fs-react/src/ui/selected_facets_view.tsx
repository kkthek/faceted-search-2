import React from "react";
import {Property, PropertyFacet,} from "../common/datatypes";
import FacetValues from "./facet_values_view";
import {SearchStateFacet} from "./event_handler";


function SelectedFacetsView(prop: {
    searchStateFacet: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet) => void,
    onExpandClick: (p: Property, limit: number)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
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
                    {!hasValue ? <span className={'fs-clickable'}
                                       onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
                    <FacetValues key={v.property.title}
                                 propertyValueCount={v}
                                 onValueClick={prop.onValueClick}
                                 removable={hasValue}
                                 query={prop.searchStateFacet.query}
                                 onRemoveClick={prop.onRemoveClick}
                                 onExpandClick={prop.onExpandClick}
                                 onFacetValueContainsClick={prop.onFacetValueContainsClick}/>
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