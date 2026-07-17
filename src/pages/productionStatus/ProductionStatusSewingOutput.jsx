import StatCardsDash from "../../components/card/StatCardsDash.jsx";
import RefreshIcon from '@mui/icons-material/Refresh';
import ColumnChartOutputByLine from "../../components/chart/ColumnChartOutputByLine.jsx";
import ChartOutputByBuyer from "../../components/chart/ChartOutputByBuyer.jsx";
import ChartOutputByMO from "../../components/chart/ChartOutputByMO.jsx";
import { useGetOutputTodayQuery } from "../../redux/feature/analysis/analysisApiSlice.js";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import { useEffect } from "react";

function ProductionStatusSewingOutput() {

    // -- Queries -------------------------------------------------------------------------------
    const {data: outputToday, isLoading: isLoadingOutputToday, refetch, isFetching: isFetchingOutputToday} = useGetOutputTodayQuery("outputToday",
         {refetchOnMountOrArgChange: true,
             refetchOnFocus: true, 
             refetchOnReconnect: true, 
             skip: false, 
             refetchInterval: 60000,
             pollingInterval: 60000
            });
    const { messages } = useWebsocketServer(`/topic/messages/tv-data-update`);

    // -- useEffect ------------------------------------------------------------------------------
    useEffect(() => {
        if (messages.isUpdate === true) {
            refetch();
        }
    }, [messages, refetch]);

    let content;

    if (isLoadingOutputToday) {
        content = <LoadingComponent/>;
    }

    if (outputToday) {
        content = (
            <div className="pb-12">
            <div className="card-glass flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
                <div>
                    <p className="text-[clamp(0.5rem,4vw,1.3rem)] text-nowrap">WIP | Daily Production Dashboard / Real-Time</p>
                    <p className="text-[clamp(0.5rem,4vw,1rem)]">Live · Sewing Output · Updated 10:07:27</p>
                </div>
                <button className="button-glass" disabled={isLoadingOutputToday || isFetchingOutputToday} onClick={() => {refetch()}}><RefreshIcon className={` ${isLoadingOutputToday || isFetchingOutputToday ? 'animate-spin' : ''}`}/> Refresh</button>
            </div>
            <div className="card-glass">
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <StatCardsDash
                        title="Total Input"
                        theme="sunset"
                        value={outputToday?.totalInput}
                        // percentage="+12%"
                        icon={<img src="/images/t-shirt.png" alt="T Shirt" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Total Output"
                        theme="emerald"
                        value={outputToday?.totalOutput}
                        // percentage="+8%"
                        icon={<img src="/images/quality-control.png" alt="quality control" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Total Active Style"
                        theme="violet"
                        value={outputToday?.totalStyleActive}
                        // percentage="+3%"
                        icon={<img src="/images/tshirt.png" alt="style" className="w-10 h-auto" />}
                    />
                    <StatCardsDash
                        title="Balance WIP"
                        theme="rose"
                        value={outputToday?.totalBalance}
                        // percentage="-1%"
                        icon={<img src="/images/hourglass.png" alt="inspector" className="w-10 h-auto" />}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <ColumnChartOutputByLine lineData={outputToday?.lineData}/>
                    <ChartOutputByBuyer buyers={outputToday?.buyers}/>
                </div>
                <div className="mt-4">
                    <ChartOutputByMO mo={outputToday?.mo}/>
                </div>
            </div>
        </div>
        );
    }

    return content;
}

export default ProductionStatusSewingOutput;