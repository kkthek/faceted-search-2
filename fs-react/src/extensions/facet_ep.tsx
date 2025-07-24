import React from "react";
import Client from "../common/client";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../common/event_handler";
import GisFacet from "../gis/gis_facet";

function FacetExtensionPoint(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    return <React.Fragment>
        {/* Put your extension components here */}
        <GisFacet searchStateDocument={prop.searchStateDocument} eventHandler={prop.eventHandler} />
    </React.Fragment>;

}

export default FacetExtensionPoint;