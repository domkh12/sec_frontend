import { LineChart } from "@mui/x-charts/LineChart";
import chartData from "../../locales/fakeData.json";

const dataset = chartData.map((item) => ({
  ...item,
  date: new Date(item.date)
}));

const xAxis = [
  {
    dataKey: "date",
    scaleType: "time",
    valueFormatter: (date) =>
      date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    tickLabelStyle: {
      fill: "white",
    },
    axisLineStyle: {
      stroke: "white",
      strokeWidth: 1,
    },
    tickLineStyle: {
      stroke: "white",
      strokeWidth: 1,
    },
  },
];

const yAxis = [
  {
    valueFormatter: (value) => `${value}%`,
    tickLabelStyle: {
      fill: "white",
    },
    axisLineStyle: {
      stroke: "white",
      strokeWidth: 1,
    },
    tickLineStyle: {
      stroke: "white",
      strokeWidth: 1,
    },
  },
];

const series = [
  {
    dataKey: "rate",
    valueFormatter: (value) => `${value}%`,
    curve: "linear",
    area: true,
    color: "#1976D2",
  },
];

export default function ChartGrid() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
      grid={{ vertical: false, horizontal: true }}
      slotProps={{
        area: {
          opacity: 0.2,
          fill: "#1976D2",
        },
      }}
      sx={{
        "& .MuiChartsGrid-line": {
          stroke: "white",
          strokeOpacity: 0.3,
        },
        "& .MuiChartsAxis-root .MuiChartsAxis-line": {
          stroke: "white !important",
        },
        "& .MuiChartsAxis-root .MuiChartsAxis-tickLine": {
          stroke: "white !important",
        },
        "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": {
          fill: "white !important",
        },
        "& .MuiChartsLegend-root": {
          color: "white",
        },
        "& .MuiChartsLegend-root .MuiTypography-root": {
          color: "white",
        },
      }}
    />
  );
}