import {useTranslation} from "react-i18next";

function DataNotFound() {
    const {t} = useTranslation();
    return(
        <div className="flex flex-col gap-5 justify-center items-center p-5">
            <img src={"/images/no-data.png"} alt={"not found image"} className="w-1/10 hz-auto"/>
            <p>{t("table.noData")}</p>
        </div>
    )
}

export default DataNotFound;