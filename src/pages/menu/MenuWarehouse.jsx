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
                <Typography variant="h6" sx={{color: yellow[600]}}>{t('Warehouse')}</Typography>
                <Divider variant="middle" sx={{width: "100%", backgroundColor: yellow[600], height: 3}}/>
                <div className="flex flex-wrap flex-col gap-4 my-10 justify-center items-center">
                    <Typography variant={"body1"} sx={{color: yellow[600]}}>{t('Raw Materials')}</Typography>
                    <MenuButton
                        title={`${t('WH Raw Materials')}`}
                        // iconPath={"/images/order-fulfillment.png"}
                        iconPath={"/images/warehouse.png"}
                        onClick={() => navigate("materials")}
                    />
                </div>
            </div>

        </div>
    )
}

export default MenuAdmin;