import React, {useContext} from "react";
import {Property} from "app/common/property";
import {SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";
import {FacetsQuery} from "app/common/request/facets_query";
import Span from "app/custom_ui/span";
import CustomTreeItem from "app/custom_ui/custom_tree_item";


function ShowAllButton(prop: {
    property: Property,
    searchStateFacets: SearchStateFacet,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);

    const itemAction = () => {
        const facetsQuery = prop.searchStateFacets.query as FacetsQuery;
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