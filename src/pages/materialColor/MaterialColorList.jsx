import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsOpenDialogAddOrEditMaterialColor } from "../../redux/feature/materialColor/materialColorSlice";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import Seo from "../../components/seo/Seo";

function MaterialColorList() {


    // -- Hook -----------------------------------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation();


    return <div className="pb-10">
        <Seo title={t("Material Color List")}/>
        <div className="card-glass">
            <div className="flex justify-between items-center">
                <BackButton onClick={() => navigate("/admin")}/>
                <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditMaterialColor(true))}/>
            </div>
        </div>
    </div>
}

export default MaterialColorList;