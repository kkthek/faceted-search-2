import {
    BaseQuery,
    Property,
    PropertyFacet,
    PropertyResponse,
    PropertyValueCount,
    ValueCount
} from "../common/datatypes";
import React from "react";
import Tools from "../util/tools";

function FacetValues(prop: {
    query: BaseQuery,
    propertyValueCount: PropertyValueCount|null,
    onValueClick: (p: PropertyFacet)=>void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet)=>void,
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

        let property = prop.propertyValueCount.property;
        let propertyFacet = new PropertyFacet(
            property.title,
            property.type,
            v.value, v.mwTitle, v.range);

        return <li key={value+v.count}>
            <span onClick={() => prop.onValueClick(propertyFacet)}>{value}</span>
            :
            <span>{v.count}</span>
            {prop.removable ? <span onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
        </li>
    });

    return <div>

        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
};

export default FacetValues;