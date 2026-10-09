import React, {useContext} from "react";
import {Property} from "app/common/property";
import {SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";
import Span from "app/custom_ui/span";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import {PropertyValueCount} from "app/common/response/property_value_count";


function ShowAllButton(prop: {
    property: Property,
    searchStateFacets: SearchStateFacet,
    eventHandler: EventHandler
    propertyValueCount?: PropertyValueCount
}) {
    const wikiContext = useContext(WikiContext);

    const shouldShowAllButton = prop.propertyValueCount?.hasNumberOfValues(wikiContext.config.fs2gFacetValueLimit)
        && prop.property.isFilterProperty()
        && prop.searchStateFacets.query.isValueLimitSet(prop.property);
    if (!shouldShowAllButton) {
        return;
    }

    const itemAction = () => {
        const facetsQuery = prop.searchStateFacets.query;
        const propertyValueQuery = facetsQuery.findPropertyValueQuery(prop.property);
        const filterText = propertyValueQuery?.valueContains ?? '';
        prop.eventHandler.onShowAllValues(prop.property, filterText);
    };

    const itemId = prop.property.title + "-showall";
    const label = <Span color={'secondary'}>{"[" + wikiContext.msg('fs-show-all') + "]"}</Span>;

    return <CustomTreeItem itemId={itemId}
                           label={label}
                           itemAction={itemAction}
    />;
}

export default ShowAllButton;