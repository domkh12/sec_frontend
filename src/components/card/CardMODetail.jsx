import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
function CardMODetail({moData}) {
    return(
        <div className="text-white border border-white/50 rounded-2xl w-full min-w-[450px] pb-10 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/50">
                <p>{moData?.mo} <br/>
                <span className="text-gray-400">{moData?.buyer}</span>
                </p>
                <p className="text-right"><span className="font-bold text-xl">{moData?.outputQty}</span> <br/><span>pcs</span></p>
            </div>
            <div className="flex justify-between items-center mt-2 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                    {/* Put this once anywhere in your component */}
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                        <defs>
                            <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F0997B" />
                                <stop offset="100%" stopColor="#993C1D" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Then on your icon */}
                    <FaArrowAltCircleDown
                        className="text-4xl"
                        style={{ fill: "url(#icon-grad)" }}
                    />
                    <p className="text-right">Input  <br/><span className="font-bold text-xl" style={{
                        color: "#F0997B"
                    }}>{moData?.inputQty}</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                        <defs>
                            <linearGradient id="icon-grad-up" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#5DCAA5" />
                                <stop offset="100%" stopColor="#0F6E56" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <FaArrowAltCircleUp className="text-4xl" style={{ fill: "url(#icon-grad-up)" }} />
                    <p className="text-right">Output <br/>
                        <span className="font-bold text-xl" style={{
                            color: "#5DCAA5"
                        }}>{moData?.outputQty}</span>
                    </p>
                </div>
            </div>
            <div className="border-t border-b border-white/50 px-4 py-3 flex items-center gap-2">       
                <p className="text-sm text-gray-400">{moData?.sizeOutputs?.length} Size</p>
            </div>
            <TableContainer>
                <Table sx={{ minWidth: 400}} size="small" aria-label="a dense table">
                    <TableHead>
                       <TableRow sx={{backgroundColor:"#6a6a6a"}}>
                           <TableCell sx={{color:"white"}}>Color</TableCell>
                           {
                                moData?.sizeOutputs?.map((item, index) => (
                                    <TableCell key={index} sx={{color:"white"}}>{item.size}</TableCell>
                                ))
                            }
                           <TableCell sx={{color:"white"}}>Total</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{color: "white"}}>{moData?.color?.color}</TableCell>
                            {
                                moData?.sizeOutputs?.map((item, index) => (
                                    <TableCell key={index} sx={{color: "white"}}>
                                        <span className="text-[#F0997B]">{item.inputQty}</span><br/>
                                        <span className="text-[#5DCAA5]">{item.outputQty}</span>
                                    </TableCell>
                                ))
                            }
                            <TableCell sx={{color: "white"}}>
                                <div className="flex items-center gap-1 text-[#F0997B]">
                                <FaArrowDown/>
                                <span >{moData?.inputQty}</span><br/>
                                </div>
                                <div className="flex items-center gap-1 text-[#5DCAA5]">
                                    <FaArrowUp/>
                                    <span className="text-[#5DCAA5]">{moData?.outputQty}</span>
                                </div>

                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default CardMODetail;