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

function ConfirmDialogSlide(prop: {
    open: boolean,
    label: string,
    callbackOnOk: () => void
    callbackOnCancel: () => void
}) {
    const wikiContext = useContext(WikiContext);

    return (
        <Dialog
            open={prop.open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={prop.callbackOnCancel}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{wikiContext.msg('fs-please-confirm')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {prop.label}
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