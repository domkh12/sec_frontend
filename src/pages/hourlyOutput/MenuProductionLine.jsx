import {useGetProductionLineLookupQuery} from "../../redux/feature/productionLine/productionLineApiSlice.js";
import MenuButton from "../../components/ui/MenuButton.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

function MenuProductionLine(){
    // -- Hook ---------------------------------------------------------------------------
    const navigate = useNavigate();

    // -- Query --------------------------------------------------------------------------
    const {data: prodLineData} = useGetProductionLineLookupQuery();

    return (
        <>
            <div className="card-glass">
                <BackButton onClick={() => navigate("/admin")}/>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {prodLineData?.map(data => (
                        <button className="button-glass flex flex-col" onClick={() => navigate(data.id) }>
                            <img src={data?.image || "/images/coming-soon.png"} alt="sewing output" className="w-1/3 h-auto"/>
                            <Typography variant="h5" sx={{color: "white"}}>{data.line}</Typography>
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default MenuProductionLine;