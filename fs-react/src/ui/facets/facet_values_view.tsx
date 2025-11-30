import {FacetValue, Property, PropertyFacet, ValueCount} from "../../common/datatypes";
import React from "react";
import DisplayTools from "../../util/display_tools";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import Tools from "../../util/tools";
import EventHandler from "../../common/event_handler";
import FacetWithCount from "../common/facet_with_count";

function FacetValues(prop: {
    property: Property,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
}) {

    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }

    const displayLabel = DisplayTools.serializeFacetValue(prop.property, prop.propertyValueCount);

    const property = prop.property;
    const facetValue = FacetValue.fromValueCount(prop.propertyValueCount);
    const propertyFacet = new PropertyFacet(property,[ facetValue ]);

    return <CustomTreeItem itemId={"facet-"+Tools.createItemIdForFacet(property, facetValue)}
                           label={<FacetWithCount displayTitle={displayLabel} count={prop.propertyValueCount.count} />}
                           itemAction={() => prop.eventHandler.onValueClick(propertyFacet)} />

};

export default FacetValues;