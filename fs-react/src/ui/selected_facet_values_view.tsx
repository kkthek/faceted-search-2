import {BaseQuery, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import Tools from "../util/tools";

function SelectedFacetValues(prop: {
    query: BaseQuery,
    selectedPropertyFacet: PropertyFacet,
    property: Property
    propertyValueCount: ValueCount | null,
    onValueClick: (p: PropertyFacet) => void,
    removable: boolean
    onRemoveClick: (p: PropertyFacet) => void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
    onExpandClick: (p: Property, limit: number) => void
    index: number
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

    let itemId = Tools.createId(property.title + value + prop.propertyValueCount.count + prop.index);
    return <CustomTreeItem key={property.title + value + prop.propertyValueCount.count}
        itemId={itemId}
        actionIcon={prop.removable ? DeleteIcon : null}
        action={() => prop.onRemoveClick(prop.selectedPropertyFacet)}
        label={value + " : " + prop.propertyValueCount.count}
        itemAction={() => prop.onValueClick(propertyFacet)}>

    </CustomTreeItem>


};

export default SelectedFacetValues;