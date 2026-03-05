import { Outlet } from "react-router-dom";
import {Paper} from "@mui/material";

function Prefetch() {
    return <Paper elevation={0}><Outlet /></Paper>;
}

export default Prefetch;