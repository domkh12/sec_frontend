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
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('Production')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>

                <div className="flex flex-wrap justify-center items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('Monitoring')}</Typography>
                        <MenuButton
                            title={`${t('TV Display')}`}
                            iconPath={"/images/smart-tv.png"}
                            onClick={() => navigate("tv")}
                        />
                        <MenuButton
                            title={`${t('Production Status')}`}
                            iconPath={"/images/productivity.png"}
                            onClick={() => navigate("production-status")}
                        />
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('Planing')}</Typography>
                        <MenuButton
                            title={`${t('Work Orders')}`}
                            iconPath={"/images/work-order.png"}
                            // iconPath={"/images/coming-soon.png"}
                            onClick={() => navigate("work-orders")}
                        />
                        <MenuButton
                            title={`${t('QR Generator')}`}
                            iconPath={"/images/qr-white.png"}
                            // iconPath={"/images/coming-soon.png"}
                            onClick={() => navigate("qr-generator")}
                        />
                        <MenuButton
                            title={`${t('QR Scan')}`}
                            iconPath={"/images/qr-white.png"}
                            // iconPath={"/images/coming-soon.png"}
                            onClick={() => navigate("qr-scan")}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>Operations</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                    <Typography variant={"body1"} sx={{color: yellow[600]}}>Production Input</Typography>
                    <MenuButton
                        title="Hourly Output"
                        iconPath={"/images/smart-tv.png"}
                        onClick={() => navigate("tv-menu")}
                    />
                </div>
            </div>
        </div>
    )
}

export default MenuManager;