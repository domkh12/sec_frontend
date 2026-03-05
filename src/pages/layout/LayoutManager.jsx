import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";


function LayoutManager(){
    return (
        <main className="bg-main py-26 relative px-10">
            <ParticlesBackground backgroundColor="transparent" dotCount={50}/>
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutManager;