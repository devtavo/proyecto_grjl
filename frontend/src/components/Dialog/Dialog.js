import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
export default function FormDialog({ open = false, maxWidth = 'sm', title, handleClose, children }) {
    return (
        <Dialog PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title" open={open} maxWidth={maxWidth} onClose={handleClose} >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <div style={{ margin: '5px 0px' }}>
                    {children}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
