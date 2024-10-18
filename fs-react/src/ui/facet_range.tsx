import {BaseQuery, DocumentQuery, PropertyFacet, PropertyValueCount, Range} from "../common/datatypes";
import React from "react";
import FacetValues from "./facet_values_view";

function FacetRange(prop: {
    propertyValueCount: PropertyValueCount|null,
    query: BaseQuery,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
}) {

    if (prop.propertyValueCount === null) {
        return;
    }
    console.log(prop.query);
    let propertyFacet = BaseQuery.fromQuery(prop.query).findPropertyFacet(prop.propertyValueCount.property);
    let range: Range = propertyFacet.range ? propertyFacet.range:null;
    let rangeSelected = range !== null;
    let rangeDisplay = rangeSelected ? range.from + " - " + range.to : '';

    return <div>
        <span>({propertyFacet.property})</span>
        {!rangeSelected ? <span onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
        <span>{rangeDisplay}</span>
        <FacetValues key={propertyFacet.property}
                     propertyValueCount={prop.propertyValueCount}
                     onValueClick={prop.onValueClick}
                     removable={rangeSelected}
                     query={prop.query}
                     onRemoveClick={prop.onRemoveClick}
        />
    </div>
};

export default FacetRange;