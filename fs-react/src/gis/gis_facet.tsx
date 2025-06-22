import React, {useState} from "react";
import Client from "../common/client";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../common/event_handler";
import {Box, Typography} from "@mui/material";

import GisDialog from "./gis_dialog";

function GisFacet(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {

    const [openOrDialog, setOpenOrDialog] = useState<boolean>(false);
    const handleCloseFacetOrDialog = () => {
        setOpenOrDialog(false);
    };

    return <Box>
        <Typography onClick={() => {
            setOpenOrDialog(true);
        }}>Open GIS</Typography>
        <GisDialog open={openOrDialog}
                       client={prop.client}
                       handleClose={handleCloseFacetOrDialog}
                       selectedFacets={prop.searchStateDocument.query.propertyFacets}
                       eventHandler={prop.eventHandler}
        />
    </Box>;
}

export default GisFacet;
