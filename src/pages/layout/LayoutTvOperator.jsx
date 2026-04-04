import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";


function LayoutTvOperator(){
    return (
        <main className="bg-main py-16">
            <NavBarCus/>
            <Outlet/>
        </main>
    );
}

export default LayoutTvOperator;