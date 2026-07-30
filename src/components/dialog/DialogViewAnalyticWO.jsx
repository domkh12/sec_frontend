import { Dialog } from "@mui/material";

function DialogViewAnalyticWO({isOpen, handleClose}) {
    return (
        <Dialog open={isOpen} onClose={handleClose} sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}>
            <div className="p-5 rounded-lg min-w-[400px]">
                ssdsada
            </div>
        </Dialog>   
    )
}

export default DialogViewAnalyticWO;