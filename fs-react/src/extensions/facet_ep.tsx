import React from "react";
import Client from "../common/client";
import EventHandler from "../common/event_handler";
import {SearchStateDocument, SearchStateFacet} from "../common/datatypes";
import GisFacet from "../gis/gis_facet";

function FacetExtensionPoint(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    return <>
        {/* Put your extension components here */}
        <GisFacet searchStateDocument={prop.searchStateDocument} eventHandler={prop.eventHandler} />
    </>;
}

export default FacetExtensionPoint;