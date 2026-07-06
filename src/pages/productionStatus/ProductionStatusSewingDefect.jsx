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
import StatCardsDash from "../../components/card/StatCardsDash.jsx";
import { useGetDefectTodayQuery } from "../../redux/feature/analysis/analysisApiSlice.js";

const USE_MOCK_DEFECT_DATA = true;

const sewingDefectMockApi = {
    updatedAt: "10:07 AM",
    targetDefectRate: 2.5,
    lines: [
        {
            line: "Line 1",
            mos: [
                {
                    mo: "GPAR12406",
                    style: "ST-2406",
                    output: 760,
                    defect: 12,
                    defectTypes: [
                        { type: "Open seam", qty: 3 },
                        { type: "Broken stitch", qty: 2 },
                        { type: "Dirty mark", qty: 2 },
                        { type: "Skip stitch", qty: 1 },
                        { type: "Needle mark", qty: 1 },
                        { type: "Puckering", qty: 1 },
                        { type: "Loose thread", qty: 1 },
                        { type: "Oil stain", qty: 1 },
                    ],
                    pos: [
                        {
                            buyer: "H&M",
                        },
                    ],
                },
                {
                    mo: "GPAR12459",
                    style: "ST-2459",
                    output: 520,
                    defect: 9,
                    defectTypes: [
                        { type: "Open seam", qty: 2 },
                        { type: "Broken stitch", qty: 1 },
                        { type: "Dirty mark", qty: 1 },
                        { type: "Skip stitch", qty: 1 },
                        { type: "Uneven stitch", qty: 1 },
                        { type: "Label issue", qty: 1 },
                        { type: "Size mark", qty: 1 },
                        { type: "Button issue", qty: 1 },
                    ],
                    pos: [
                        {
                            buyer: "H&M",
                        },
                    ],
                },
            ],
        },
        {
            line: "Line 2",
            buyer: "Target",
            mo: "GPAR12460",
            style: "ST-2460",
            output: 1160,
            defect: 43,
            defectTypes: [
                { type: "Open seam", qty: 9 },
                { type: "Broken stitch", qty: 7 },
                { type: "Dirty mark", qty: 6 },
                { type: "Skip stitch", qty: 5 },
                { type: "Needle mark", qty: 4 },
                { type: "Puckering", qty: 3 },
                { type: "Uneven stitch", qty: 2 },
                { type: "Loose thread", qty: 2 },
                { type: "Oil stain", qty: 2 },
                { type: "Label issue", qty: 1 },
                { type: "Size mark", qty: 1 },
                { type: "Button issue", qty: 1 },
            ],
        },
        {
            line: "Line 3",
            buyer: "Nike",
            mo: "GPAR12461",
            style: "ST-2461",
            output: 1425,
            defect: 29,
            defectTypes: [
                { type: "Open seam", qty: 6 },
                { type: "Broken stitch", qty: 5 },
                { type: "Dirty mark", qty: 4 },
                { type: "Skip stitch", qty: 3 },
                { type: "Needle mark", qty: 2 },
                { type: "Puckering", qty: 2 },
                { type: "Uneven stitch", qty: 2 },
                { type: "Loose thread", qty: 1 },
                { type: "Oil stain", qty: 1 },
                { type: "Label issue", qty: 1 },
                { type: "Size mark", qty: 1 },
                { type: "Button issue", qty: 1 },
            ],
        },
        {
            line: "Line 4",
            buyer: "Adidas",
            mo: "GPAR12463",
            style: "ST-2463",
            output: 980,
            defect: 18,
            defectTypes: [
                { type: "Open seam", qty: 4 },
                { type: "Broken stitch", qty: 3 },
                { type: "Dirty mark", qty: 2 },
                { type: "Skip stitch", qty: 2 },
                { type: "Needle mark", qty: 1 },
                { type: "Puckering", qty: 1 },
                { type: "Uneven stitch", qty: 1 },
                { type: "Loose thread", qty: 1 },
                { type: "Oil stain", qty: 1 },
                { type: "Label issue", qty: 1 },
                { type: "Size mark", qty: 1 },
            ],
        },
        {
            line: "Line 5",
            mos: [
                {
                    mo: "GPAR12464",
                    style: "ST-2464",
                    output: 420,
                    defect: 14,
                    defectTypes: [
                        { type: "Open seam", qty: 3 },
                        { type: "Broken stitch", qty: 2 },
                        { type: "Dirty mark", qty: 2 },
                        { type: "Skip stitch", qty: 2 },
                        { type: "Needle mark", qty: 1 },
                        { type: "Puckering", qty: 1 },
                        { type: "Loose thread", qty: 1 },
                        { type: "Size mark", qty: 2 },
                    ],
                    pos: [
                        {
                            buyer: "Uniqlo",
                        },
                    ],
                },
                {
                    mo: "GPAR12465",
                    style: "ST-2464",
                    output: 385,
                    defect: 13,
                    defectTypes: [
                        { type: "Open seam", qty: 3 },
                        { type: "Broken stitch", qty: 2 },
                        { type: "Dirty mark", qty: 2 },
                        { type: "Skip stitch", qty: 1 },
                        { type: "Needle mark", qty: 1 },
                        { type: "Uneven stitch", qty: 1 },
                        { type: "Loose thread", qty: 1 },
                        { type: "Oil stain", qty: 1 },
                        { type: "Label issue", qty: 1 },
                    ],
                    pos: [
                        {
                            buyer: "Uniqlo",
                        },
                    ],
                },
                {
                    mo: "GPAR12472",
                    style: "ST-2464",
                    output: 270,
                    defect: 9,
                    defectTypes: [
                        { type: "Open seam", qty: 2 },
                        { type: "Broken stitch", qty: 2 },
                        { type: "Dirty mark", qty: 1 },
                        { type: "Skip stitch", qty: 1 },
                        { type: "Needle mark", qty: 1 },
                        { type: "Puckering", qty: 1 },
                        { type: "Uneven stitch", qty: 1 },
                    ],
                    pos: [
                        {
                            buyer: "Uniqlo",
                        },
                    ],
                },
            ],
        },
        {
            line: "Line 6",
            buyer: "Puma",
            mo: "GPAR12466",
            style: "ST-2466",
            output: 1320,
            defect: 24,
            defectTypes: [
                { type: "Open seam", qty: 5 },
                { type: "Broken stitch", qty: 4 },
                { type: "Dirty mark", qty: 3 },
                { type: "Skip stitch", qty: 2 },
                { type: "Needle mark", qty: 2 },
                { type: "Puckering", qty: 2 },
                { type: "Uneven stitch", qty: 1 },
                { type: "Loose thread", qty: 1 },
                { type: "Oil stain", qty: 1 },
                { type: "Label issue", qty: 1 },
                { type: "Size mark", qty: 2 },
            ],
        },
        { 
            line: "Line 7",
            buyer: "Puma",
            mo: "GPAR12466",
            style: "ST-2467",
            output: 1320,
            defect: 24,
            defectTypes: [
                { type: "Open seam", qty: 5 },
                { type: "Broken stitch", qty: 4 },
                { type: "Dirty mark", qty: 3 },
                { type: "Skip stitch", qty: 2 },
                { type: "Needle mark", qty: 2 },
                { type: "Puckering", qty: 2 },
                { type: "Uneven stitch", qty: 1 },
                { type: "Loose thread", qty: 1 },
                { type: "Oil stain", qty: 1 },
                { type: "Label issue", qty: 1 },
                { type: "Size mark", qty: 2 },
            ],
        },
        {
            line: "Line 8",
            buyer: "Puma",
            mo: "GPAR12466",
            style: "ST-2468",
            output: 1320,
            defect: 24,
            defectTypes: [
                { type: "Open seam", qty: 5 },
                { type: "Broken stitch", qty: 4 },
                { type: "Dirty mark", qty: 3 },
                { type: "Skip stitch", qty: 2 },
                { type: "Needle mark", qty: 2 },
                { type: "Puckering", qty: 2 },
                { type: "Uneven stitch", qty: 1 },
                { type: "Loose thread", qty: 1 },
                { type: "Oil stain", qty: 1 },
                { type: "Label issue", qty: 1 },
                { type: "Size mark", qty: 2 },
            ],
        },
    ],
    hourlyTrend: [
        { hour: "08:00", output: 930, defect: 31 },
        { hour: "09:00", output: 1085, defect: 34 },
        { hour: "10:00", output: 1120, defect: 29 },
        { hour: "11:00", output: 1188, defect: 25 },
        { hour: "12:00", output: 820, defect: 15 },
        { hour: "13:00", output: 1210, defect: 31 },
        { hour: "14:00", output: 1270, defect: 35 },
        { hour: "15:00", output: 1312, defect: 30 },
    ],
};

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

