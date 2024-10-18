import React from "react";
import {Datatype, PropertyResponse, ValueCount,} from "../common/datatypes";

import Tools from "../util/tools";
import FacetValues from "./facet_values_view";
import {SearchStateFacet} from "./event_handler";
import FacetRange from "./facet_range";


function SelectedFacetsView(prop: {
    searchStateDocument: SearchStateFacet,
    onPropertyClick: (p: PropertyResponse) => void
    onValueClick: (p: PropertyResponse, v: ValueCount) => void,
    onRemoveClick: (p: PropertyResponse, v: ValueCount|null)=>void,
}) {
    if (!prop.searchStateDocument) return;

    const facetValues = prop.searchStateDocument.facetsResponse.valueCounts.map((v, i) => {
            let isSelectedFacet = Tools.isPropertyFacetSelected(prop.searchStateDocument.query, v.property);
            if (v.property.type === Datatype.datetime || v.property.type === Datatype.number) {
                return (isSelectedFacet ? <FacetRange propertyValueCount={v}
                                   query={prop.searchStateDocument.query}
                                   onValueClick={prop.onValueClick}
                                   removable={true} onRemoveClick={prop.onRemoveClick}
                />: '');
            } else {
                return (isSelectedFacet ?
                    <FacetValues key={v.property.title}
                                 propertyValueCount={v}
                                 onValueClick={prop.onValueClick}
                                 removable={true}
                                 onRemoveClick={prop.onRemoveClick}
                    /> : '');
            }
        }
    );


    return <div id={'fs-selected-facetview'}>
        <ul>
            {facetValues}
        </ul>
    </div>;
}

export default SelectedFacetsView;