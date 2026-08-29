import React from "react";
import Client from "../common/client";
import EventHandler from "../common/event_handler";
import {SearchStateDocument, SearchStateFacet} from "../common/datatypes";
import {Box} from "@mui/material";

function HeaderExtensionPoint(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    return <Box className="fs-header-extension-point">

        {/* Put your extension components here */}

    </Box>;
}

export default HeaderExtensionPoint;