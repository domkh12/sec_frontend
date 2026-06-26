import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";

function StatCardAnalytics({ title, value, growth, icon: Icon, subtitle = "", color = "blue", trend = "up", onClick, isActive, border }) {
  const isPositive = trend === "UP"; // ← use trend instead of growth >= 0

  return (
    <button className={`border-1 border-gray-100  py-4 cursor-pointer border-b-0 ${isActive ? " bg-neutral-900" : ""} ${border} border-t-0`} onClick={onClick}>
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
    </button>
  );
}

export default StatCardAnalytics;