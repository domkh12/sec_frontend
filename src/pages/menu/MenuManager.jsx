import {Divider, Typography} from "@mui/material";
import {yellow} from "@mui/material/colors";
import MenuButton from "../../components/ui/MenuButton.jsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

function MenuManager(){
    const {t} = useTranslation();
    const navigate = useNavigate();

    return(
        <div className="flex flex-wrap justify-center items-start gap-5 pt-10 px-4">
            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('administration')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap justify-center items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('system')}</Typography>
                        <MenuButton title={t('settings')} iconPath={"/images/gear.png"} onClick={() => navigate("settings")}/>
                        <MenuButton title={t('auditLog')} iconPath={"/images/audit.png"} onClick={() => navigate("settings")}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('dataSetup')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap justify-center items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t("product.title")}</Typography>
                        <MenuButton title={`${t("product.title")}`} iconPath={"/images/football-shirt.png"} onClick={() => navigate("products")}/>
                        <MenuButton title={`${t("materials")}`} iconPath={"/images/material.png"} onClick={() => navigate("products")}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>HR Monitor</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                    <Typography variant={"body1"} sx={{color: yellow[600]}}>Quality Control</Typography>
                    <MenuButton
                        title="Input Data"
                        iconPath={"/images/smart-tv.png"}
                        onClick={() => navigate("tv-menu")}
                    />
                </div>
            </div>
        </div>
    )
}

export default MenuManager;