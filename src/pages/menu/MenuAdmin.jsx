import {Divider, Typography} from "@mui/material";
import {yellow} from "@mui/material/colors";
import MenuButton from "../../components/ui/MenuButton.jsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

function MenuAdmin(){
    const {t} = useTranslation();
    const navigate = useNavigate();

    return(
        <div className="flex justify-center items-start gap-5 pt-10">
            <div className="flex flex-col justify-center items-center">
                <Typography variant="h6" sx={{color: yellow[600]}}>Administration</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex justify-start items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('user.title')}</Typography>
                        <MenuButton title={t('user.title')} iconPath={"/images/user.png"} onClick={() => navigate("users")}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <Typography variant="h6" sx={{color: yellow[600]}}>Operations</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex justify-start items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>Data Setup</Typography>
                        <MenuButton title={`${t("manage.department")}`} iconPath={"/images/production.png"} onClick={() => navigate("departments")}/>
                        <MenuButton title={`${t("product.line")}`} iconPath={"/images/production_line.png"} onClick={() => navigate("production-lines")}/>
                        <MenuButton title={`${t("product.title")}`} iconPath={"/images/football-shirt.png"} onClick={() => navigate("products")}/>
                        <MenuButton title={`${t('manage.shift')}`} iconPath={"/images/shift.png"} onClick={() => navigate("shifts")}/>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>Data Setup</Typography>
                        <MenuButton title={`${t("tv.title")}`} iconPath={"/images/smart-tv.png"} onClick={() => navigate("tv")}/>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default MenuAdmin;