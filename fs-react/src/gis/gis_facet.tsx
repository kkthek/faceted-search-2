import React, {useContext, useState} from "react";
import RoomIcon from '@mui/icons-material/Room';
import EventHandler from "app/common/event_handler";
import {SearchStateDocument} from "app/common/datatypes";
import {WikiContext} from "app/index";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import {createPortal} from "react-dom";
import GisDialog from "app/gis/gis_dialog";


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
