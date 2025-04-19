import React, {useContext, useState} from "react";
import {Popover} from "@mui/material";
import {Document} from "../common/datatypes";
import {WikiContext} from "../index";
import ConfigUtils from "../util/config_utils";

function PopupComponent(prop: {
    doc: Document,

}) {
    let wikiContext = useContext(WikiContext);
    let fileTypesToShowInOverlay = wikiContext.config['fsg2ShowFileInOverlay'];

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };


    let validConfig = (typeof fileTypesToShowInOverlay === 'boolean' || fileTypesToShowInOverlay.length);
    if (!validConfig || fileTypesToShowInOverlay === true) {
        console.warn('fsg2ShowFileInOverlay can either be set to "false" or to an array of file types, eg. ["pdf","png",... ].')
        return;
    }

    let previewPopup;
    let previewUrlPropertyValues = prop.doc.getPropertyFacetValues("diqa import fullpath");
    if (fileTypesToShowInOverlay !== false && previewUrlPropertyValues.values.length > 0
        && fileTypesToShowInOverlay.includes(ConfigUtils.getFileExtension(previewUrlPropertyValues.values[0] as string))) {
        previewPopup = <span
            onClick={handlePopoverOpen}
        >[show preview]<PreviewPopup open={Boolean(anchorEl)}
                                     anchorEl={anchorEl}
                                     handlePopoverClose={handlePopoverClose}
                                     url={previewUrlPropertyValues.values[0] as string}
        /></span>;
    }
    return previewPopup;
}

function PreviewPopup(prop: {
    open: boolean,
    anchorEl: HTMLElement,
    handlePopoverClose: () => void,
    url: string
}) {


    return (

            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={prop.open}
                anchorEl={prop.anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={prop.handlePopoverClose}
                //disableRestoreFocus
            >

                <embed src={prop.url} width="500" height="375"
                       type="application/pdf" />
            </Popover>

    );
}

export default PopupComponent;