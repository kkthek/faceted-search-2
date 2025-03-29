import {BaseQuery, Property, PropertyFacet, PropertyValueCount} from "../common/datatypes";
import React, {useContext} from "react";
import DisplayTools from "../util/display_tools";
import FacetFilter from "./facet_filter";
import {WikiContext} from "../index";
import Tools from "../util/tools";

function FacetValues(prop: {
    query: BaseQuery,
    propertyValueCount: PropertyValueCount|null,
    onValueClick: (p: PropertyFacet)=>void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet)=>void,
    onFilterContainsClick: (text: string, limit: number, property: Property) => void
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
            {prop.removable ? <span className={'fs-clickable'}
                                    onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
        </li>
    });



    let facetFilter = (!prop.removable ?
        <FacetFilter onFilterContainsClick={prop.onFilterContainsClick}
                     numberOfValues={prop.propertyValueCount.values.length}
                     property={prop.propertyValueCount.property}/>
        : <div/>);

    return <div>
        {facetFilter}
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
};

export default FacetValues;