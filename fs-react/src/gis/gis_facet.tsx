import React, {useContext, useState} from "react";
import EventHandler, {SearchStateDocument} from "../common/event_handler";
import RoomIcon from '@mui/icons-material/Room';

import GisDialog from "./gis_dialog";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import {WikiContext} from "../index";
import {createPortal} from "react-dom";

function GisFacet(prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return <>
        <CustomTreeItem itemId={'fs-gis-button'}
                        label={wikiContext.msg('fs-open-gis-browser')}
                        actionIcon={RoomIcon}
                        onClick={() => setOpenDialog(true)} />

        {createPortal(<GisDialog open={openDialog}
                   handleClose={() => setOpenDialog(false)}
                   baseQuery={prop.searchStateDocument.query}
                   eventHandler={prop.eventHandler}
        />, document.body)}
    </>;
}

export default GisFacet;
