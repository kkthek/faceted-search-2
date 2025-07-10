import {BaseQuery, FacetValue, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import React from "react";
import DisplayTools from "../util/display_tools";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import Tools from "../util/tools";
import EventHandler from "../common/event_handler";
import FacetWithCount from "./facet_with_count";

function FacetValues(prop: {
    query: BaseQuery,
    property: Property,
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
        property,[
            new FacetValue(prop.propertyValueCount.value, prop.propertyValueCount.mwTitle, prop.propertyValueCount.range)
        ]);

    let itemId = Tools.createId(property.title + value + prop.propertyValueCount.count + prop.index);
    return <CustomTreeItem itemId={itemId}
                           label={<FacetWithCount
                               displayTitle={value}
                               count={prop.propertyValueCount.count}
                           />}
                           itemAction={() => {
                               prop.eventHandler.onValueClick(propertyFacet);

                           }
                           }>

    </CustomTreeItem>


};

export default FacetValues;