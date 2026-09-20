import React from "react";
import Client from "app/common/client";
import {SearchStateDocument, SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";


function FacetExtensionPoint(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    return <>
        {/* Put your extension components here */}
    </>;
}

export default FacetExtensionPoint;