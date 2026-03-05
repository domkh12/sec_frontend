import NavBarCus from "../../components/ui/NavBarCus.jsx";
import MenuButton from "../../components/ui/MenuButton.jsx";
import {Backdrop, Grid} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useGetTvQuery} from "../../redux/feature/tv/tvApiSlice.js";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";


function LayoutTvOperator(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {data:tv, isLoading, isSuccess} = useGetTvQuery();

    let content;

    if (isLoading) content = <Backdrop open={isLoading}/>;

    if (isSuccess) content = (
        <main className="bg-main py-16">
            <ParticlesBackground backgroundColor={"transparent"} dotCount={50}/>
            <NavBarCus title={t("tv.title")} backUrl={"/manager"}/>
            <div className="flex justify-center items-center flex-wrap gap-10 pt-10">
                {tv.map((tv) => (
                    <MenuButton key={tv.id} title={tv.name} iconPath={"/images/smart-tv.png"} onClick={() => navigate(tv.name)}/>
                ))}
            </div>
        </main>
    )

    return content;
}

export default LayoutTvOperator;