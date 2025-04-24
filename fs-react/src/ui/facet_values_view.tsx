import {BaseQuery, Property, PropertyFacet, PropertyValueCount, ValueCount} from "../common/datatypes";
import React, {useContext} from "react";
import DisplayTools from "../util/display_tools";
import FacetFilter from "./facet_filter";
import {WikiContext} from "../index";
import {TreeItem} from "@mui/x-tree-view";

function FacetValues(prop: {
    query: BaseQuery,
    selectedPropertyFacet: PropertyFacet,
    property: Property
    propertyValueCount: ValueCount | null,
    onValueClick: (p: PropertyFacet) => void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet) => void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
    onExpandClick: (p: Property, limit: number) => void
}) {

    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }

    let value = DisplayTools.serializeFacetValue(prop.property, prop.propertyValueCount);

    let propertyFacet = prop.selectedPropertyFacet;
    if (!propertyFacet) {
        let property = prop.property;
        propertyFacet = new PropertyFacet(
            property.title,
            property.type,
            prop.propertyValueCount.value, prop.propertyValueCount.mwTitle, prop.propertyValueCount.range);
    }

    return <TreeItem itemId={value.toString() + prop.propertyValueCount.count}
                     label={value + " : " + prop.propertyValueCount.count}
                     onClick={() => prop.onValueClick(propertyFacet)}>
        {prop.removable ? <span className={'fs-clickable'}
                                onClick={() => prop.onRemoveClick(propertyFacet)}>[X]</span> : ''}
    </TreeItem>


};

export default FacetValues;