import RefreshIcon from "@mui/icons-material/Refresh";
import StatCardsDash from "../../components/card/StatCardsDash.jsx";
import ColumnChartOutputByLine from "../../components/chart/ColumnChartOutputByLine.jsx";
import ChartOutputByBuyer from "../../components/chart/ChartOutputByBuyer.jsx";
import ChartOutputByMO from "../../components/chart/ChartOutputByMO.jsx";
import ColumnChartDefectByLine from "../../components/chart/ColumnChartDefectByLine.jsx";

function ProductionStatusSewingDefect() {
    return (
        <div className="pb-12">
            <div className="card-glass flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
                <div>
                    <p className="text-[clamp(0.5rem,4vw,1.3rem)] text-nowrap">WIP | Daily Production Dashboard / Real-Time</p>
                    <p className="text-[clamp(0.5rem,4vw,1rem)]">Live · Sewing Output · Updated 10:07:27</p>
                </div>
                <button className="button-glass" disabled={true}><RefreshIcon className="animate-spin"/> Refresh</button>
            </div>
            <div className="card-glass">
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <StatCardsDash
                        title="Total Output"
                        theme="emerald"
                        value={2000}
                        percentage="+8%"
                        icon={<img src="/images/quality-control.png" alt="quality control" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Total Defect"
                        theme="rose"
                        value={1249}
                        percentage="+12%"
                        icon={<img src="/images/dirty-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Defect Rate"
                        theme="sunset"
                        value={2000}
                        percentage="+8%"
                        icon={<img src="/images/dirty-shirt.png" alt="quality control" className="w-10 h-auto" />}
                        unit="%"
                    />
                    <StatCardsDash
                        title="Line Affected"
                        theme="violet"
                        value={34}
                        percentage="+3%"
                        icon={<img src="/images/sewing-machine.png" alt="style" className="w-10 h-auto" />}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <ColumnChartDefectByLine/>
                    <ChartOutputByBuyer/>
                </div>
                <div className="mt-4">
                    <ChartOutputByMO/>
                </div>
            </div>
        </div>
    )
}

export default ProductionStatusSewingDefect;