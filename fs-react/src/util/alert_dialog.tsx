import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {useContext} from "react";
import {WikiContext} from "../index";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export type AlertDialogState = {
    message: string,
    open: boolean
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
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Info</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
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