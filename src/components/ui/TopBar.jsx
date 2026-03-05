import {Button, Grid, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';

function TopBar({title, backUrl}) {
    const theme = useTheme();
    const navigation = useNavigate();
    return(
        <nav className="w-full px-4 py-1 bg-gray-200 h-[72px] shadow-lg backdrop-blur-3xl flex items-center justify-between z-50 fixed top-0 left-0">
            <Grid size={4} className="flex justify-between items-center gap-10 py-1 px-4">
                <Button variant="contained" onClick={() => navigation(backUrl)}>
                    <ArrowLeftTwoToneIcon/>
                    Back
                </Button>
            </Grid>
            <Grid size={4}>
                <Typography variant="h4"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}
                >{title}</Typography>
            </Grid>
            <Grid size={4}>
                <div className="flex justify-center items-center gap-10 ">
                </div>
            </Grid>
        </nav>
    )
}

export default TopBar;