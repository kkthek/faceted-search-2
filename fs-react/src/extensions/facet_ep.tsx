import React from "react";
import Client from "../common/client";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../common/event_handler";
import {Box} from "@mui/material";
import GisFacet from "../gis/gis_facet";

function FacetExtensionPoint(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    return <Box>
        {/* Put your extension components here */}
        <GisFacet client={prop.client}
                  searchStateDocument={prop.searchStateDocument}
                  searchStateFacets={prop.searchStateFacets}
                  expandedFacets={prop.expandedFacets}
                  eventHandler={prop.eventHandler}/>
    </Box>;
}

export default FacetExtensionPoint;