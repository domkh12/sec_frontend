import "./ui.css"
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import {useTranslation} from "react-i18next";
function MenuButton({title, onClick, iconPath}) {
    const {t} = useTranslation();
    return (
        <>
            <button className="button-26 z-10" role="button" onClick={onClick}>
                <div className="button-26__content">
                    {<img src={iconPath || "/images/coming-soon.png"} alt={title} className="w-8 h-8"/>}
                    <span className="button-26__text">
                       <p className="text-sm">{title || t("status.soon")}</p>
                    </span>
                </div>
            </button>
        </>
    )
}

export default MenuButton;