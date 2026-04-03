import StatCardsDash from "../../components/card/StatCardsDash.jsx";
import RefreshIcon from '@mui/icons-material/Refresh';
import BarChartOutputByLine from "../../components/chart/BarChartOutputByLine.jsx";

function WipSewingOutput() {
    return (
        <>
            <div className="card-glass flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
                <div>
                    <p className="text-[clamp(0.5rem,4vw,1.3rem)] text-nowrap">WIP | Daily Production Dashboard / Real-Time</p>
                    <p className="text-[clamp(0.5rem,4vw,1rem)]">Live · Sewing Output · Updated 10:07:27</p>
                </div>
                <button className="button-glass"><RefreshIcon className="animate-spin"/> Refresh</button>
            </div>
            <div className="card-glass">
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <StatCardsDash
                        title="Total Input"
                        theme="sunset"
                        value={1240}
                        percentage="+12%"
                        icon={<img src="/images/t-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Total Output"
                        theme="emerald"
                        value={980}
                        percentage="+8%"
                        icon={<img src="/images/quality-control.png" alt="quality control" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Total Active Style"
                        theme="violet"
                        value={34}
                        percentage="+3%"
                        icon={<img src="/images/tshirt.png" alt="style" className="w-10 h-auto" />}
                    />
                    <StatCardsDash
                        title="Total QC Inspectors"
                        theme="ocean"
                        value={17}
                        percentage="-1%"
                        icon={<img src="/images/inspection.png" alt="inspector" className="w-10 h-auto" />}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <BarChartOutputByLine/>
                    <BarChartOutputByLine/>
                </div>
            </div>
        </>
    );
}

export default WipSewingOutput;