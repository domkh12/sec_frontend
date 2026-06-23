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
                ) : (
                  <FaCircleArrowDown className="text-red-400" size={18} />
                )}
              </div>
            )}
           </div>
           {growth !== undefined && (
              <div className=" mt-2 text-center">
                <span className={isPositive ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                  {isPositive ? "+" : ""}{growth}%
                </span>
              </div>
            )}
    </div>
  );
}
export default function Overview() {
  const data = fakeData.overview || {};

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 sub-card-glass rounded-lg" style={{ padding: "0" }}>
        
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
          <div className="p-4">
            <ChartGrid />
          </div>
        </div>
      </div>

      
    </div>
  );
}