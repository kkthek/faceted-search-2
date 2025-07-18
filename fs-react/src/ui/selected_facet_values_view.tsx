import {FacetValue, PropertyFacet, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import Tools from "../util/tools";
import EventHandler from "../common/event_handler";
import FacetWithCount from "./facet_with_count";

function SelectedFacetValues(prop: {
    selectedPropertyFacet: PropertyFacet,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
    removable: boolean

    index: number
}) {

    if (prop.propertyValueCount === null || !prop.selectedPropertyFacet) {
        return;
    }

    let property = prop.selectedPropertyFacet.property;
    let value = DisplayTools.serializeFacetValue(property, prop.propertyValueCount);

    let facetValue = new FacetValue(prop.propertyValueCount.value, prop.propertyValueCount.mwTitle, prop.propertyValueCount.range);
    let propertyFacet = new PropertyFacet(
        property,
        [
            facetValue
        ]);

    let itemId = Tools.createId(property.title + value + prop.propertyValueCount.count + prop.index);
    return <CustomTreeItem key={property.title + value + prop.propertyValueCount.count}
        itemId={itemId}
        actionIcon={prop.removable ? DeleteIcon : null}
        action={() => prop.eventHandler.onRemovePropertyFacet(prop.selectedPropertyFacet, facetValue)}
        label={<FacetWithCount
            displayTitle={value}
            count={prop.propertyValueCount.count}
        />}
        itemAction={() => prop.eventHandler.onValueClick(propertyFacet)}>

    </CustomTreeItem>


};

export default SelectedFacetValues;