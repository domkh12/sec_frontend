import StatCardsDash from "../../components/card/StatCardsDash";
import ColumnChartCuttingByLine from "../../components/chart/ColumnChartCuttingByLine";
import ColumnChartOutputByLine from "../../components/chart/ColumnChartOutputByLine";
import LoadingComponent from "../../components/ui/LoadingComponent";
import { useGetInputTodayQuery } from "../../redux/feature/analysis/analysisApiSlice";

function ProductionStatusCutting() {

    // -- Queries -------------------------------------------------------------------------------
    const {data: inputToday, isSuccess: isInputTodaySuccess, isLoading: isInputTodayLoading} = useGetInputTodayQuery();

    let content;

    if (isInputTodayLoading) {
        content = <LoadingComponent />;
    }

    if (isInputTodaySuccess) {
        content = (
            <div className="pb-12">
             <div className="card-glass flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center text-white">
                            <div>
                                <p className="text-[clamp(1rem,4vw,1.3rem)] text-nowrap">WIP | Sewing Defect Dashboard / Real-Time</p>
                                {/* <p className="text-[clamp(0.8rem,3vw,1rem)] text-white/75">Live | Sewing Defect | Updated {fetchedTimeDefect}</p> */}
                            </div>
                            {/* <button className="button-glass" onClick={refreshDashboard} disabled={isLoadingDefectToday || isFetchingDefectToday}>
                                <RefreshIcon className={isLoadingDefectToday || isFetchingDefectToday ? "animate-spin" : ""} /> Refresh
                            </button> */}
                        </div>
                        
                <div className="card-glass">
                    <div className="flex flex-col md:flex-row gap-5 items-center">
                        <StatCardsDash
                            title="Total Job"
                            theme="sunset"
                            value={inputToday?.totalJob ?? 0}
                            icon={<img src="/images/t-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                            unit="PCS"
                        />
                        <StatCardsDash
                            title="Total Cutting"
                            theme="emerald"
                            value={inputToday?.totalCutting ?? 0}
                            icon={<img src="/images/t-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                            unit="PCS"
                        />
                        <StatCardsDash
                            title="Active Style"
                            theme="violet"
                            value={inputToday?.activeStyle ?? 0}
                            icon={<img src="/images/t-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                            unit="PCS"
                        />
                        <StatCardsDash
                            title="Balance WIP"
                            theme="rose"
                            value={inputToday?.balanceCutting ?? 0}
                            icon={<img src="/images/t-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                            unit="PCS"
                        />
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <ColumnChartCuttingByLine lineData={[{}]}/>
                    </div>
                </div>
            </div>
        );
    }

    return content;
}

export default ProductionStatusCutting;