import {Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useAuth from "../../hook/useAuth.jsx";

function Logo(){
    const navigate = useNavigate();
    const {isAdmin, isManager, isViewer} = useAuth();
    const handleNavigate = () => {
        if(isAdmin) navigate("/admin");
        else if(isManager) navigate("/manager");
        else if(isViewer) navigate("/tv");
    }
    return(
        <button className="flex items-center gap-2 cursor-pointer" onClick={handleNavigate}>
            <img src={"/images/sec_logo.png"} alt="logo" width="50%" height="100%"/>
            <Divider sx={{height: "40px", width: "10px" }} orientation="vertical" variant="middle" />
        </button>
    )
}

export default Logo;