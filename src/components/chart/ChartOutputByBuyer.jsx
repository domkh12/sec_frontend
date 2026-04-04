import Groups2Icon from '@mui/icons-material/Groups2';
import {Divider} from "@mui/material";

function ChartOutputByBuyer() {
    return(
        <div className="sub-card-glass">
            <div className="w-full flex  justify-between items-center flex-wrap mb-4">
                <div className="flex items-center gap-2.5">
                    <Groups2Icon className="text-white/80"/>
                    <p className="text-white">Daily Output by Buyer <br/>
                        <span className="text-[13px] font-medium text-white/80">5 buyers · 28 MOs · 10,627 pcs</span>
                    </p>
                </div>

            </div>
            <div className="relative flex items-center justify-between gap-2 w-full border border-blue-400 px-4 py-3 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[50%] bg-blue-500 opacity-20 z-0"></div>
                <div className="flex gap-2.5 items-center">
                    <p className="text-white w-10 h-10 bg-blue-500 flex justify-center items-center p-3 rounded-xl font-bold">1</p>
                    <p className="text-white z-1 font-bold">Buyer 1 <br/>
                        <span className="text-gray-400 z-1 text-sm">2 MOs</span>
                    </p>
                </div>
                <div className="flex gap-2.5">
                    <p className="text-gray-400 z-1">Input <br/>
                    <span className="text-orange-400 z-1 font-bold"> 10,627 pcs</span>
                    </p>
                    <p className="text-gray-400 z-1">Output <br/>
                        <span className="text-green-500 font-bold z-1"> 10,627 pcs</span>
                    </p>
                    <Divider orientation="vertical" variant="middle" sx={{ height: 50, m: 0, borderColor: 'white' }} />
                    <p className="text-gray-400 z-1">Total <br/>
                        <span className=" z-1 font-bold text-white"> 10,627 pcs</span>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default ChartOutputByBuyer;