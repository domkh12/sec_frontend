import {Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useLocalStorage from "../../hook/useLocalStorage.jsx";
import {useEffect} from "react";

function Unauthorize(){
    const navigate = useNavigate();
    const [authData, setAuthData] = useLocalStorage('authData', {
        isRemember: false,
        userRoles: "",
        username: null
    });

    useEffect(() => {
        setAuthData({
            isRemember: false,
            userRoles: "",
            username: null
        });
    }, []);
    return(<div className="flex flex-col gap-10 justify-center items-center h-screen">
        <img src={"/images/unauthorized-access.png"} alt={"not found image"} className="w-1/5 h-auto"/>
        <Typography variant="h5" sx={{color: "white"}}>Sorry, you are not authorized to access this page.</Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>Back</Button>
    </div>)
}

export default Unauthorize