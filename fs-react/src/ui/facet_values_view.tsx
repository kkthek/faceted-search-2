import {FacetValue, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import Tools from "../util/tools";
import EventHandler from "../common/event_handler";
import FacetWithCount from "./facet_with_count";

function FacetValues(prop: {
    property: Property,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
}) {

    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }

    let displayLabel = DisplayTools.serializeFacetValue(prop.property, prop.propertyValueCount);

    let property = prop.property;
    let propertyFacet = new PropertyFacet(property,[ FacetValue.fromValueCount(prop.propertyValueCount) ]);

    return <CustomTreeItem itemId={Tools.secureUUIDV4()}
                           label={<FacetWithCount displayTitle={displayLabel} count={prop.propertyValueCount.count} />}
                           itemAction={() => prop.eventHandler.onValueClick(propertyFacet)} />

};

export default FacetValues;