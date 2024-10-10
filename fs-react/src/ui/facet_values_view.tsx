import {PropertyResponse, PropertyValueCount, ValueCount} from "../common/datatypes";
import React from "react";

function FacetValues(prop: {
    propertyValueCount: PropertyValueCount|null,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void
}) {

    function serializeFacetValue(p: PropertyResponse, v: ValueCount) {
        if (v.value !== null) {
            return v.value;
        } else if (v.mwTitle !== null) {
            return v.mwTitle.displayTitle;
        } else {
            // range
            return v.range.from + "-" + v.range.to;
        }
    }

    if (prop.propertyValueCount === null) {
        return;
    }

    const listItems = prop.propertyValueCount.values.map((v, i) => {
        let value = serializeFacetValue(prop.propertyValueCount.property, v);
        return <li key={value+v.count} onClick={() => prop.onValueClick(prop.propertyValueCount.property, v)}>{value}:{v.count}</li>
    });

    return <div>
        <span>({prop.propertyValueCount.property.title})</span>
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
};

export default FacetValues;