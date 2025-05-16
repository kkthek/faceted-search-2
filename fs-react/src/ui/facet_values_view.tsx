import {BaseQuery, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import Tools from "../util/tools";

function FacetValues(prop: {
    query: BaseQuery,
    property: Property
    propertyValueCount: ValueCount | null,
    onValueClick: (p: PropertyFacet) => void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet) => void
}) {

    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }

    let value = DisplayTools.serializeFacetValue(prop.property, prop.propertyValueCount);

    let property = prop.property;
    let propertyFacet = new PropertyFacet(
        property.title,
        property.type,
        prop.propertyValueCount.value, prop.propertyValueCount.mwTitle, prop.propertyValueCount.range);

    return <CustomTreeItem itemId={Tools.createId(value.toString() + prop.propertyValueCount.count)}
                           actionIcon={prop.removable ? DeleteIcon : null}
                           action={() => prop.onRemoveClick(propertyFacet)}
                           label={value + " : " + prop.propertyValueCount.count}
                           itemAction={() => prop.onValueClick(propertyFacet)}>

    </CustomTreeItem>


};

export default FacetValues;