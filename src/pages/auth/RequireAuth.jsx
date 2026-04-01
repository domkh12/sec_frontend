import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import {Paper} from "@mui/material";

function RequireAuth({ allowedRoles }) {
    const location = useLocation();

    const { roles } = useAuth();
    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet/>
            : <Navigate to="/unauthorize" state={{ from : location }} replace/>
    )

    return content;
}

export default RequireAuth;