function normalizeMoItem(moItem, moIndex, parent = {}) {
    const poGroups = Array.isArray(moItem?.pos) ? moItem.pos : Array.isArray(moItem?.purchaseOrders) ? moItem.purchaseOrders : [];

    if (poGroups.length > 0) {
        const normalizedPos = poGroups.map((poItem) => ({
            ...poItem,
            buyer: poItem?.buyer ?? parent.buyer ?? "-",
            po: poItem?.po ?? poItem?.poNo ?? "-",
        }));
        const defectTypes = normalizeDefectTypes(moItem?.defectTypes);
        const defectTypeTotal = defectTypes.reduce((sum, item) => sum + item.qty, 0);

        return {
            ...moItem,
            buyer: getUniqueLabel(normalizedPos.map((item) => item.buyer)) || parent.buyer || "-",
            po: getUniqueLabel(normalizedPos.map((item) => item.po)) || "-",
            mo: moItem?.mo ?? moItem?.moNo ?? `MO ${moIndex + 1}`,
            style: moItem?.style ?? moItem?.styleNo ?? "-",
            output: Number(moItem?.output ?? moItem?.checked ?? 0),
            defect: Number(moItem?.defect ?? moItem?.defectQty ?? defectTypeTotal),
            defectTypes,
            pos: normalizedPos,
        };
    }

    const defectTypes = normalizeDefectTypes(moItem?.defectTypes);
    const defectTypeTotal = defectTypes.reduce((sum, item) => sum + item.qty, 0);

    return {
        ...moItem,
        buyer: moItem?.buyer ?? parent.buyer ?? "-",
        po: moItem?.po ?? moItem?.poNo ?? parent.po ?? parent.poNo ?? "-",
        mo: moItem?.mo ?? moItem?.moNo ?? `MO ${moIndex + 1}`,
        style: moItem?.style ?? moItem?.styleNo ?? "-",
        output: Number(moItem?.output ?? moItem?.checked ?? 0),
        defect: Number(moItem?.defect ?? moItem?.defectQty ?? defectTypeTotal),
        defectTypes,
    };
}

function normalizeLine(line, index) {
    const poGroups = Array.isArray(line?.pos) ? line.pos : Array.isArray(line?.purchaseOrders) ? line.purchaseOrders : [];
    const mos = poGroups.length > 0
        ? poGroups.flatMap((poItem) => {
            const poMos = Array.isArray(poItem?.mos) ? poItem.mos : [];
            return poMos.map((moItem, moIndex) => normalizeMoItem(moItem, moIndex, poItem));
        })
        : Array.isArray(line?.mos)
            ? line.mos.map((moItem, moIndex) => normalizeMoItem(moItem, moIndex, line))
            : [];

    if (mos.length > 0) {
        const output = mos.reduce((sum, item) => sum + item.output, 0);
        const defect = mos.reduce((sum, item) => sum + item.defect, 0);
        const defectTypes = mergeDefectTypes(mos.map((item) => item.defectTypes));
        const buyerLabel = getUniqueLabel(mos.map((item) => item.buyer));
        const poLabel = getUniqueLabel(mos.map((item) => item.po));
        const moLabel = mos.map((item) => item.mo).join(", ");
        const styleLabel = getUniqueStyleLabel(mos.map((item) => item.style));

        return {
            ...line,
            line: line?.line ?? line?.lineName ?? `Line ${index + 1}`,
            buyer: buyerLabel || line?.buyer || "-",
            po: poLabel || line?.po || line?.poNo || "-",
            mo: moLabel || "-",
            style: styleLabel || "-",
            output,
            defect,
            defectTypes,
            mos,
            pos: mos.flatMap((item) => item.pos ?? []),
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
        po: line?.po ?? line?.poNo ?? "-",
        mo: line?.mo ?? line?.moNo ?? "-",
        style: line?.style ?? line?.styleNo ?? "-",
        output,
        defect,
        defectTypes,
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
    const { data: defectToday, isLoading: isLoadingDefectToday, refetch, isFetching: isFetchingDefectToday } = useGetDefectTodayQuery(undefined, {
        skip: USE_MOCK_DEFECT_DATA,
    });

    const [lastUpdated, setLastUpdated] = useState(sewingDefectMockApi.updatedAt);

    const dashboard = useMemo(() => {
        const source = USE_MOCK_DEFECT_DATA ? sewingDefectMockApi : defectToday ?? sewingDefectMockApi;
        const lines = Array.isArray(source?.lines) ? source.lines.map(normalizeLine) : [];
        const hourlyTrend = Array.isArray(source?.hourlyTrend) ? source.hourlyTrend : [];
        const targetDefectRate = Number(source?.targetDefectRate ?? sewingDefectMockApi.targetDefectRate);
        const updatedAt = source?.updatedAt ?? sewingDefectMockApi.updatedAt;

        const totalOutput = lines.reduce((sum, line) => sum + line.output, 0);
        const totalDefect = lines.reduce((sum, line) => sum + line.defect, 0);
        const defectRate = totalOutput ? (totalDefect / totalOutput) * 100 : 0;
        const affectedLines = lines.filter((line) => line.defect > 0).length;
        const activeStyles = new Set(lines.map((line) => line.style).filter(Boolean)).size;

        const lineAnalysis = lines
            .map((line) => ({
                ...line,
                defectRate: line.output ? Number(((line.defect / line.output) * 100).toFixed(2)) : 0,
                passQty: line.output - line.defect,
                contribution: totalDefect ? Number(((line.defect / totalDefect) * 100).toFixed(1)) : 0,
            }))
            .sort((a, b) => b.defect - a.defect);

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
            activeStyles,
            lineAnalysis,
            defectMix,
            hourlyRates,
            targetDefectRate,
        };
    }, [defectToday]);

    const refreshMockApi = () => {
        if (!USE_MOCK_DEFECT_DATA) {
            refetch();
        }
        setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };

    const displayUpdatedAt = USE_MOCK_DEFECT_DATA ? lastUpdated : defectToday?.updatedAt ?? dashboard.updatedAt ?? lastUpdated;
    const riskLines = dashboard.lineAnalysis.filter((line) => line.defectRate > dashboard.targetDefectRate);
    const topDefect = dashboard.defectMix[0] ?? { type: "-", qty: 0, rate: 0 };
    const highestRiskLine = [...dashboard.lineAnalysis].sort((a, b) => b.defectRate - a.defectRate)[0] ?? { line: "-", defectRate: 0 };
    const bestLine = [...dashboard.lineAnalysis].sort((a, b) => a.defectRate - b.defectRate)[0] ?? { line: "-", defectRate: 0 };

    return (
        <div className="pb-12">
            <div className="card-glass flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center text-white">
                <div>
                    <p className="text-[clamp(1rem,4vw,1.3rem)] text-nowrap">WIP | Sewing Defect Dashboard / Real-Time</p>
                    <p className="text-[clamp(0.8rem,3vw,1rem)] text-white/75">Live | Sewing Defect | Updated {displayUpdatedAt}</p>
                </div>
                <button className="button-glass" onClick={refreshMockApi} disabled={!USE_MOCK_DEFECT_DATA && (isLoadingDefectToday || isFetchingDefectToday)}>
                    <RefreshIcon className={!USE_MOCK_DEFECT_DATA && (isLoadingDefectToday || isFetchingDefectToday) ? "animate-spin" : ""} /> Refresh
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
                        percentage={`${dashboard.lineAnalysis.length} running lines`}
                        icon={<img src="/images/tshirt.png" alt="active styles" className="w-10 h-auto" />}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 xl:grid-cols-[1.35fr_0.9fr]">
                    <div className="sub-card-glass">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <SectionHeader
                                icon={<BarChartRoundedIcon className="text-white/80" />}
                                title="Line Defect Hotspots"
                                subtitle={`${dashboard.lineAnalysis.length} lines | ${dashboard.totalDefect} defects | Sorted by quantity`}
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
                                    tickLabelStyle: { fill: "#ffffff" },
                                    axisLineStyle: { stroke: "#ffffff" },
                                    tickLineStyle: { stroke: "#ffffff" },
                                }]}
                                yAxis={[{
                                    width: 96,
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
                                margin={{ top: 70, right: 28, bottom: 38, left: 10 }}
                                borderRadius={8}
                                skipAnimation={false}
                                sx={chartTextSx}
                                slots={{ barLabel: DefectBarLabel }}
                                slotProps={chartSlotProps}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            {dashboard.lineAnalysis.slice(0, 1).map((line) => (
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
                                    data: dashboard.hourlyRates.map((row) => row.hour),
                                    tickLabelStyle: { fill: "#ffffff" },
                                    axisLineStyle: { stroke: "#ffffff" },
                                    tickLineStyle: { stroke: "#ffffff" },
                                }]}
                                yAxis={[
                                    {
                                        id: "pcs",
                                        valueFormatter: (value) => `${value} pcs`,
                                        tickLabelStyle: { fill: "#ffffff" },
                                        axisLineStyle: { stroke: "#ffffff" },
                                        tickLineStyle: { stroke: "#ffffff" },
                                    },
                                    {
                                        id: "rate",
                                        valueFormatter: (value) => `${value}%`,
                                        tickLabelStyle: { fill: "#ffffff" },
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
                                margin={{ top: 28, right: 22, bottom: 34, left: 52 }}
                                skipAnimation={false}
                                sx={chartTextSx}
                                slotProps={chartSlotProps}
                            />
                        </div>
                    </div>

                    <div className="sub-card-glass">
                        <SectionHeader
                            icon={<FactCheckRoundedIcon className="text-white/80" />}
                            title="Follow-up Lines"
                            subtitle={`${riskLines.length} lines exceed the ${dashboard.targetDefectRate}% target`}
                        />
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm text-white">
                                <thead className="border-b border-white/10 text-white/55">
                                <tr>
                                    <th className="py-3 pr-3 font-medium">Line</th>
                                    <th className="py-3 pr-3 font-medium">Buyer / MO</th>
                                    <th className="py-3 pr-3 font-medium">Style</th>
                                    <th className="py-3 pr-3 font-medium">Output</th>
                                    <th className="py-3 pr-3 font-medium">Defects</th>
                                    <th className="py-3 pr-3 font-medium">Rate</th>
                                    <th className="py-3 font-medium">Status</th>
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
                                            <td className="py-3">
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
