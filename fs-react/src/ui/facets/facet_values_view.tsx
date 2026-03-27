import React, {useContext} from "react";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import IdTools from "../../util/id_tools";
import EventHandler from "../../common/event_handler";
import FacetWithCount from "../common/facet_with_count";
import {Property} from "../../common/property";
import {FacetValue} from "../../common/request/facet_value";
import {PropertyFacet} from "../../common/request/property_facet";
import {ValueCount} from "../../common/response/value_count";
import ConfigUtils from "../../util/config_utils";
import {WikiContext} from "../../index";

function FacetValues(prop: {
    property: Property,
    propertyValueCount: ValueCount | null,
    eventHandler: EventHandler
}) {

    const wikiContext = useContext(WikiContext);
    if (prop.propertyValueCount === null || !prop.property) {
        return;
    }

    const displayLabel = prop.propertyValueCount.getDisplayText(ConfigUtils.context(wikiContext));

    const property = prop.property;
    const facetValue = FacetValue.fromValueCount(prop.propertyValueCount);
    const propertyFacet = new PropertyFacet(property,[ facetValue ]);

    return <CustomTreeItem itemId={"facet-"+IdTools.createItemIdForFacet(property, facetValue)}
                           label={<FacetWithCount displayTitle={displayLabel} count={prop.propertyValueCount.count} />}
                           itemAction={() => prop.eventHandler.onValueClick(propertyFacet)} />

}

export default FacetValues;