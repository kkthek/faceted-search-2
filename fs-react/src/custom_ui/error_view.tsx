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

    const errorText = prop.error.length > 200 ? prop.error.substring(0, 200) + "..." : prop.error;

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
            {errorText}
        </Alert>
    </Snackbar>
}

export default ErrorView;