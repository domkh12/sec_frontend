import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";

function DefectDetail() {

    const navigate = useNavigate();

    return (
        <div className='card-glass'>
            <div className="flex justify-between items-center">
                <BackButton onClick={() => navigate("/admin")}/>
            </div>
        </div>
    )
}

export default DefectDetail;