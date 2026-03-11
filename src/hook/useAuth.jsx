import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/authSlice";
import { jwtDecode } from "jwt-decode";

function useAuth() {
    const token = useSelector(selectCurrentToken);
    let isHrManager = false;
    let isAdmin = false;
    let isViewer = false;
    let status = ["HR_Manager"];
    if (token) {
        const decoded = jwtDecode(token);

        const { jti: username, scope } = decoded;
        const roles = scope ? scope.split(" ") : [];

        isHrManager = scope.includes("ROLE_HR_MANAGER");
        isAdmin = scope.includes("ROLE_ADMIN");
        isViewer = scope.includes("ROLE_VIEWER");

        if (isViewer) status = "Viewer";
        if (isAdmin) status = "Admin";
        if (isHrManager) status = "HR_Manager";

        return { username, roles, status, isHrManager, isAdmin, isViewer };
    }

    return { username: "", roles: [], isHrManager, isAdmin, isViewer, status };
}

export default useAuth;