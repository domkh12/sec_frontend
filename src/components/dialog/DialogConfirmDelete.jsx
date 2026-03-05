import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

function DialogConfirmDelete({ isOpen = false, onClose, title, handleDelete }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "10px",
                    width: "400px",
                    padding: "10px",
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                Delete {title}?
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Once deleted, you cannot get it back.
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ pb: 1, px: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    No, Keep It
                </Button>
                <Button onClick={handleDelete} variant="contained" color="error">
                    Yes, Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogConfirmDelete;