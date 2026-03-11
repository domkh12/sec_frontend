import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import MenuButton from "../../components/ui/MenuButton.jsx";
import TopBar from "../../components/ui/TopBar.jsx";
import {useGetTvQuery} from "../../redux/feature/tv/tvApiSlice.js";
import {Backdrop} from "@mui/material";
import MenuAddButton from "../../components/ui/MenuAddButton.jsx";
import {useDispatch} from "react-redux";
import {setIsOpenCreateTVDialog} from "../../redux/feature/tv/tvSlice.js";
import DialogAddTv from "../../components/dialog/DialogAddTv.jsx";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import useAuth from "../../hook/useAuth.jsx";

function MenuTv() {
    const navigate = useNavigate();
    const {isAdmin} = useAuth();
    const {t} = useTranslation();
    const {data:tv, isLoading, isSuccess} = useGetTvQuery();
    const dispatch = useDispatch();

    let content;
    if (isLoading) content = <Backdrop open={isLoading}/>;

    if (isSuccess) content = (
        <main>
            {/*<TopBar title={t("tv.title")} backUrl={"/manager"}/>*/}
            <BackButton onClick={() => navigate(`${isAdmin ? "/admin" : "/manager"}`)}/>
            <div className="flex flex-wrap gap-4 my-10 justify-center items-center">
                {tv.map((tv) => (
                    <MenuButton key={tv.id} title={tv.name} iconPath={"/images/smart-tv.png"} onClick={() => navigate(tv.name)}/>
                ))}
                <MenuAddButton onClick={() => dispatch(setIsOpenCreateTVDialog(true))}/>
            </div>
            <DialogAddTv/>
        </main>
    )

    return content;
}

export default MenuTv;