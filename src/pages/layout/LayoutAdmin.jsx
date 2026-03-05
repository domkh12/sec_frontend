import NavBarCus from "../../components/ui/NavBarCus.jsx";
import {Outlet} from "react-router-dom";
import ParticlesBackground from "../../components/ui/ParticlesBackground.jsx";


function LayoutAdmin(){
    return (
        <main className="bg-main lg:pt-26 relative lg:px-10 px-0 pt-[68.01px]">
            <ParticlesBackground backgroundColor="transparent" dotCount={50}/>
            <NavBarCus/>
            <Outlet/>
        </main>
    )
}

export default LayoutAdmin;