import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";
import {useSelector} from "react-redux";
import {useSetActiveMutation, useSetInactiveMutation} from "../../redux/feature/user/userApiSlice.js";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import {useEffect} from "react";
import store from "../../redux/app/store.js";


function LayoutManager(){
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
    return (
        <main className="bg-main py-26 relative px-10">
            <ParticlesBackground backgroundColor="transparent" dotCount={50}/>
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutManager;