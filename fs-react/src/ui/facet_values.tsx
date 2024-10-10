import {PropertyValueCount} from "../common/datatypes";
import React from "react";

export function FacetValues(prop: {
    propertyValueCount: PropertyValueCount
}) {

    const listItems = prop.propertyValueCount.values.map((v, i) => {
        let value;
        if (v.value !== null) {
            value = v.value;
        } else if (v.mwTitle !== null) {
            value = v.mwTitle.displayTitle;
        } else {
            // range
            value = v.range.from + "-" + v.range.to;
        }
        return <li>{value}:{v.count}</li>
    });
    return <div>
        <span>({prop.propertyValueCount.property.title})</span>
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
}
