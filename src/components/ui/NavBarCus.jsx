import { useState, useEffect } from "react";
import TranslateButton from "./TranslateButton.jsx";
import AvatarProfile from "./AvatarProfile.jsx";
import Logo from "../util/Logo.jsx";
import { IconButton } from "@mui/material";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import {useBreakpoints} from "../../hook/useBreakpoints.jsx";
import { FaChartPie, FaHome } from "react-icons/fa";
import useAuth from "../../hook/useAuth.jsx";
import { MdAnalytics } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const navButtonBaseClass = "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer";
const navButtonInactiveClass = "text-primary/85 hover:bg-white/40 hover:text-primary-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_rgba(9,45,116,0.14)]";
const navButtonActiveClass = "border border-white/60 bg-white/45 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_28px_rgba(9,45,116,0.22)] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary/70";

function getNavButtonClass(isActive) {
    return `${navButtonBaseClass} ${isActive ? navButtonActiveClass : navButtonInactiveClass}`;
}

function NavBarCus() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const {isMd} = useBreakpoints();
    const {isAdmin, isManager} = useAuth();
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const homePath = isAdmin ? "/admin" : isManager ? "/manager" : "/tv";
    const isHomeActive = pathname === homePath;
    const isAnalyticsActive = pathname.startsWith("/admin/analytics");
    const isProductionStatusActive = pathname.startsWith("/admin/production-status");

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFsChange);
        return () => document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleNavigateHome = () => {
        navigate(homePath);
    }
   
    return (
        <nav className="w-full px-4 py-2 bg-white/35 backdrop-blur-xl border-b border-white/35 shadow-[0_10px_30px_rgba(15,23,42,0.16)] flex items-center justify-between fixed top-0 left-0 z-50">
            <div className="flex items-center gap-3">
                <Logo />
                <div className="flex gap-2">
                    <button className={getNavButtonClass(isHomeActive)} onClick={handleNavigateHome}>
                        <FaHome className="text-base" />
                        Home
                    </button>
                    {isAdmin && (
                        <button className={getNavButtonClass(isProductionStatusActive)} onClick={() => navigate("/admin/production-status")}>
                            <FaChartPie className="text-lg"/>
                            Production Status
                        </button>
                    )}
                    {isAdmin && (
                        <button className={getNavButtonClass(isAnalyticsActive)} onClick={() => navigate("/admin/analytics")}>
                            <MdAnalytics className="text-lg"/>
                            Analytics
                        </button>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <TranslateButton />
                {isMd && (
                    <IconButton onClick={handleToggleFullScreen}>
                        {isFullScreen ? <BiExitFullscreen /> : <BiFullscreen />}
                    </IconButton>
                )}
                <AvatarProfile />
            </div>
        </nav>
    );
}

export default NavBarCus;
