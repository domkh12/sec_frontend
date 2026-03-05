import {Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";

function Logo(){
    const navigate = useNavigate();
    return(
        <button className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={"/images/sec_logo.png"} alt="logo" width="50%" height="100%"/>
            <Divider sx={{height: "40px", width: "10px" }} orientation="vertical" variant="middle" />
        </button>
    )
}

export default Logo;