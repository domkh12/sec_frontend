import TranslateButton from "./TranslateButton.jsx";
import AvatarProfile from "./AvatarProfile.jsx";
import Logo from "../util/Logo.jsx";
import {IconButton} from "@mui/material";
import { BiFullscreen } from "react-icons/bi";

function NavBarCus() {
    return (
        <nav className="w-full px-4 py-1 bg-gray-200/50 h-auto shadow-lg flex items-center justify-between fixed top-0 left-0 z-50">
            <Logo/>
            <div className="flex items-center gap-3">
                <TranslateButton/>
                <IconButton>
                    <BiFullscreen/>
                </IconButton>
                <AvatarProfile/>
            </div>
        </nav>
    )
}

export default NavBarCus;