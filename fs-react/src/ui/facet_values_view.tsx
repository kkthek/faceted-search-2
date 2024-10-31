import {BaseQuery, Datatype, PropertyFacet, PropertyValueCount, PropertyWithURL, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";

function FacetValues(prop: {
    query: BaseQuery,
    propertyValueCount: PropertyValueCount|null,
    onValueClick: (p: PropertyFacet)=>void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet)=>void,
}) {

    function serializeFacetValue(p: PropertyWithURL, v: ValueCount): string {
        if (v.value) {
            if (p.type === Datatype.datetime) {
                return DisplayTools.displayDate(v.value as Date);
            }
            return v.value.toString();
        } else if (v.mwTitle) {
            return  v.mwTitle.displayTitle;
        } else {
            // range
            if (p.type === Datatype.datetime) {
                return DisplayTools.displayDateRange(v.range.from as Date, v.range.to as Date);
            }
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