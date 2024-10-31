import {BaseQuery, Datatype, PropertyFacet, PropertyValueCount, Range} from "../common/datatypes";
import React from "react";
import FacetValues from "./facet_values_view";
import DisplayTools from "../util/display_tools";

function FacetRange(prop: {
    propertyValueCount: PropertyValueCount|null,
    query: BaseQuery,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
}) {

    if (prop.propertyValueCount === null) {
        return;
    }

    let propertyFacet = prop.query.findPropertyFacet(prop.propertyValueCount.property);
    let range: Range = propertyFacet.range ? propertyFacet.range:null;
    let rangeSelected = range !== null;

    let rangeDisplay;
    if (prop.propertyValueCount.property.type === Datatype.datetime) {
        rangeDisplay = rangeSelected ? DisplayTools.displayDateRange(range.from as Date, range.to as Date) : '';
    } else {
        rangeDisplay = rangeSelected ? range.from + " - " + range.to : '';
    }

    return <div key={propertyFacet.property}>
        <span>({propertyFacet.property})</span>
        {!rangeSelected ? <span onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
        <span>{rangeDisplay}</span>
        <FacetValues
                     propertyValueCount={prop.propertyValueCount}
                     onValueClick={prop.onValueClick}
                     removable={rangeSelected}
                     query={prop.query}
                     onRemoveClick={prop.onRemoveClick}
        />
    </div>
};

export default FacetRange;