import ReactApexChart from 'react-apexcharts'
import {useState} from "react";
import {Tab, Tabs} from "@mui/material";
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';

function ColumnChartOutputByLine() {
    const [tab, setTab] = useState("Output");
    // Map each line to its buyer for the legend label
    const lineData = [
        { x: 'Line 1', y: 65, buyer: 'Buyer 2', mos: [{ mo: 'GPAR12406', qty: 10 }, { mo: 'GPAR12459', qty: 3455 }] },
        { x: 'Line 2', y: 85, buyer: 'Buyer 2', mos: [{ mo: 'GPAR12460', qty: 85 }] },
        { x: 'Line 3', y: 57, buyer: 'Buyer 1', mos: [{ mo: 'GPAR12461', qty: 30 }, { mo: 'GPAR12462', qty: 27 }] },
        { x: 'Line 4', y: 56, buyer: 'Buyer 1', mos: [{ mo: 'GPAR12463', qty: 56 }] },
        { x: 'Line 5', y: 61, buyer: 'Buyer 3', mos: [{ mo: 'GPAR12464', qty: 20 }, { mo: 'GPAR12465', qty: 41 }] },
        { x: 'Line 6', y: 58, buyer: 'Buyer 1', mos: [{ mo: 'GPAR12466', qty: 58 }] },
        { x: 'Line 7', y: 63, buyer: 'Buyer 3', mos: [{ mo: 'GPAR12467', qty: 63 }] },
        { x: 'Line 8', y: 60, buyer: 'Buyer 3', mos: [{ mo: 'GPAR12468', qty: 25 }, { mo: 'GPAR12469', qty: 35 }] },
    ];

    // Assign a fixed color per buyer
    const buyerColors = {
        'Buyer 1': '#FF4560',
        'Buyer 2': '#008FFB',
        'Buyer 3': '#00E396',
    };

    const [state] = useState({
        series: [{
            name: 'Output',
            data: lineData.map(d => ({ x: d.x, y: d.y }))
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                foreColor: "#FFF",
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 6,
                    borderRadiusApplication: 'end',
                    distributed: true,    // 👈 each bar gets its own color
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            colors: lineData.map(d => buyerColors[d.buyer]),  // 👈 color per bar by buyer
            dataLabels: {
                enabled: true,
                offsetY: -20,
                style: {
                    fontSize: '11px',
                    colors: ['#ffffff'],
                    fontWeight: 400,
                },
                formatter: (val) => `${val} pcs`,
            },
            xaxis: {
                labels: {
                    style: { colors: '#ffffff' }
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                labels: {
                    style: { colors: '#ffffff' },
                    formatter: (val) => `${val} pcs`,
                },
            },
            grid: {
                borderColor: 'rgba(255,255,255,0.1)',
            },
            fill: { opacity: 1 },
            tooltip: {
                custom: ({ dataPointIndex }) => {
                    const d = lineData[dataPointIndex];
                    const color = buyerColors[d.buyer];

                    const moRows = d.mos.map(mo => `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 7px 10px;
                            border: 1px solid ${color};
                            border-radius: 8px;
                            background: #ededed;
                            margin-bottom: 5px;
                            
                        ">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="
                                    width:9px; height:9px;
                                    border-radius:50%;
                                    background:${color};
                                    display:inline-block;
                                    flex-shrink:0;
                                "></span>
                                <span style="font-size:13px; color:#4b5563; font-family:inherit;">${mo.mo}</span>
                            </div>
                            <span style="font-size:13px; font-weight:700; color:#111827; margin-left:24px; font-family:inherit;">${mo.qty}</span>
                        </div>
                    `).join('');

                    return `
                        <div style="
                            padding: 12px 14px;
                            background: #fff3f3;
                            border: 2px solid #e5e7eb;
                            border-radius: 4px;
                            min-width: 215px;
                            box-shadow: 0 8px 30px rgba(0,0,0,0.10);
                            font-family: inherit;
                        ">
                            <!-- Header -->
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span style="font-size:13px; color:#9ca3af; font-weight:500; letter-spacing:0.03em;">
                                    ${d.x}
                                </span>
                                <span style="
                                    background:${color};
                                    color:#fff;
                                    font-size:11px;
                                    font-weight:700;
                                    padding:3px 12px;
                                    border-radius:999px;
                                    letter-spacing:0.03em;
                                    font-family:inherit;
                                ">${d.buyer}</span>
                            </div>

                            <!-- Total pcs -->
                            <div style="margin-bottom:12px; line-height:1;">
                                <span style="font-size:34px; font-weight:800; color:#111827; font-family:inherit;">${d.y}</span>
                                <span style="font-size:13px; color:#9ca3af; margin-left:5px; font-family:inherit;">pcs total</span>
                            </div>

                            <!-- MO breakdown header -->
                            <div style="
                                font-size:10px;
                                font-weight:700;
                                letter-spacing:0.1em;
                                color:#9ca3af;
                                margin-bottom:2px;
                                font-family:inherit;
                            ">
                                MO BREAKDOWN &nbsp;·&nbsp; ${d.mos.length} MO${d.mos.length > 1 ? 's' : ''}
                            </div>

                            <!-- MO rows -->
                            <div>${moRows}</div>
                        </div>
                    `;
                }
            },
            // 👈 custom legend grouped by buyer
            legend: {
                show: false,   // hide default legend, we render custom below
            }
        },
    });

    // Build unique buyers for custom legend
    const buyers = [...new Set(lineData.map(d => d.buyer))];

    return(
        <div className="sub-card-glass flex items-start flex-wrap">
            <div className="w-full flex  justify-between items-center flex-wrap">
                <div className="flex items-center gap-2.5">
                    <BarChartRoundedIcon className="text-white/80"/>
                    <p className="text-white">Production Output by Line <br/>
                        <span className="text-[13px] font-medium text-white/80">30 lines · 5,813 total pcs · Colored by Buyer</span>
                    </p>
                </div>
                <div className="flex justify-end">
                    <Tabs value={tab} onChange={(e, v) => setTab(v)}
                          sx={{
                              /* ✅ Target the root container directly */
                              background: "rgba(255,255,255,0.08)",
                              backdropFilter: "blur(16px)",
                              WebkitBackdropFilter: "blur(16px)",
                              border: "1px solid rgba(255,255,255,0.18)",
                              borderRadius: "14px",
                              padding: "5px",
                              minHeight: "unset",
                              position: "relative",
                              isolation: "isolate",

                              "& .MuiTab-root": {
                                  color: "rgba(255,255,255,0.5)",
                                  borderRadius: "10px",
                                  minHeight: "38px",
                                  padding: "6px 24px",
                                  textTransform: "none",
                                  fontSize: "14px",
                                  "&:hover": {
                                      color: "rgba(255,255,255,0.85)",
                                  },
                              },

                              "& .Mui-selected": {
                                  background: "rgba(255,255,255,0.15) !important",
                                  backdropFilter: "blur(24px)",
                                  WebkitBackdropFilter: "blur(24px)",
                                  color: "#ffffff !important",
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  borderRadius: "10px",
                                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                                  p: 0,
                              },

                              "& .MuiTabs-indicator": { display: "none" },
                          }}
                    >
                        <Tab label="Output" value="Output" />
                        <Tab label="Input" value="Input" />
                    </Tabs>
                </div>
            </div>
            <div className="flex flex-col w-full">
                {/* Custom legend on the left */}
                <div className="w-full flex gap-5 mt-5 flex-col lg:flex-row">
                    <div className="min-w-22.5 pt-2">
                        <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/50">
                            Buyers
                        </p>
                        <div className="flex gap-2.5 flex-row lg:flex-col">
                            {buyers.map((buyer) => (
                                <div key={buyer} className="flex items-center gap-2">
                      <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: buyerColors[buyer] }}
                      />
                                    <span className="text-[13px] text-white/80">{buyer}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div id="chart" style={{ flex: 1 }}>
                        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
                    </div>
                </div>
                <div className="flex text-white bg-gray-500 rounded-full px-4 py-1">
                    <p className="text-sm">Peak: <span className="text-yellow-500 font-bold">7</span> — 1,035 pcs</p>
                </div>
            </div>
        </div>
    )
}

export default ColumnChartOutputByLine;