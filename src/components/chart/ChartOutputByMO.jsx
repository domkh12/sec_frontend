import { IoLayers } from "react-icons/io5";
import CardMODetail from "../card/CardMODetail.jsx";

function ChartOutputByMO() {
    return(
        <div className="sub-card-glass">
            <div className="w-full flex justify-between items-center flex-wrap">
                <div className="flex items-center gap-2.5">
                    <IoLayers className="text-white/80 text-xl"/>
                    <p className="text-white">Total Output by MO Number<br/>
                        <span className="text-[13px] font-medium text-white/80">32 MOs · 17,680 total pcs</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
                <CardMODetail/>
                <CardMODetail/>
                <CardMODetail/>
            </div>
        </div>
    )
}

export default ChartOutputByMO;
