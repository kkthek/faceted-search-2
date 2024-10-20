import {BaseQuery, BaseQueryClass, DocumentQuery, PropertyFacet, PropertyValueCount, Range} from "../common/datatypes";
import React from "react";
import FacetValues from "./facet_values_view";
import Tools from "../util/tools";

function FacetRange(prop: {
    propertyValueCount: PropertyValueCount|null,
    query: BaseQuery,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
}) {

    if (prop.propertyValueCount === null) {
        return;
    }

    let propertyFacet = Tools.recreate(BaseQueryClass, prop.query).findPropertyFacet(prop.propertyValueCount.property);
    let range: Range = propertyFacet.range ? propertyFacet.range:null;
    let rangeSelected = range !== null;
    let rangeDisplay = rangeSelected ? range.from + " - " + range.to : '';

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