import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useGetTvQuery} from "../../redux/feature/tv/tvApiSlice.js";
import {Backdrop} from "@mui/material";
import MenuButton from "../../components/ui/MenuButton.jsx";
import BackButton from "../../components/ui/BackButton.jsx";

function MenuTvFetched(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {data:tv, isLoading, isSuccess} = useGetTvQuery();

    let content;

    if (isLoading) content = <Backdrop open={isLoading}/>;

    if (isSuccess) content = (
        <div>
            <BackButton onClick={() => navigate("/admin")}/>
            <div className="flex justify-center items-center flex-wrap gap-10 pt-10">
                {tv.map((tv) => (
                    <MenuButton key={tv.id} title={tv.name} iconPath={"/images/smart-tv.png"} onClick={() => navigate(tv.name)}/>
                ))}
            </div>
        </div>
    )

    return content;
}

export default MenuTvFetched;