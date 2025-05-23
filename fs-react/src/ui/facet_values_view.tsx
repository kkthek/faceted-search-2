import {BaseQuery, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import React, {Dispatch, SetStateAction} from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import Tools from "../util/tools";
import EventHandler from "../common/event_handler";

function FacetValues(prop: {
    query: BaseQuery,
    property: Property,
    expandedFacets: [string[], Dispatch<SetStateAction<string[]>>],
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
    removable: boolean
    index: number
}) {

    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }
    const [expandedFacets, setExpandedFacets] = prop.expandedFacets;
    let value = DisplayTools.serializeFacetValue(prop.property, prop.propertyValueCount);

    let property = prop.property;
    let propertyFacet = new PropertyFacet(
        property.title,
        property.type,
        prop.propertyValueCount.value, prop.propertyValueCount.mwTitle, prop.propertyValueCount.range);

    let itemId = Tools.createId(property.title + value + prop.propertyValueCount.count + prop.index);
    return <CustomTreeItem itemId={itemId}
                           actionIcon={prop.removable ? DeleteIcon : null}
                           action={() => prop.eventHandler.onRemovePropertyFacet(propertyFacet)}
                           label={value + " : " + prop.propertyValueCount.count}
                           itemAction={() => {
                               prop.eventHandler.onValueClick(propertyFacet);
                               setExpandedFacets([...expandedFacets, prop.property.title]);
                           }
                           }>

    </CustomTreeItem>


};

export default FacetValues;