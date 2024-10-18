import {BaseQuery, PropertyResponse, PropertyValueCount, Range, ValueCount} from "../common/datatypes";
import React from "react";
import Tools from "../util/tools";
import FacetValues from "./facet_values_view";

function FacetRange(prop: {
    propertyValueCount: PropertyValueCount|null,
    query: BaseQuery,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void,
    removable: boolean
    onRemoveClick: (p: PropertyResponse, v: ValueCount|null)=>void,
}) {

    if (prop.propertyValueCount === null) {
        return;
    }

    let propertyfacet = Tools.findFirst(prop.query.propertyFacets, (e) => e.property, prop.propertyValueCount.property.title);
    let range: Range = propertyfacet.range ? propertyfacet.range:null;
    let rangeStr = range.from + " - " + range.to;

    return <div>
        <span>({prop.propertyValueCount.property.title})</span>
        {prop.removable ? <span onClick={() => prop.onRemoveClick(prop.propertyValueCount.property, {value: null, mwTitle: null, range: range, count:0})}>[X]</span> : ''}
        <span>{rangeStr}</span>
        <FacetValues key={prop.propertyValueCount.property.title}
                     propertyValueCount={prop.propertyValueCount}
                     onValueClick={prop.onValueClick}
                     removable={false}
                     onRemoveClick={prop.onRemoveClick}
        />
    </div>
};

export default FacetRange;