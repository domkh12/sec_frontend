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
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";

function StatCard({ title, value, growth, icon: Icon, subtitle = "", color = "blue", trend = "up" }) {
  const isPositive = trend === "UP"; // ← use trend instead of growth >= 0

  return (
    <div className="border-[0.1px] border-gray-100 py-4 cursor-pointer">
      <p className="text-zinc-400 text-sm text-center">{title}</p>
      <div className="flex justify-center items-center gap-2">
        <p className="text-white text-3xl mt-1 text-center">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {growth !== undefined && (
          <div className="flex items-center">
            {isPositive ? (
              <FaCircleArrowUp className="text-green-400" size={18} />
            ) : trend === "DOWN" ? (
              <FaCircleArrowDown className="text-red-400" size={18} />  // ← red when down
            ) : (
              <FaCircleArrowDown className="text-gray-400" size={18} /> // ← gray when FLAT
            )}
          </div>
        )}
      </div>
      {growth !== undefined && (
        <div className="mt-2 text-center">
          <span className={isPositive ? "text-green-400 text-sm" : trend === "DOWN" ? "text-red-400 text-sm" : "text-gray-400 text-sm"}>
            {isPositive ? "+" : ""}{growth}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function Overview({data}) {

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 sub-card-glass rounded-lg" style={{ padding: "0" }}>
        
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Input" 
              value={data?.totalInput || 0} 
              growth={data?.totalInputComparison?.changePercent}
              icon={FaBox}
              subtitle="Cutting department"
              color="blue"
              trend={data?.totalInputComparison?.trend}
            />
            <StatCard 
              title="Total Output" 
              value={data?.totalOutput || 0} 
              growth={data?.totalOutputComparison?.changePercent}
              icon={FaCheckCircle}
              subtitle="Sewing department"
              color="green"
              trend={data?.totalOutputComparison?.trend}
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
            <ChartGrid />
          </div>
        </div>
      </div>

      
    </div>
  );
}