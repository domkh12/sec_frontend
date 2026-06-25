import { useState } from "react";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

export default function DateRangePicker({ label = "Date Range", onChange, start, end }) {
  const [startDate, setStartDate] = useState(start || "");
  const [endDate, setEndDate] = useState(end || "");

  const handleStart = (e) => {
    setStartDate(e.target.value);
    if (onChange) onChange({ start: e.target.value, end: endDate });
  };

  const handleEnd = (e) => {
    setEndDate(e.target.value);
    if (onChange) onChange({ start: startDate, end: e.target.value });
  };

  const inputStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "0.875rem",
    colorScheme: "dark",
    cursor: "pointer",
    width: "100%",
  };

  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
  };

  const labelStyle = {
    fontSize: "0.7rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        border: "1px solid #4b5563",
        borderRadius: 4,
        padding: "10px 14px",
        backgroundColor: "transparent",
        minWidth: 300,
        transition: "border-color 0.2s",
        cursor: "pointer",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#4b5563")}
    >
      <FaCalendarAlt style={{ color: "#94a3b8", flexShrink: 0 }} />

      {/* Start date */}
      <div style={boxStyle}>
        <input
          type="date"
          value={startDate}
          onChange={handleStart}
          max={endDate || undefined}
          style={inputStyle}
        />
      </div>

      <FaArrowRight style={{ color: "#4b5563", flexShrink: 0 }} />

      {/* End date */}
      <div style={boxStyle}>
        <input
          type="date"
          value={endDate}
          onChange={handleEnd}
          min={startDate || undefined}
          style={inputStyle}
        />
      </div>
    </div>
  );
}