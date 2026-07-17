import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import {Typography} from "@mui/material";

function ProductionStatusMenu() {
    // -- Hook ------------------------------------------
    const navigate = useNavigate();

    return (
        <div className="card-glass">
            <BackButton onClick={() => navigate("/admin")}/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="button-glass flex flex-col" style={{margin: "0"}} onClick={() => navigate("#") }>
                    <img src="/images/cutting.png" alt="sewing output" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color: "white"}}>WIP Cutting</Typography>
                </button>
                <button className="button-glass flex flex-col" style={{margin: "0"}} onClick={() => navigate("sewing-output") }>
                    <img src="/images/sewing-output.png" alt="sewing output" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color: "white"}}>WIP Sewing Output</Typography>
                </button>
                <button className="button-glass flex flex-col" style={{margin: "0"}} onClick={() => navigate("sewing-defect") }>
                    <img src="/images/sewing-defect.png" alt="sewing defects" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color:"white"}}>WIP Sewing Defects</Typography>
                </button>
                <button className="button-glass flex flex-col" style={{margin: "0"}} onClick={() => navigate("#") }>
                    <img src="/images/qc.png" alt="sewing output" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color: "white"}}>WIP Quality Control</Typography>
                </button>
                <button className="button-glass flex flex-col" style={{margin: "0"}} onClick={() => navigate("#") }>
                    <img src="/images/qc-defect.png" alt="sewing output" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color: "white"}}>WIP QC Defects</Typography>
                </button>
                <button className="button-glass flex flex-col" style={{margin: "0"}} onClick={() => navigate("#") }>
                    <img src="/images/packing.png" alt="sewing output" className="w-1/3 h-auto"/>
                    <Typography variant="h5" sx={{color: "white"}}>WIP Packing</Typography>
                </button>
            </div>
        </div>
    )
}
export default ProductionStatusMenu;