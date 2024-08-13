import { forwardRef } from "react";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({ snack, setSnack }) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnack(false);
    };

    return (
        <>
            {snack.open &&
                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    open={snack.open} autoHideDuration={2500} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
                        {snack.message}
                    </Alert>
                </Snackbar>
            }
        </>
    );
}