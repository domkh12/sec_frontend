import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";

function UserList(){
    const navigate = useNavigate();
    return(
    <div className="rounded-lg bg-white z-100">
        <BackButton onClick={() => navigate("/manager")}/>
    </div>
    )
}

export default UserList;