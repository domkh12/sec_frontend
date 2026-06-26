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

export default function Overview({data}) {

  // -- Selector ----------------------------------------------------------------------------------
  const dataKey = useSelector((state) => state.analysis.dataKey);

  // -- Hook --------------------------------------------------------------------------------------
  const dispatch = useDispatch();

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
              subtitle="Cutting department"
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
              subtitle="Sewing department"
              color="green"
              trend={data?.totalOutputComparison?.trend}
              onClick={() => {
                dispatch(setDataKey("output"));
              }}
              isActive={dataKey === "output"}
            />
            {/* <StatCard 
              title="Defect Rate" 
              value={`${data?.defectRate || 0}%`} 
              growth={-0.8}
              icon={FaExclamationTriangle}
              subtitle="Quality control"
              color="red"
            />
            <StatCard 
              title="Efficiency" 
              value={`${data?.efficiency || 0}%`} 
              growth={5.2}
              icon={FaChartLine}
              subtitle="Overall performance"
              color="yellow"
            /> */}
          </div>
          <div className="p-4">
            <ChartGrid data={data?.data || []} dataKey={dataKey}/>
          </div>
        </div>
      </div>

      
    </div>
  );
}