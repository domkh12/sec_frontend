import { useState, useEffect } from "react";
import TranslateButton from "./TranslateButton.jsx";
import AvatarProfile from "./AvatarProfile.jsx";
import Logo from "../util/Logo.jsx";
import { IconButton } from "@mui/material";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";

function NavBarCus() {
    const [isFullScreen, setIsFullScreen] = useState(false);

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

    return (
        <nav className="w-full px-4 py-1 bg-gray-200/50 h-auto shadow-lg flex items-center justify-between fixed top-0 left-0 z-50">
            <Logo />
            <div className="flex items-center gap-3">
                <TranslateButton />
                <IconButton onClick={handleToggleFullScreen}>
                    {isFullScreen ? <BiExitFullscreen /> : <BiFullscreen />}
                </IconButton>
                <AvatarProfile />
            </div>
        </nav>
    );
}

export default NavBarCus;