import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {useDispatch, useSelector} from "react-redux";
import {
    setIsFullScreenDialogStockOut
} from "../../redux/feature/material/materialSlice.js";
import {useTranslation} from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogStockOut() {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    // -- Selector ----------------------------------------------------------------------
    const open = useSelector((s) => s.material.isFullScreenDialogStockOut);

    const handleClose = () => {
        dispatch(setIsFullScreenDialogStockOut(false));
    };

    return (
        <>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {t("table.stockOut")}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className="p-5">

                </div>

            </Dialog>
        </>
    );
}