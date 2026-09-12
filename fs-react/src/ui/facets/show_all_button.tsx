import CustomTreeItem from "../../custom_ui/custom_tree_item";
import Span from "../../custom_ui/span";
import {FacetsQuery} from "../../common/request/facets_query";
import React, {useContext} from "react";
import {SearchStateFacet} from "../../common/datatypes";
import EventHandler from "../../common/event_handler";
import {Property} from "../../common/property";
import {WikiContext} from "../../index";


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