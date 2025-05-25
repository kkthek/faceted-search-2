import React from "react";
import Client from "../common/client";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../common/event_handler";
import {Box} from "@mui/material";

function FacetExtensionPoint(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    return <Box>
        {/* Put your extension components here */}
    </Box>;
}

export default FacetExtensionPoint;