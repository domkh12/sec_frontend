import {useGetTvQuery} from "../../redux/feature/tv/tvApiSlice.js";
import MenuButton from "../../components/ui/MenuButton.jsx";
import {useNavigate} from "react-router-dom";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";

function MenuTvViewer() {
    const navigate = useNavigate();
    const {data:tv, isLoading, isSuccess} = useGetTvQuery();

    let content;

    if (isLoading) content = (<LoadingComponent/>);

    if (isSuccess) content = (
        <div className="flex justify-center items-center flex-wrap gap-10 pt-10">
            {tv.map((tv) => (
                <MenuButton key={tv.id} title={tv.name} iconPath={"/images/smart-tv.png"} onClick={() => navigate(tv.name)}/>
            ))}
        </div>
    )

    return content;
}

export default MenuTvViewer;