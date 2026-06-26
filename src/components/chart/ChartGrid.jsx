import { LineChart } from "@mui/x-charts/LineChart";



export default function ChartGrid({data, dataKey}) {

  const dataset = data?.map((item) => ({
    ...item,
    date: new Date(item.date), // ✅ convert string → Date object
  }));

  const xAxis = [
  {
    dataKey: "date",
    scaleType: "time",
    valueFormatter: (date) =>
      date.toLocaleDateString("en-US", {
        day: "numeric",
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
      valueFormatter: (value) => `${value} pcs`,
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
      position: 'right',
      width: 70,
    },
  ];

  const series = [
    {
      dataKey: dataKey,
      valueFormatter: (value) => `${value} pcs`,
      curve: "linear",
      area: true,
      color: "#1976D2",
    },
  ];

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
          strokeOpacity: 0.3
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