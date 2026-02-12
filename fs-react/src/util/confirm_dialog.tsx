import * as React from 'react';
import {useContext} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {WikiContext} from "../index";
import {Transition} from "../custom_ui/transition";

export type ConfirmDialogState = {
    open: boolean
    message?: string,
}

function ConfirmDialogSlide(prop: {
    state: ConfirmDialogState,
    callbackOnOk: () => void
    callbackOnCancel: () => void
}) {
    const wikiContext = useContext(WikiContext);

    return (
        <Dialog
            open={prop.state.open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={prop.callbackOnCancel}
        >
            <DialogTitle>{wikiContext.msg('fs-please-confirm')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {prop.state.message ? prop.state.message : ''}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={prop.callbackOnOk}>{wikiContext.msg('fs-ok')}</Button>
                <Button onClick={prop.callbackOnCancel}>{wikiContext.msg('fs-cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialogSlide;