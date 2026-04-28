import {Box, IconButton, Popper} from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import {useState} from "react";

function CardWorkOrder({image, style, mo, color, balance, onClick}){
    // -- State --------------------------------------------------------------------------------
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    // -- Handler -------------------------------------------------------------------------------
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    return (
        <div className="flex flex-col border border-gray-400 rounded-lg">
            <div className="mb-3 w-full h-56 flex mx-auto justify-center items-center overflow-hidden">
                <img src={image || "/images/placeholder.png"} alt={style} className="w-full h-full object-cover" loading={"lazy"} decoding={"async"}/>
            </div>
            <div className="px-2">
                <p className="text-xs text-gray-500">{mo}</p>
                <p className="font-bold text-lg text-nowrap truncate">{style}-{color}</p>
            </div>
            <div className={"flex justify-between items-center px-2 py-2"}>
                <p><span className="text-emerald-600">{balance}</span> pcs</p>
                <IconButton color={"primary"} size={"small"} onClick={handleClick}>
                    <FaPlus/>
                </IconButton>
                <Popper id={id} open={open} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                        The content of the Popper.
                    </Box>
                </Popper>
            </div>
        </div>
    )
}

export default CardWorkOrder;