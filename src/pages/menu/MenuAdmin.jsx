import {Divider, Typography} from "@mui/material";
import {yellow} from "@mui/material/colors";
import MenuButton from "../../components/ui/MenuButton.jsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

function MenuAdmin(){
    const {t} = useTranslation();
    const navigate = useNavigate();

    return(
        <div className="flex flex-wrap justify-center items-start gap-5 pt-10 px-4">
            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('administration')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap justify-center items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t("accessControl")}</Typography>
                        <MenuButton title={t('user.title')} iconPath={"/images/team.png"} onClick={() => navigate("users")}/>
                        <MenuButton title={t('roles')} iconPath={"/images/insurance.png"} onClick={() => navigate("roles")}/>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('system')}</Typography>
                        <MenuButton title={t('settings')} iconPath={"/images/coming-soon.png"} onClick={() => navigate("/admin")}/>
                        <MenuButton title={t('auditLog')} iconPath={"/images/coming-soon.png"} onClick={() => navigate("/admin")}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('production')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>

                <div className="flex flex-wrap justify-center items-start gap-5">
                    <div className="flex flex-wrap justify-center items-start gap-5">
                        <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                            <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('factory.structure')}</Typography>
                            <MenuButton title={`${t("manage.department")}`} iconPath={"/images/production.png"} onClick={() => navigate("departments")}/>
                            <MenuButton title={`${t("product.line")}`} iconPath={"/images/production_line.png"} onClick={() => navigate("production-lines")}/>
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('monitoring')}</Typography>
                        <MenuButton
                            title={`${t('tvDisplay')}`}
                            iconPath={"/images/smart-tv.png"}
                            onClick={() => navigate("tv")}
                        />
                        <MenuButton
                            title={`${t('productionStatus')}`}
                            iconPath={"/images/productivity.png"}
                            onClick={() => navigate("production-status")}
                        />
                        <MenuButton
                            title={`${t('analytics')}`}
                            iconPath={"/images/analysis.png"}
                            onClick={() => navigate("analytics")}
                        />
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t("style")}</Typography>
                        <MenuButton title={`${t("style")}`} iconPath={"/images/football-shirt.png"} onClick={() => navigate("products")}/>
                        <MenuButton title={`${t("table.color")}`} iconPath={"/images/color-wheel.png"} onClick={() => navigate("colors")}/>
                        <MenuButton title={`${t("table.size")}`} iconPath={"/images/measuring-tape.png"} onClick={() => navigate("sizes")}/>
                        <MenuButton title={`${t("table.defectType")}`} iconPath={"/images/defect-type.png"} onClick={() => navigate("defect-types")}/>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t("po")}</Typography>
                        <MenuButton title={`${t("po")}`} iconPath={"/images/order-fulfillment.png"} onClick={() => navigate("purchase-orders")}/>
                        <MenuButton title={`${t("table.buyer")}`} iconPath={"/images/investor.png"} onClick={() => navigate("buyers")}/>

                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('planning')}</Typography>
                        <MenuButton
                            title={`${t('mo')}`}
                            iconPath={"/images/work-order.png"}
                            onClick={() => navigate("work-orders")}
                        />
                        <MenuButton
                            title={`${t('outputDetails')}`}
                            iconPath={"/images/production_1.png"}
                            onClick={() => navigate("output-details")}
                        />
                        <MenuButton
                            title={`${t('defectDetails')}`}
                            iconPath={"/images/shirt.png"}
                            onClick={() => navigate("defect-details")}
                        />
                        <MenuButton
                            title={`${t('qrGenerator')}`}
                            iconPath={"/images/qr-white.png"}
                            onClick={() => navigate("qr-generator")}
                        />
                        <MenuButton
                            title={`${t('qrScan')}`}
                            iconPath={"/images/qr-white.png"}
                            onClick={() => navigate("qr-scan")}
                        />
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('operations')}</Typography>
                        <MenuButton
                            title={`${t('hourlyOutput')}`}
                            iconPath={"/images/garment.png"}
                            onClick={() => navigate("hourly-output")}
                        />
                        <MenuButton
                            title={`${t('tvInput')}`}
                            iconPath={"/images/smart-tv.png"}
                            onClick={() => navigate("tv-menu")}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('warehouse')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                    <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('rawMaterials')}</Typography>
                    <MenuButton
                        title={`${t('whRawMaterials')}`}
                        iconPath={"/images/warehouse.png"}
                        onClick={() => navigate("materials")}
                    />
                </div>
            </div>

        </div>
    )
}

export default MenuAdmin;