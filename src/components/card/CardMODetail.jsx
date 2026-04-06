import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
function CardMODetail() {
    return(
        <div className="text-white border border-white/50 rounded-2xl w-full pb-10 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/50">
                <p>MMO262995 <br/>
                <span className="text-gray-400">Buyer1</span>
                </p>
                <p>10,627 <br/><span>pcs</span></p>
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
                    <p>Input  <br/><span className="font-bold text-xl" style={{
                        color: "#F0997B"
                    }}>1000</span></p>
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
                    <p>Output <br/>
                        <span className="font-bold text-xl" style={{
                            color: "#5DCAA5"
                        }}>1000</span>
                    </p>
                </div>
            </div>
            <div className="border-t border-b border-white/50 px-4 py-3 flex items-center gap-2">
                <IoIosColorPalette/>
                <p className="text-sm text-gray-400">7 Color . 4 Size</p>
            </div>
            <TableContainer>
                <Table sx={{ minWidth: 400}} size="small" aria-label="a dense table">
                    <TableHead>
                       <TableRow sx={{backgroundColor:"#6a6a6a"}}>
                           <TableCell sx={{color:"white"}}>Color</TableCell>
                           <TableCell sx={{color:"white"}}>S</TableCell>
                           <TableCell sx={{color:"white"}}>M</TableCell>
                           <TableCell sx={{color:"white"}}>L</TableCell>
                           <TableCell sx={{color:"white"}}>XL</TableCell>
                           <TableCell sx={{color:"white"}}>XXL</TableCell>
                           <TableCell sx={{color:"white"}}>XXXL</TableCell>
                           <TableCell sx={{color:"white"}}>Total</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{color: "white"}}>Red</TableCell>
                            <TableCell sx={{color: "white"}}>
                                <span className="text-[#F0997B]">100</span><br/>
                                <span className="text-[#5DCAA5]">100</span>
                            </TableCell>
                            <TableCell sx={{color: "white"}}>
                                <span className="text-[#F0997B]">100</span><br/>
                                <span className="text-[#5DCAA5]">100</span>
                            </TableCell>
                            <TableCell sx={{color: "white"}}>
                                <span className="text-[#F0997B]">100</span><br/>
                                <span className="text-[#5DCAA5]">100</span>
                            </TableCell>
                            <TableCell sx={{color: "white"}}>
                                <span className="text-[#F0997B]">100</span><br/>
                                <span className="text-[#5DCAA5]">100</span>
                            </TableCell>
                            <TableCell sx={{color: "white"}}>
                                <span className="text-[#F0997B]">100</span><br/>
                                <span className="text-[#5DCAA5]">100</span>
                            </TableCell>
                            <TableCell sx={{color: "white"}}>
                                <span className="text-[#F0997B]">100</span><br/>
                                <span className="text-[#5DCAA5]">100</span>
                            </TableCell>
                            <TableCell sx={{color: "white"}}>
                                <div className="flex items-center gap-1 text-[#F0997B]">
                                <FaArrowDown/>
                                <span >600</span><br/>
                                </div>
                                <div className="flex items-center gap-1 text-[#5DCAA5]">
                                    <FaArrowUp/>
                                    <span className="text-[#5DCAA5]">600</span>
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