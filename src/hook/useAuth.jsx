import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/authSlice";
import { jwtDecode } from "jwt-decode";

function useAuth() {
    const token = useSelector(selectCurrentToken);
    let isProductionManager = false;
    let isAdmin = false;
    let isTvOperator = false;
    let status = ["Production_Manager"];
    if (token) {
        const decoded = jwtDecode(token);

        const { jti: username, scope } = decoded;
        const roles = scope ? scope.split(" ") : [];

        isProductionManager = scope.includes("ROLE_PRODUCTION_MANAGER");
        isAdmin = scope.includes("ROLE_ADMIN");
        isTvOperator = scope.includes("ROLE_TV_OPERATOR");

        if (isTvOperator) status = "Tv_Operator";
        if (isAdmin) status = "Admin";
        if (isProductionManager) status = "Production_Manager";

        return { username, roles, status, isProductionManager, isAdmin, isTvOperator };
    }

    return { username: "", roles: [], isProductionManager, isAdmin, isTvOperator, status };
}

export default useAuth;