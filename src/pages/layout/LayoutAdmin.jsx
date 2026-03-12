import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import {
    userApiSlice,
    useSetActiveMutation,
    useSetInactiveMutation
} from "../../redux/feature/user/userApiSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import store from "../../redux/app/store.js";


function LayoutAdmin(){
    const user = useSelector((state) => state.auth.profile);
    const [setActive] = useSetActiveMutation();
    const dispatch = useDispatch();
    const [setInactive] = useSetInactiveMutation();
    const { isConnected } = useWebsocketServer("/topic/updates");
    const { messages } = useWebsocketServer("/topic/users");
    useEffect(() => {
        if (!user?.id) return;

        if (isConnected) {
            setActive(user.id);
        }
        else {
            setInactive(user.id);
        }
    }, [isConnected, setActive, setInactive, user.id]);

    useEffect(() => {
        if (!messages) return;
        dispatch(userApiSlice.util.invalidateTags([{ type: "User", id: "LIST" }]));
    }, [dispatch, messages]);

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
        <main className="bg-main lg:pt-26 relative lg:px-10 px-0 pt-[68.01px]">
            <ParticlesBackground backgroundColor="transparent" dotCount={50}/>
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutAdmin;