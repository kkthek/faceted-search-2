import React from "react";

import {Box} from "@mui/material";
import {SearchStateDocument, SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import Client from "app/common/client";

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