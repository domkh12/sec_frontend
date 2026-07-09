import { 
  FaArrowUp, 
  FaArrowDown, 
  FaBox, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock,
  FaArrowRight,
  FaChartLine,
  FaClipboardList,
  FaBullseye
} from "react-icons/fa";
import fakeData from "../../locales/fakeData.json";
import ChartGrid from "../../components/chart/ChartGrid";
import StatCardAnalytics from "../../components/card/StatCardAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { setDataKey } from "../../redux/feature/analysis/analysisSlice";
import { Divider } from "@mui/material";
import BarChartOutput48h from "../../components/chart/BarChartOutput48h";

export default function Overview({data, outputLast48hrsData}) {

  // -- Selector ----------------------------------------------------------------------------------
  const dataKey = useSelector((state) => state.analysis.dataKey);

  // -- Hook --------------------------------------------------------------------------------------
  const dispatch = useDispatch();
  const outputLast48hrsRows = Array.isArray(outputLast48hrsData) ? outputLast48hrsData : [];
  const totalOutputLast48hrs = outputLast48hrsRows.reduce((total, item) => {
    return total + Number(item?.output || 0);
  }, 0);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 sub-card-glass rounded-lg" style={{ padding: "0" }}>
        
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCardAnalytics 
              title="Total Input" 
              value={data?.totalInput || 0} 
              growth={data?.totalInputComparison?.changePercent}
              icon={FaBox}
              color="blue"
              trend={data?.totalInputComparison?.trend}
              onClick={() => {
                dispatch(setDataKey("input"));
              }}
              isActive={dataKey === "input"}
              border="border-l-0"
            />
            <StatCardAnalytics 
              title="Total Output" 
              value={data?.totalOutput || 0} 
              growth={data?.totalOutputComparison?.changePercent}
              icon={FaCheckCircle}
              color="green"
              trend={data?.totalOutputComparison?.trend}
              onClick={() => {
                dispatch(setDataKey("output"));
              }}
              isActive={dataKey === "output"}
            />
          </div>
          <div className="p-4">
            <ChartGrid data={data?.data || []} dataKey={dataKey}/>
          </div>
          
        </div>
        <div className="sub-card-glass">
          <p className="text-white font-semibold text-xl">Realtime</p>
          <div className="mt-1 mb-4">
            <div className="flex items-center justify-start mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-white text-sm">Updating live</p>
            </div>
          </div>
          <Divider orientation="horizontal" className="mx-2 bg-zinc-400 opacity-50" />
          <div className="my-4">
              <span className="text-lg text-amber-50 font-semibold">{totalOutputLast48hrs.toLocaleString()}</span><br/>
              <span className="text-sm text-zinc-400">pcs · Last 48 hours</span>
          </div>
          <div className="mb-4">
            <BarChartOutput48h data={outputLast48hrsRows}/>
          </div>
          <Divider orientation="horizontal" className="mx-2 bg-zinc-400 opacity-50" />
        </div>
      </div>

      
    </div>
  );
}
