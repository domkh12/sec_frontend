import {Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

function NotFound(){
    const navigate = useNavigate();
    return(
        <div className="flex flex-col gap-10 justify-center items-center h-screen">
            <img src={"/images/no-results.png"} alt={"not found image"} className="w-1/5 h-auto"/>
            <Typography variant="h5">Oops! That page can’t be found.</Typography>
            <Button variant="contained" onClick={() => navigate("/login")}>Back</Button>
        </div>
    )
}

export default NotFound;