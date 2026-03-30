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
                        {/*<MenuButton title={t('settings')} iconPath={"/images/gear.png"} onClick={() => navigate("settings")}/>*/}
                        {/*<MenuButton title={t('auditLog')} iconPath={"/images/audit.png"} onClick={() => navigate("settings")}/>*/}
                        <MenuButton title={t('settings')} iconPath={"/images/coming-soon.png"} onClick={() => navigate("/admin")}/>
                        <MenuButton title={t('auditLog')} iconPath={"/images/coming-soon.png"} onClick={() => navigate("/admin")}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('dataSetup')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap justify-center items-start gap-5">
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('factory.structure')}</Typography>
                        <MenuButton title={`${t("manage.department")}`} iconPath={"/images/production.png"} onClick={() => navigate("departments")}/>
                        <MenuButton title={`${t("product.line")}`} iconPath={"/images/production_line.png"} onClick={() => navigate("production-lines")}/>
                        {/*<MenuButton title={`${t('manage.shift')}`} iconPath={"/images/shift.png"} onClick={() => navigate("shifts")}/>*/}
                        <MenuButton title={`${t('manage.shift')}`} iconPath={"/images/coming-soon.png"} onClick={() => navigate("/admin")}/>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t("product.title")}</Typography>
                        <MenuButton title={`${t("product.title")}`} iconPath={"/images/football-shirt.png"} onClick={() => navigate("products")}/>
                        <MenuButton title={`${t("product.productCategory")}`} iconPath={"/images/product-categories.png"} onClick={() => navigate("categories")}/>
                        <MenuButton title={`${t("table.color")}`} iconPath={"/images/color-wheel.png"} onClick={() => navigate("colors")}/>
                        <MenuButton title={`${t("table.size")}`} iconPath={"/images/measuring-tape.png"} onClick={() => navigate("sizes")}/>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                        <Typography variant={"body1"} sx={{color: yellow[600]}}>{t("other")}</Typography>
                        <MenuButton title={`${t("table.buyer")}`} iconPath={"/images/investor.png"} onClick={() => navigate("buyers")}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('Production')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                    <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('Monitoring')}</Typography>
                    <MenuButton
                        title={`${t('TV Display')}`}
                        iconPath={"/images/smart-tv.png"}
                        onClick={() => navigate("tv")}
                    />
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full sm:w-auto">
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('purchaseOrder')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                    <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('po.transaction')}</Typography>
                    <MenuButton
                        title={`${t('Purchase Order')}`}
                        iconPath={"/images/order-fulfillment.png"}
                        onClick={() => navigate("purchase-orders")}
                    />
                </div>
            </div>

        </div>
    )
}

export default MenuAdmin;