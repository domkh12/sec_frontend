import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import {Typography} from "@mui/material";

function WorkOrderStatusMenu() {
    // -- Hook ------------------------------------------
    const navigate = useNavigate();

    return (
        <div className="card-glass">
            <BackButton onClick={() => navigate("/admin")}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="button-glass flex flex-col" onClick={() => navigate("sewing-output") }>
                    <img src="/images/sewing-output.png" alt="sewing output" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color: "white"}}>WIP Sewing Output</Typography>
                </button>
                <button className="button-glass flex flex-col" onClick={() => navigate("#") }>
                    <img src="/images/sewing-defect.png" alt="sewing defects" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color:"white"}}>WIP Sewing Defects</Typography>
                </button>
            </div>
        </div>
    )
}
export default WorkOrderStatusMenu;