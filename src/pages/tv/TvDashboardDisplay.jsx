import {useParams} from "react-router-dom";
import TvGeneralDisplay from "./TvGeneralDisplay.jsx";
import TVLineDisplay from "./TVLineDisplay.jsx";

function TvDashboardDisplay(){
    const {name} = useParams();
    let content;
    if (name === "General"){
        content = (<TvGeneralDisplay/>);
    }else{
        content = (<TVLineDisplay/>);
    }

    return <div className="absolute top-0 left-0 h-full w-full z-50">{content}</div>;
}

export default TvDashboardDisplay