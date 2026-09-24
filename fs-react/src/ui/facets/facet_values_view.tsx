import React, {useContext} from "react";
import {ValueCount} from "app/common/response/value_count";
import {Property} from "app/common/property";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";
import {FacetValue} from "app/common/request/facet_value";
import {PropertyFacet} from "app/common/request/property_facet";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import IdTools from "app/util/id_tools";
import FacetWithCount from "app/ui/common/facet_with_count";

function FacetValues(prop: {
    property: Property,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
}) {

    const wikiContext = useContext(WikiContext);
    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }

    const displayLabel = prop.propertyValueCount.getDisplayText(wikiContext);

    const property = prop.property;
    const facetValue = FacetValue.fromValueCount(prop.propertyValueCount);
    const propertyFacet = new PropertyFacet(property,[ facetValue ]);

    return <CustomTreeItem itemId={"facet-"+IdTools.createItemIdForFacet(property, facetValue)}
                           label={<FacetWithCount displayTitle={displayLabel} count={prop.propertyValueCount.count} />}
                           itemAction={() => prop.eventHandler.onValueClick(propertyFacet)} />

}

export default FacetValues;