import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";
import useWebsocketServer from "../../hook/useWebsocketServer.js";


function LayoutManager(){
    const { messages } = useWebsocketServer("/topic/users");
    return (
        <main className="bg-main py-26 relative px-10">
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutManager;