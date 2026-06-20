import { LineChart } from "@mui/x-charts/LineChart";
import chartData from "../../locales/fakeData.json";
const dataset = chartData.map((item) => ({
  ...item,
  date: new Date(item.date), // Convert string to Date
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
  },
];

const yAxis = [
  {
    valueFormatter: (value) => `${value}%`,
  },
];

const series = [
  {
    dataKey: "rate",
    label: "Rate",
    valueFormatter: (value) => `${value}%`,
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
      
    />
  );
}