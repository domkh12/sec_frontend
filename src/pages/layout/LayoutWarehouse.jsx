import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";


function LayoutAdmin(){
    return (
        <main className="bg-main lg:pt-26 relative lg:px-10 px-0 pt-[68.01px]">
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutAdmin;