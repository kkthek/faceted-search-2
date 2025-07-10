import React, {useContext, useState} from "react";
import EventHandler, {SearchStateDocument} from "../common/event_handler";
import {Box} from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';

import GisDialog from "./gis_dialog";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import {WikiContext} from "../index";

function GisFacet(prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    let wikiContext = useContext(WikiContext);
    const [openOrDialog, setOpenOrDialog] = useState<boolean>(false);

    return <Box>
        <CustomTreeItem itemId={'fs-gis-button'}
                        label={wikiContext.msg('fs-open-gis-browser')}
                        actionIcon={RoomIcon}
                        onClick={() => setOpenOrDialog(true)} />

        <GisDialog open={openOrDialog}
                   handleClose={() => setOpenOrDialog(false)}
                   selectedFacets={prop.searchStateDocument.query.propertyFacets}
                   eventHandler={prop.eventHandler}
        />
    </Box>;
}

export default GisFacet;
