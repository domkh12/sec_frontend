import {useTranslation} from "react-i18next";

function MenuAddButton({onClick}){
    const {t} = useTranslation();
    return (
        <>
            <button className="button-26 z-10" role="button" onClick={onClick}>
                <div className="button-26__content">
                    <span className="button-26__text flex flex-col justify-center items-center gap-3 text">
                       {<img src={"/images/add.png"} alt={"addNewButton"} className="w-12 h-12"/>}
                        <p className="text-sm">{t("buttons.addNew")}</p>
                    </span>
                </div>
            </button>
        </>
    )
}

export default MenuAddButton;