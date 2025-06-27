import {BaseQuery, FacetValue, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import Tools from "../util/tools";
import EventHandler from "../common/event_handler";

function SelectedFacetValues(prop: {
    query: BaseQuery,
    selectedPropertyFacet: PropertyFacet,
    property: Property
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
    removable: boolean

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
        [new FacetValue(prop.propertyValueCount.value, prop.propertyValueCount.mwTitle, prop.propertyValueCount.range)]);

    let itemId = Tools.createId(property.title + value + prop.propertyValueCount.count + prop.index);
    return <CustomTreeItem key={property.title + value + prop.propertyValueCount.count}
        itemId={itemId}
        actionIcon={prop.removable ? DeleteIcon : null}
        action={() => prop.eventHandler.onRemovePropertyFacet(prop.selectedPropertyFacet)}
        label={value + " (" + prop.propertyValueCount.count+")"}
        itemAction={() => prop.eventHandler.onValueClick(propertyFacet)}>

    </CustomTreeItem>


};

export default SelectedFacetValues;