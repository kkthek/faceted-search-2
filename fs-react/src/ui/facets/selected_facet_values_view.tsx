import {FacetValue, PropertyFacet, ValueCount} from "../../common/datatypes";
import React from "react";
import DisplayTools from "../../util/display_tools";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import Tools from "../../util/tools";
import EventHandler from "../../common/event_handler";
import FacetWithCount from "../common/facet_with_count";

function SelectedFacetValues(prop: {
    selectedPropertyFacet: PropertyFacet,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler

}) {

    if (prop.propertyValueCount === null || !prop.selectedPropertyFacet) {
        return;
    }

    const property = prop.selectedPropertyFacet.property;
    const displayValue = DisplayTools.serializeFacetValue(property, prop.propertyValueCount);
    const facetValue = FacetValue.fromValueCount(prop.propertyValueCount);
    const propertyFacet = new PropertyFacet(property, [facetValue]);
    const removable = property.isRangeProperty() ? false : prop.selectedPropertyFacet.containsFacet(facetValue);

    const onRemovePropertyFacet = () => {
        if (!removable) return;
        prop.eventHandler.onRemovePropertyFacet(propertyFacet, facetValue);
    }

    return <CustomTreeItem key={property.title + displayValue + prop.propertyValueCount.count}
        itemId={Tools.secureUUIDV4()}
        actionIcon={removable ? DeleteIcon : null}
        action={onRemovePropertyFacet}
        label={<FacetWithCount
            displayTitle={displayValue}
            count={prop.propertyValueCount.count}
        />}
        itemAction={() => prop.eventHandler.onValueClick(propertyFacet)}>

    </CustomTreeItem>


};

export default SelectedFacetValues;