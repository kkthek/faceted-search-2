import {BaseQuery, PropertyFacet, PropertyResponse, PropertyValueCount, ValueCount} from "../common/datatypes";
import React from "react";
import Tools from "../util/tools";

function FacetValues(prop: {
    query: BaseQuery,
    propertyValueCount: PropertyValueCount|null,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void,
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
    let propertyFacet = Tools.findFirst(prop.query.propertyFacets, (e) => e.property, prop.propertyValueCount.property.title);

    const listItems = prop.propertyValueCount.values.map((v, i) => {
        let value = serializeFacetValue(prop.propertyValueCount.property, v);
        return <li key={value+v.count}>
            <span onClick={() => prop.onValueClick(prop.propertyValueCount.property, v)}>{value}</span>:<span>{v.count}</span>
            {prop.removable ? <span onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
        </li>
    });

    return <div>
        <span>({prop.propertyValueCount.property.title})</span>
        {prop.removable ? <span onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
};

export default FacetValues;