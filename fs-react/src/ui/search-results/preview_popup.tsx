import React, {useContext, useState} from "react";
import {Document} from "../../common/datatypes";
import {WikiContext} from "../../index";
import ConfigUtils from "../../util/config_utils";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import PreviewIcon from '@mui/icons-material/Preview';

function PopupComponent(prop: {
    doc: Document,

}) {
    const wikiContext = useContext(WikiContext);
    const fileTypesToShowInOverlay = wikiContext.config['fs2gShowFileInOverlay'];

    const [openDialog, setOpenDialog] = useState(false);

    const validConfig = (typeof fileTypesToShowInOverlay === 'boolean' || fileTypesToShowInOverlay.length);
    if (!validConfig || fileTypesToShowInOverlay === true) {
        console.warn('fs2gShowFileInOverlay can either be set to "false" or to an array of file types, eg. ["pdf","png",... ].')
        return;
    }
    if (fileTypesToShowInOverlay === false) {
        return;
    }

    let previewUrlPropertyValues = prop.doc.getPropertyFacetValues("Diqa import fullpath")
    if (previewUrlPropertyValues.values.length === 0) {
        const oldPreviewUrlPropertyValues = prop.doc.getPropertyFacetValues("diqa_import_fullpath"); // fallback
        previewUrlPropertyValues = oldPreviewUrlPropertyValues ?? previewUrlPropertyValues;
    }

    const fileExtension = ConfigUtils.getFileExtension(previewUrlPropertyValues.values[0] as string);
    if (previewUrlPropertyValues.values.length === 0 || !fileTypesToShowInOverlay.includes(fileExtension)) {
        return;
    }

    return <React.Fragment>
            <span
                onClick={() => setOpenDialog(true) }
            ><PreviewIcon/></span>
        <PreviewPopup open={openDialog}
                      handleClose={() => setOpenDialog(false)}
                      url={previewUrlPropertyValues.values[0] as string}
        /></React.Fragment>
}

function PreviewPopup(prop: {
    open: boolean,
    handleClose: () => void,
    url: string
}) {
    const wikiContext = useContext(WikiContext);
    const ext = ConfigUtils.getFileExtension(prop.url);
    const mimeType = ConfigUtils.getFileType(ext);

    return (

        <Dialog
            maxWidth={"lg"}
            open={prop.open}
            onClose={prop.handleClose}
            aria-labelledby="preview-dialog-title"
            aria-describedby="preview-dialog-description"
        >
            <DialogTitle id="preview-dialog-title">
                {wikiContext.msg('fs-preview')}
            </DialogTitle>
            <DialogContent>
                <embed src={prop.url} width="800" height="600" type={mimeType} />
            </DialogContent>
            <DialogActions>
                <Button onClick={prop.handleClose} autoFocus>Ok</Button>
            </DialogActions>
        </Dialog>

    );
}

export default PopupComponent;