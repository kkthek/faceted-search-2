import React, {useContext} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {PropertyFacet} from "app/common/request/property_facet";
import {ValueCount} from "app/common/response/value_count";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";
import {FacetValue} from "app/common/request/facet_value";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import IdTools from "app/util/id_tools";
import FacetWithCount from "app/ui/common/facet_with_count";

function SelectedFacetValues(prop: {
    selectedPropertyFacet: PropertyFacet,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler

}) {
    const wikiContext = useContext(WikiContext);
    if (prop.propertyValueCount === null || !prop.selectedPropertyFacet) {
        return;
    }

    const property = prop.selectedPropertyFacet.property;
    const displayValue = prop.propertyValueCount.getDisplayText(wikiContext);
    const facetValue = FacetValue.fromValueCount(prop.propertyValueCount);
    const propertyFacet = new PropertyFacet(property, [facetValue]);
    const removable = property.isRangeProperty() ? false : prop.selectedPropertyFacet.containsValue(facetValue);

    const onRemovePropertyFacet = () => {
        if (!removable) return;
        prop.eventHandler.onRemovePropertyFacet(propertyFacet, facetValue);
    }

    return <CustomTreeItem key={property.title + displayValue + prop.propertyValueCount.count}
        itemId={"selected-"+IdTools.createItemIdForFacet(property, facetValue)}
        actionIcon={removable ? DeleteIcon : null}
        action={onRemovePropertyFacet}
        label={<FacetWithCount
            displayTitle={displayValue}
            count={prop.propertyValueCount.count}
        />}
        itemAction={() => prop.eventHandler.onValueClick(propertyFacet)}>

    </CustomTreeItem>


}

export default SelectedFacetValues;