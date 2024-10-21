import React from "react";
import {Datatype, PropertyFacet,} from "../common/datatypes";
import FacetValues from "./facet_values_view";
import {SearchStateFacet} from "./event_handler";
import FacetRange from "./facet_range";


function SelectedFacetsView(prop: {
    searchStateDocument: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet)=>void,
}) {
    if (!prop.searchStateDocument) return;

    const facetValues = prop.searchStateDocument.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateDocument.query;
            let isSelectedFacet = query.isPropertyFacetSelected(v.property);
            if (v.property.type === Datatype.datetime || v.property.type === Datatype.number) {
                return (isSelectedFacet ? <FacetRange key={v.property.title}
                                   propertyValueCount={v}
                                   query={prop.searchStateDocument.query}
                                   onValueClick={prop.onValueClick}
                                   onRemoveClick={prop.onRemoveClick}
                />: '');
            } else {

                let propertyFacet = query.findPropertyFacet(v.property);
                if (!propertyFacet) return '';

                let hasValue = propertyFacet.hasValue();

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
                    </div>: '');
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