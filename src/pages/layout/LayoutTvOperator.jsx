import NavBarCus from "../../components/ui/NavBarCus.jsx";
import MenuButton from "../../components/ui/MenuButton.jsx";
import {Backdrop, Grid} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useGetTvQuery} from "../../redux/feature/tv/tvApiSlice.js";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";
import {useSetActiveMutation, useSetInactiveMutation} from "../../redux/feature/user/userApiSlice.js";
import {useSelector} from "react-redux";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import {useEffect} from "react";
import store from "../../redux/app/store.js";


function LayoutTvOperator(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {data:tv, isLoading, isSuccess} = useGetTvQuery();
    const user = useSelector((state) => state.auth.profile);
    const [setActive] = useSetActiveMutation();
    const [setInactive] = useSetInactiveMutation();
    const { isConnected } = useWebsocketServer("/topic/updates");
    useEffect(() => {
        if (!user?.id) return;

        if (isConnected) {
            setActive(user.id);
        }
        else {
            setInactive(user.id);
        }
    }, [isConnected, user?.id]);

    // handle tab/browser close
    useEffect(() => {
        if (!user?.id) return;

        const handleBeforeUnload = () => {
            const token = store.getState().auth.token; // 👈 get token from store

            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}/inactive`, {
                method: "PATCH",
                keepalive: true,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [user?.id]);
    let content;

    if (isLoading) content = <Backdrop open={isLoading}/>;

    if (isSuccess) content = (
        <main className="bg-main py-16">
            <NavBarCus title={t("tv.title")} backUrl={"/manager"}/>
            <div className="flex justify-center items-center flex-wrap gap-10 pt-10">
                {tv.map((tv) => (
                    <MenuButton key={tv.id} title={tv.name} iconPath={"/images/smart-tv.png"} onClick={() => navigate(tv.name)}/>
                ))}
            </div>
        </main>
    )

    return content;
}

export default LayoutTvOperator;