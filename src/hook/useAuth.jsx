import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/authSlice";
import { jwtDecode } from "jwt-decode";

function useAuth() {
    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let isViewer = false;
    let status = ["MANAGER"];
    if (token) {
        const decoded = jwtDecode(token);

        const { jti: username, scope } = decoded;
        const roles = scope ? scope.split(" ") : [];

        isManager = scope.includes("ROLE_MANAGER");
        isAdmin = scope.includes("ROLE_ADMIN");
        isViewer = scope.includes("ROLE_VIEWER");

        if (isViewer) status = "Viewer";
        if (isAdmin) status = "Admin";
        if (isManager) status = "MANAGER";

        return { username, roles, status, isManager, isAdmin, isViewer };
    }

    return { username: "", roles: [], isManager, isAdmin, isViewer, status };
}

export default useAuth;