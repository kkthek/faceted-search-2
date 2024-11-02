import {BaseQuery, PropertyFacet, PropertyValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";

function FacetValues(prop: {
    query: BaseQuery,
    propertyValueCount: PropertyValueCount|null,
    onValueClick: (p: PropertyFacet)=>void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet)=>void,
}) {

    if (prop.propertyValueCount === null) {
        return;
    }

    const listItems = prop.propertyValueCount.values.map((v, i) => {
        let value = DisplayTools.serializeFacetValue(prop.propertyValueCount.property, v);

        let property = prop.propertyValueCount.property;
        let propertyFacet = new PropertyFacet(
            property.title,
            property.type,
            v.value, v.mwTitle, v.range);

        return <li key={value.toString()+v.count}>
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