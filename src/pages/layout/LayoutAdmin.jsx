import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import {
    userApiSlice,
} from "../../redux/feature/user/userApiSlice.js";
import {useDispatch} from "react-redux";
import {useEffect} from "react";


function LayoutAdmin(){
    const dispatch = useDispatch();
    const { messages } = useWebsocketServer("/topic/users");

    useEffect(() => {
        if (!messages) return;
        dispatch(userApiSlice.util.invalidateTags([{ type: "User", id: "LIST" }]));
        dispatch(userApiSlice.util.invalidateTags([{ type: "UserStats", id: "LIST" }]));
    }, [dispatch, messages]);


    return (
        <main className="bg-main lg:pt-26 relative lg:px-10 px-0 pt-[68.01px]">
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutAdmin;