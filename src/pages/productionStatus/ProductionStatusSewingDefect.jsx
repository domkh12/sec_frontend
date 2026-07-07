import { forwardRef, useMemo, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMediaQuery } from "@mui/material";
import StatCardsDash from "../../components/card/StatCardsDash.jsx";
import { useGetDefectTodayQuery } from "../../redux/feature/analysis/analysisApiSlice.js";

const DEFAULT_TARGET_DEFECT_RATE = 2.5;

const chartTextSx = {
    "& .MuiChartsGrid-line": { stroke: "#ffffff", strokeOpacity: 0.28 },
    "& .MuiChartsAxis-root .MuiChartsAxis-line": { stroke: "#ffffff !important" },
    "& .MuiChartsAxis-root .MuiChartsAxis-tick": { stroke: "#ffffff !important" },
    "& .MuiChartsAxis-root .MuiChartsAxis-tickLine": { stroke: "#ffffff !important" },
    "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": { fill: "#ffffff !important" },
    "& .MuiChartsAxis-label": { fill: "#ffffff !important" },
    "& .MuiChartsLegend-root": { color: "#ffffff" },
    "& .MuiChartsLegend-root text": { fill: "#ffffff !important" },
    "& .MuiChartsLegend-root .MuiTypography-root": { color: "#ffffff" },
    "& .MuiChartsLegend-series text": { fill: "#ffffff !important" },
    "& .MuiChartsLegend-label": { color: "#ffffff", fill: "#ffffff !important" },
    "& .MuiBarLabel-root": {
        fill: "#ffffff !important",
        color: "#ffffff",
        fontSize: 12,
        whiteSpace: "pre",
    },
};

const chartSlotProps = {
    legend: {
        labelStyle: {
            fill: "#ffffff",
            color: "#ffffff",
            fontSize: 13,
        },
    },
    barLabel: {
        fill: "#ffffff",
        color: "#ffffff",
        style: {
            fill: "#ffffff",
            color: "#ffffff",
            fontSize: 12,
        },
    },
};

const pieChartSlotProps = {
    ...chartSlotProps,
    legend: {
        hidden: true,
    },
};

const defectChartColors = [
    "#fb7185",
    "#f59e0b",
    "#38bdf8",
    "#34d399",
    "#a78bfa",
    "#f472b6",
    "#22d3ee",
    "#bef264",
    "#fb923c",
    "#60a5fa",
    "#c084fc",
    "#facc15",
];

function SectionHeader({ icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-2.5">
            {icon}
            <p className="text-white">
                {title}
                <br />
                <span className="text-[13px] font-medium text-white/70">{subtitle}</span>
            </p>
        </div>
    );
}

function normalizeDefectTypes(defectTypes) {
    if (Array.isArray(defectTypes)) {
        return defectTypes
            .map((item) => ({
                type: item?.type ?? item?.name ?? item?.defectType ?? "Unknown",
                qty: Number(item?.qty ?? item?.quantity ?? item?.defect ?? 0),
            }))
            .filter((item) => item.qty > 0);
    }

    if (defectTypes && typeof defectTypes === "object") {
        return Object.entries(defectTypes)
            .map(([type, qty]) => ({ type, qty: Number(qty ?? 0) }))
            .filter((item) => item.qty > 0);
    }

    return [];
}

function mergeDefectTypes(defectTypeGroups) {
    return Object.entries(
        defectTypeGroups.flat().reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + item.qty;
            return acc;
        }, {})
    ).map(([type, qty]) => ({ type, qty }));
}

function getUniqueStyleLabel(styles) {
    const uniqueStyles = new Map();

    styles.forEach((style) => {
        const displayStyle = String(style ?? "").trim();
        const key = displayStyle.toLowerCase();

        if (displayStyle && !uniqueStyles.has(key)) {
            uniqueStyles.set(key, displayStyle);
        }
    });

    return [...uniqueStyles.values()].join(", ");
}

function getUniqueLabel(values) {
    const uniqueValues = new Map();

    values.forEach((value) => {
        const displayValue = String(value ?? "").trim();
        const key = displayValue.toLowerCase();

        if (displayValue && !uniqueValues.has(key)) {
            uniqueValues.set(key, displayValue);
        }
    });

    return [...uniqueValues.values()].join(", ");
}

function getHourEndLabel(hour) {
    const displayHour = String(hour ?? "").trim();

    if (!displayHour.includes("-")) {
        return displayHour;
    }

    return displayHour.split("-").pop().trim();
}

function normalizeMoItem(moItem, moIndex, parent = {}) {
    const defectTypes = normalizeDefectTypes(moItem?.defectTypes);
    const defectTypeTotal = defectTypes.reduce((sum, item) => sum + item.qty, 0);

    return {
        ...moItem,
        buyer: moItem?.buyer ?? parent.buyer ?? "-",
        mo: moItem?.mo ?? moItem?.moNo ?? `MO ${moIndex + 1}`,
        style: moItem?.style ?? moItem?.styleNo ?? "-",
        output: Number(moItem?.output ?? moItem?.checked ?? 0),
        defect: Number(moItem?.defect ?? moItem?.defectQty ?? defectTypeTotal),
        defectTypes,
    };
}

function normalizeLine(line, index) {
    const mos = Array.isArray(line?.mos)
        ? line.mos.map((moItem, moIndex) => normalizeMoItem(moItem, moIndex, line))
        : [];

    if (mos.length > 0) {
        const output = mos.reduce((sum, item) => sum + item.output, 0);
        const defect = mos.reduce((sum, item) => sum + item.defect, 0);
        const defectTypes = mergeDefectTypes(mos.map((item) => item.defectTypes));
        const buyerLabel = getUniqueLabel(mos.map((item) => item.buyer));
        const moLabel = mos.map((item) => item.mo).join(", ");
        const styleLabel = getUniqueStyleLabel(mos.map((item) => item.style));

        return {
            ...line,
            line: line?.line ?? line?.lineName ?? `Line ${index + 1}`,
            buyer: buyerLabel || line?.buyer || "-",
            mo: moLabel || "-",
            style: styleLabel || "-",
            output,
            defect,
            defectTypes,
            mos,
        };
    }

    const defectTypes = normalizeDefectTypes(line?.defectTypes);
    const defectTypeTotal = defectTypes.reduce((sum, item) => sum + item.qty, 0);
    const output = Number(line?.output ?? line?.checked ?? 0);
    const defect = Number(line?.defect ?? line?.defectQty ?? defectTypeTotal);

    return {
        ...line,
        line: line?.line ?? line?.lineName ?? `Line ${index + 1}`,
        buyer: line?.buyer ?? "-",
        mo: line?.mo ?? line?.moNo ?? "-",
        style: line?.style ?? line?.styleNo ?? "-",
        output,
        defect,
        defectTypes,
        mos: line?.mo || line?.moNo ? [normalizeMoItem(line, 0)] : [],
    };
}

const DefectBarLabel = forwardRef(function DefectBarLabel({ x, y, width, children, hidden, className, style }, ref) {
    const [pcs, rate] = String(children).split("|");
    const labelX = x + width / 2;
    const labelY = y - 24;

    return (
        <text
            ref={ref}
            x={labelX}
            y={labelY}
            className={className}
            textAnchor="middle"
            opacity={hidden ? 0 : 1}
            style={style}
            fill="#ffffff"
            pointerEvents="none"
        >
            <tspan x={labelX} dy="0" fontSize="12" fontWeight="700" fill="#ffffff">
                {pcs}
            </tspan>
            <tspan x={labelX} dy="1.25em" fontSize="11" fontWeight="500" fill="rgba(255,255,255,0.78)">
                {rate}
            </tspan>
        </text>
    );
});

function ProductionStatusSewingDefect() {

    // -- Query ----------------------------------------------------------------------------------------
    const { data: defectToday, isLoading: isLoadingDefectToday, refetch, isFetching: isFetchingDefectToday } = useGetDefectTodayQuery();
    const shouldRotateLineLabels = useMediaQuery("(max-width:1535px)");

    const [lastUpdated, setLastUpdated] = useState("-");

    const dashboard = useMemo(() => {
        const source = defectToday?.data ?? defectToday;
        const lines = Array.isArray(source?.lines) ? source.lines.map(normalizeLine) : [];
        const hourlyTrend = Array.isArray(source?.hourlyTrend) ? source.hourlyTrend : [];
        const targetDefectRate = Number(source?.targetDefectRate ?? DEFAULT_TARGET_DEFECT_RATE);
        const updatedAt = source?.updatedAt ?? "-";

        const totalOutput = lines.reduce((sum, line) => sum + line.output, 0);
        const totalDefect = lines.reduce((sum, line) => sum + line.defect, 0);
        const defectRate = totalOutput ? (totalDefect / totalOutput) * 100 : 0;
        const affectedLines = lines.filter((line) => line.defect > 0).length;
        const runningLines = lines.filter((line) => line.mos?.length > 0).length;
        const activeStyles = new Set(lines.map((line) => line.style).filter(Boolean)).size;

        const lineAnalysis = lines
            .map((line) => ({
                ...line,
                defectRate: line.output ? Number(((line.defect / line.output) * 100).toFixed(2)) : 0,
                passQty: line.output - line.defect,
                contribution: totalDefect ? Number(((line.defect / totalDefect) * 100).toFixed(1)) : 0,
            }));

        const defectMix = Object.entries(
            lines.reduce((acc, line) => {
                line.defectTypes.forEach(({ type, qty }) => {
                    acc[type] = (acc[type] || 0) + qty;
                });
                return acc;
            }, {})
        )
            .map(([type, qty]) => ({
                id: type,
                label: type,
                value: qty,
                type,
                qty,
                rate: totalDefect ? Number(((qty / totalDefect) * 100).toFixed(1)) : 0,
            }))
            .sort((a, b) => b.qty - a.qty);

        const hourlyRates = hourlyTrend.map((row) => ({
            ...row,
            output: Number(row?.output ?? 0),
            defect: Number(row?.defect ?? 0),
            rate: Number(row?.output ?? 0) ? Number(((Number(row?.defect ?? 0) / Number(row?.output ?? 0)) * 100).toFixed(2)) : 0,
        }));

        return {
            updatedAt,
            totalOutput,
            totalDefect,
            defectRate,
            affectedLines,
            runningLines,
            activeStyles,
            lineAnalysis,
            defectMix,
            hourlyRates,
            targetDefectRate,
        };
    }, [defectToday]);

    const refreshDashboard = () => {
        refetch();
        setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };

    const displayUpdatedAt = defectToday?.data?.updatedAt ?? defectToday?.updatedAt ?? dashboard.updatedAt ?? lastUpdated;
    const riskLines = dashboard.lineAnalysis.filter((line) => line.defectRate > dashboard.targetDefectRate);
    const topDefect = dashboard.defectMix[0] ?? { type: "-", qty: 0, rate: 0 };
    const highestDefectLine = [...dashboard.lineAnalysis].sort((a, b) => b.defect - a.defect)[0];
    const highestRiskLine = [...dashboard.lineAnalysis].sort((a, b) => b.defectRate - a.defectRate)[0] ?? { line: "-", defectRate: 0 };
    const bestLine = [...dashboard.lineAnalysis].sort((a, b) => a.defectRate - b.defectRate)[0] ?? { line: "-", defectRate: 0 };
    const maxLineDefect = Math.max(...dashboard.lineAnalysis.map((line) => line.defect), 0);
    const lineDefectYAxisMax = maxLineDefect > 0 ? Math.ceil(maxLineDefect * 1.35) : 1;
    const lineDefectXAxisHeight = shouldRotateLineLabels ? 78 : 44;
    const hourlyXAxisHeight = shouldRotateLineLabels ? 56 : 36;

    return (
        <div className="pb-12">
            <div className="card-glass flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center text-white">
                <div>
                    <p className="text-[clamp(1rem,4vw,1.3rem)] text-nowrap">WIP | Sewing Defect Dashboard / Real-Time</p>
                    <p className="text-[clamp(0.8rem,3vw,1rem)] text-white/75">Live | Sewing Defect | Updated {displayUpdatedAt}</p>
                </div>
                <button className="button-glass" onClick={refreshDashboard} disabled={isLoadingDefectToday || isFetchingDefectToday}>
                    <RefreshIcon className={isLoadingDefectToday || isFetchingDefectToday ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            <div className="card-glass">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
                    <StatCardsDash
                        title="Output"
                        theme="emerald"
                        value={dashboard.totalOutput}
                        percentage="Checked quantity"
                        icon={<img src="/images/quality-control.png" alt="quality control" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Total Defect"
                        theme="rose"
                        value={dashboard.totalDefect}
                        percentage={`${topDefect.type} top`}
                        icon={<img src="/images/dirty-shirt.png" alt="sewing defect" className="w-10 h-auto" />}
                        unit="PCS"
                    />
                    <StatCardsDash
                        title="Defect Rate"
                        theme={dashboard.defectRate > dashboard.targetDefectRate ? "sunset" : "emerald"}
                        value={Number(dashboard.defectRate.toFixed(2))}
                        percentage={`Target ${dashboard.targetDefectRate}%`}
                        icon={<img src="/images/dirty-shirt.png" alt="defect rate" className="w-10 h-auto" />}
                        unit="%"
                    />
                    <StatCardsDash
                        title="Above Target"
                        theme="violet"
                        value={riskLines.length}
                        percentage={`Target ${dashboard.targetDefectRate}%`}
                        icon={<img src="/images/sewing-machine.png" alt="sewing machine" className="w-10 h-auto" />}
                    />
                    <StatCardsDash
                        title="Active Styles"
                        theme="sunset"
                        value={dashboard.activeStyles}
                        percentage={`${dashboard.runningLines} running lines`}
                        icon={<img src="/images/tshirt.png" alt="active styles" className="w-10 h-auto" />}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 xl:grid-cols-[1.35fr_0.9fr]">
                    <div className="sub-card-glass">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <SectionHeader
                                icon={<BarChartRoundedIcon className="text-white/80" />}
                                title="Line Defect Hotspots"
                                subtitle={`${dashboard.lineAnalysis.length} lines | ${dashboard.totalDefect} defects | API line order`}
                            />
                            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-white">
                                Target: {dashboard.targetDefectRate}%
                            </div>
                        </div>
                        <div className="mt-4 h-[500px]">
                            <BarChart
                                dataset={dashboard.lineAnalysis}
                                xAxis={[{
                                    scaleType: "band",
                                    dataKey: "line",
                                    position: "bottom",
                                    height: lineDefectXAxisHeight,
                                    tickLabelInterval: () => true,
                                    valueFormatter: (line) => line,
                                    tickLabelStyle: {
                                        fill: "#ffffff",
                                        fontSize: 12,
                                        angle: shouldRotateLineLabels ? -35 : 0,
                                        textAnchor: shouldRotateLineLabels ? "end" : "middle",
                                    },
                                    axisLineStyle: { stroke: "#ffffff" },
                                    tickLineStyle: { stroke: "#ffffff" },
                                }]}
                                yAxis={[{
                                    width: 82,
                                    max: lineDefectYAxisMax,
                                    valueFormatter: (value) => `${value.toLocaleString()} pcs`,
                                    tickLabelStyle: { fill: "#ffffff", fontSize: 12 },
                                    axisLineStyle: { stroke: "#ffffff" },
                                    tickLineStyle: { stroke: "#ffffff" },
                                }]}
                                series={[
                                    {
                                        dataKey: "defect",
                                        label: "Defect pcs",
                                        valueFormatter: (value, context) => {
                                            const line = dashboard.lineAnalysis[context.dataIndex];
                                            return `${value} pcs | ${line?.defectRate ?? 0}%`;
                                        },
                                        color: "#fb7185",
                                        barLabel: (item) => {
                                            const line = dashboard.lineAnalysis[item.dataIndex];
                                            return `${item.value} pcs|${line?.defectRate ?? 0}%`;
                                        },
                                        barLabelPlacement: "outside",
                                    },
                                ]}
                                grid={{ horizontal: true, vertical: false }}
                                margin={{ top: 24, right: 0, bottom: 24, left: 0 }}
                                borderRadius={8}
                                skipAnimation={false}
                                sx={chartTextSx}
                                slots={{ barLabel: DefectBarLabel }}
                                slotProps={{
                                    ...chartSlotProps,
                                    legend: {
                                        hidden: true,
                                    },
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            {highestDefectLine && [highestDefectLine].map((line) => (
                                <div key={line.line} className="rounded-xl border flex justify-between border-rose-300/20 bg-rose-500/10 px-4 py-3 text-white w-full">
                                    <div>

                                    <p className="text-sm text-white/60">Highest defect: {line.line} | {line.buyer}</p>
                                    <p className="text-sm text-white/75">
                                        Style: {line.style} | MO: {line.mo}
                                        {line.mos?.length > 1 && <span className="whitespace-nowrap"> ({line.mos.length} MOs)</span>}
                                    </p>
                                   
                                    <p className="text-sm text-rose-100">{line.defectRate}% defect rate</p>
                                    </div>
                                     <p className="mt-1 text-2xl font-bold">{line.defect} pcs</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sub-card-glass">
                        <SectionHeader
                            icon={<DonutLargeRoundedIcon className="text-white/80" />}
                            title="Defect Type Mix"
                            subtitle={`${topDefect.type} contributes ${topDefect.rate}%`}
                        />
                        <div className="mt-4 h-[320px]">
                            <PieChart
                                series={[
                                    {
                                        data: dashboard.defectMix,
                                        innerRadius: 62,
                                        outerRadius: 118,
                                        paddingAngle: 2,
                                        cornerRadius: 4,
                                        valueFormatter: (item) => `${item.value} pcs | ${item.rate}%`,
                                    },
                                ]}
                                colors={defectChartColors}
                                margin={{ top: 18, right: 18, bottom: 18, left: 18 }}
                                skipAnimation={false}
                                sx={chartTextSx}
                                slotProps={pieChartSlotProps}
                            />
                        </div>
                        <div className="grid max-h-[330px] grid-cols-1 gap-2 overflow-y-auto pr-2">
                            {dashboard.defectMix.map((item, index) => (
                                <div key={item.type} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-white/75">
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{ backgroundColor: defectChartColors[index % defectChartColors.length] }}
                                            />
                                            {item.type}
                                        </span>
                                        <span className="font-semibold text-white">{item.qty} pcs</span>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${item.rate}%`,
                                                backgroundColor: defectChartColors[index % defectChartColors.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 xl:grid-cols-[1.1fr_1fr]">
                    <div className="sub-card-glass">
                        <SectionHeader
                            icon={<TimelineRoundedIcon className="text-white/80" />}
                            title="Hourly Defect Trend"
                            subtitle="Defect quantity and defect rate by production hour"
                        />
                        <div className="mt-4 h-[330px]">
                            <LineChart
                                xAxis={[{
                                    scaleType: "point",
                                    data: dashboard.hourlyRates.map((row) => getHourEndLabel(row.hour)),
                                    position: "bottom",
                                    height: hourlyXAxisHeight,
                                    tickLabelInterval: () => true,
                                    tickLabelStyle: {
                                        fill: "#ffffff",
                                        fontSize: 12,
                                        angle: shouldRotateLineLabels ? -35 : 0,
                                        textAnchor: shouldRotateLineLabels ? "end" : "middle",
                                    },
                                    axisLineStyle: { stroke: "#ffffff" },
                                    tickLineStyle: { stroke: "#ffffff" },
                                }]}
                                yAxis={[
                                    {
                                        id: "pcs",
                                        position: "left",
                                        width: 64,
                                        valueFormatter: (value) => `${value} pcs`,
                                        tickLabelStyle: { fill: "#ffffff", fontSize: 12 },
                                        axisLineStyle: { stroke: "#ffffff" },
                                        tickLineStyle: { stroke: "#ffffff" },
                                    },
                                    {
                                        id: "rate",
                                        position: "right",
                                        width: 42,
                                        valueFormatter: (value) => `${value}%`,
                                        tickLabelStyle: { fill: "#ffffff", fontSize: 12 },
                                        axisLineStyle: { stroke: "#ffffff" },
                                        tickLineStyle: { stroke: "#ffffff" },
                                    },
                                ]}
                                series={[
                                    {
                                        yAxisId: "pcs",
                                        data: dashboard.hourlyRates.map((row) => row.defect),
                                        label: "Defect pcs",
                                        color: "#f59e0b",
                                        valueFormatter: (value) => `${value} pcs`,
                                        curve: "catmullRom",
                                    },
                                    {
                                        yAxisId: "rate",
                                        data: dashboard.hourlyRates.map((row) => row.rate),
                                        label: "Defect rate",
                                        color: "#fb7185",
                                        valueFormatter: (value) => `${value}%`,
                                        curve: "catmullRom",
                                    },
                                ]}
                                grid={{ horizontal: true, vertical: false }}
                                margin={{ top: 24, right: 0, bottom: shouldRotateLineLabels ? 0 : 38, left: 0 }}
                                skipAnimation={false}
                                sx={chartTextSx}
                                slotProps={{
                                    ...chartSlotProps,
                                    legend: {
                                        hidden: true,
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="sub-card-glass">
                        <SectionHeader
                            icon={<FactCheckRoundedIcon className="text-white/80" />}
                            title="Follow-up Lines"
                            subtitle={`${riskLines.length} lines exceed the ${dashboard.targetDefectRate}% target`}
                        />
                        <div className="mt-4 max-h-[360px] overflow-auto pr-1">
                            <table className="w-full min-w-[640px] text-left text-sm text-white">
                                <thead className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 text-white/55 backdrop-blur">
                                <tr>
                                    <th className="py-3 pr-3 font-medium">Line</th>
                                    <th className="py-3 pr-3 font-medium">Buyer / MO</th>
                                    <th className="py-3 pr-3 font-medium">Style</th>
                                    <th className="py-3 pr-3 font-medium">Output</th>
                                    <th className="py-3 pr-3 font-medium">Defects</th>
                                    <th className="py-3 pr-3 font-medium">Rate</th>
                                    <th className="py-3 font-medium whitespace-nowrap">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dashboard.lineAnalysis.map((line) => {
                                    const isRisk = line.defectRate > dashboard.targetDefectRate;

                                    return (
                                        <tr key={line.line} className="border-b border-white/10 last:border-0">
                                            <td className="py-3 pr-3 font-semibold">{line.line}</td>
                                            <td className="py-3 pr-3 text-white/70">
                                                {line.buyer} / {line.mo}
                                                {line.mos?.length > 1 && <span className="ml-2 inline-flex whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{line.mos.length} MOs</span>}
                                            </td>
                                            <td className="py-3 pr-3 text-white/80">{line.style}</td>
                                            <td className="py-3 pr-3">{line.output.toLocaleString()} pcs</td>
                                            <td className="py-3 pr-3">{line.defect} pcs</td>
                                            <td className="py-3 pr-3">{line.defectRate.toFixed(2)}%</td>
                                            <td className="py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${isRisk ? "bg-rose-500/20 text-rose-200" : "bg-emerald-500/20 text-emerald-200"}`}>
                                                    {isRisk && <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />}
                                                    {isRisk ? "Follow-up" : "On target"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <p className="text-sm text-white/60">Highest risk line</p>
                        <p className="mt-1 text-xl font-bold">{highestRiskLine.line} | {highestRiskLine.defectRate.toFixed(2)}%</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <p className="text-sm text-white/60">Top defect type</p>
                        <p className="mt-1 text-xl font-bold">{topDefect.type} | {topDefect.qty} pcs</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <p className="text-sm text-white/60">Best line today</p>
                        <p className="mt-1 text-xl font-bold">{bestLine.line} | {bestLine.defectRate.toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductionStatusSewingDefect;
