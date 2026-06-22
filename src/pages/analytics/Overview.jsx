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

function StatCard({ title, value, growth, icon: Icon, subtitle = "", color = "blue" }) {
  const isPositive = growth >= 0;
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    red: "bg-red-500/20 text-red-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="sub-card-glass p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-zinc-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          <Icon size={24} />
        </div>
      </div>
      {growth !== undefined && (
        <div className="flex items-center mt-2">
          {isPositive ? (
            <FaArrowUp className="text-green-400 mr-1" size={14} />
          ) : (
            <FaArrowDown className="text-red-400 mr-1" size={14} />
          )}
          <span className={isPositive ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
            {isPositive ? "+" : ""}{growth}%
          </span>
          <span className="text-zinc-500 text-sm ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
}
export default function Overview() {
  const data = fakeData.overview || {};

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Input" 
          value={data.totalInput || 0} 
          growth={8.5}
          icon={FaBox}
          subtitle="Cutting department"
          color="blue"
        />
        <StatCard 
          title="Total Output" 
          value={data.totalOutput || 0} 
          growth={12.5}
          icon={FaCheckCircle}
          subtitle="Sewing department"
          color="green"
        />
        <StatCard 
          title="Defect Rate" 
          value={`${data.defectRate || 0}%`} 
          growth={-0.8}
          icon={FaExclamationTriangle}
          subtitle="Quality control"
          color="red"
        />
        <StatCard 
          title="Efficiency" 
          value={`${data.efficiency || 0}%`} 
          growth={5.2}
          icon={FaChartLine}
          subtitle="Overall performance"
          color="yellow"
        />
      </div>

      {/* Chart and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 sub-card-glass p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <FaChartLine className="text-blue-400" />
              Input vs Output Trend
            </h3>
          </div>
          <ChartGrid />
        </div>
      </div>

      
    </div>
  );
}