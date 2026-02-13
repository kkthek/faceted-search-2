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

export type AlertDialogState = {
    open: boolean
    message?: string,
}

function AlertDialogSlide(prop: {
    state: AlertDialogState,
    callbackOnOk: () => void
}) {
    const wikiContext = useContext(WikiContext);

    return (
        <Dialog
            open={prop.state.open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={prop.callbackOnOk}
        >
            <DialogTitle>Info</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {prop.state.message ? prop.state.message : ''}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={prop.callbackOnOk}>{wikiContext.msg('fs-ok')}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialogSlide;