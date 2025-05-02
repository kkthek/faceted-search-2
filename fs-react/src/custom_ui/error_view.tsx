import {Alert, Button, IconButton, Snackbar, SnackbarCloseReason} from "@mui/material";
import React from "react";

function ErrorView(prop: {
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>
}) {

    const handleErrorClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        prop.setError('');
    };

    return <Snackbar
        open={prop.error !== ''}
        autoHideDuration={6000}
        onClose={handleErrorClose}
    >
        <Alert
            onClose={handleErrorClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
        >
            {prop.error}
        </Alert>
    </Snackbar>
}

export default ErrorView;