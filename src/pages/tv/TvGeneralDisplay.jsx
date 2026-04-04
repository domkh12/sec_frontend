import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "../../components/util/Logo.jsx";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import { useGetTvGeneralDataQuery } from "../../redux/feature/tv/tvApiSlice.js";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import NumberFlow from "@number-flow/react";

// ─── Hour keys ────────────────────────────────────────────────────────────────
const ALL_HOUR_KEYS   = ["h8","h9","h10","h11","h13","h14","h15","h16","h17","h18"];
const ALL_HOUR_LABELS = ["8:00","9:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"];

const isSaturday  = new Date().getDay() === 6;
const HOUR_KEYS   = isSaturday ? ALL_HOUR_KEYS.slice(0, 8)   : ALL_HOUR_KEYS;
const HOUR_LABELS = isSaturday ? ALL_HOUR_LABELS.slice(0, 8) : ALL_HOUR_LABELS;

// ─── Frontend calculation ─────────────────────────────────────────────────────
function calcRow(row) {
    const finish = HOUR_KEYS.reduce(
        (sum, k) => sum + (typeof row[k] === "number" ? row[k] : 0), 0
    );
    const completedHours = HOUR_KEYS.filter(
        (k) => typeof row[k] === "number" && row[k] > 0
    ).length;
    const tarNow = completedHours * row.tarH;
    const dif = finish - tarNow;
    const finishPct = row.tarDay > 0 ? Math.round((finish / row.tarDay) * 1000) / 10 : 0;
    const defPct = finish > 0 ? Math.round((row.defects / finish) * 1000) / 10 : 0;
    return { ...row, finish, tarNow, dif, finishPct, defPct };
}

// ─── Compute TOTAL row ────────────────────────────────────────────────────────
function buildTotal(rows) {
    const totalWorker  = rows.reduce((s, r) => s + (r.worker  ?? 0), 0);
    const totalTarH    = rows.reduce((s, r) => s + (r.tarH    ?? 0), 0);
    const totalTarDay  = rows.reduce((s, r) => s + (r.tarDay  ?? 0), 0);
    const totalTarNow  = rows.reduce((s, r) => s + (r.tarNow  ?? 0), 0);
    const totalFinish  = rows.reduce((s, r) => s + (r.finish  ?? 0), 0);
    const totalYFinish = rows.reduce((s, r) => s + (r.yFinish ?? 0), 0);
    const totalDefects = rows.reduce((s, r) => s + (r.defects ?? 0), 0);
    const totalDif       = totalFinish - totalTarNow;
    const totalFinishPct = totalTarDay > 0 ? Math.round((totalFinish / totalTarDay) * 1000) / 10 : 0;
    const totalDefPct    = totalFinish > 0 ? Math.round((totalDefects / totalFinish) * 1000) / 10 : 0;
    const hourTotals = {};
    HOUR_KEYS.forEach((k) => {
        hourTotals[k] = rows.reduce((s, r) => s + (typeof r[k] === "number" ? r[k] : 0), 0) || null;
    });
    return {
        line: "", styleNo: "Factory ALL    Total", sewStart: "", day: "", worker: totalWorker, act: "0-0",
        hour: "", tarH: totalTarH, tarDay: totalTarDay, tarNow: totalTarNow, dif: totalDif,
        finishPct: totalFinishPct, finish: totalFinish, yFinish: totalYFinish,
        defects: totalDefects, defPct: totalDefPct,
        ...hourTotals,
    };
}

// ─── Color helpers ────────────────────────────────────────────────────────────
function getBarColor(pct) {
    if (pct >= 100) return "#16a34a";
    if (pct >= 50)  return "#eab308";
    return "#dc2626";
}

// ─── FinishCell ───────────────────────────────────────────────────────────────
function FinishCell({ pct }) {
    const color  = getBarColor(pct);
    const capped = Math.min(pct, 100);
    return (
        <td className="border-2 border-blue-200 p-0 relative overflow-hidden" style={{ minWidth: 70 }}>
            <div style={{
                position: "absolute", top: 0, left: 0,
                height: "100%", width: `${capped}%`,
                background: color, opacity: 0.82
            }} />
            <div className="relative z-10 text-center font-bold text-xl py-1 px-0.5 text-gray-900"
                 style={{ textShadow: capped >= 45 ? "0 1px 2px rgba(0,0,0,0.45)" : "none" }}>
                {pct ? `${pct}%` : ""}
            </div>
        </td>
    );
}

// ─── DataTable ────────────────────────────────────────────────────────────────
function DataTable({ rows, total }) {
    const isSaturdays = new Date().getDay() === 4;
    console.log("isSaturdays", isSaturdays);
    // Use border-separate + border-spacing-0 to prevent 1px border collapse on zoom/scale
    // This is the key fix for Android TV box border disappearing on zoom

    const thCls = "border-2 border-blue-500 bg-blue-700 text-white px-1 py-1 text-center text-sm font-bold whitespace-nowrap leading-tight";
    const tdCls = "border-2 border-blue-200 px-1 py-0.5 text-center text-xl whitespace-nowrap leading-snug";

    const renderRow = (row, idx, isTotal) => {
        const rowBg = isTotal ? "bg-yellow-300" : idx % 2 === 0 ? "bg-white" : "bg-blue-50";
        const fw    = isTotal ? "font-bold" : "font-normal";
        const randomKey = `row-${idx}`;
        return (
            <tr key={row.line || randomKey} className={rowBg}>
                {/* Line */}
                <td className={`${tdCls} text-blue-900 font-bold text-3xl text-left pl-1`}>
                    {row.line}
                </td>
                {/* Style No */}
                <td className={`${tdCls} ${fw} text-left pl-1 max-w-[130px] overflow-hidden text-ellipsis`}>
                    {row.styleNo}
                </td>
                {/* Sew Start */}
                <td className={tdCls}>{row.sewStart}</td>
                {/* Day */}
                <td className={tdCls}>{row.day}</td>
                {/* Worker */}
                <td className={tdCls}>{row.worker}</td>
                {/* Hour */}
                <td className={tdCls}>{row.hour}</td>
                {/* Tar/H */}
                <td className={tdCls}>{row.tarH}</td>
                {/* Tar/Day */}
                <td className={tdCls}>{row.tarDay}</td>
                {/* Tar/Now */}
                <td className={`${tdCls} ${fw}`}>{row.tarNow || ""}</td>
                {/* DIF */}
                <td className={`${tdCls} text-red-600 font-bold`}>{row.dif || ""}</td>
                {/* Finish% with bar */}
                <FinishCell pct={row.finishPct} />
                {/* Finish */}
                <td className={`${tdCls} font-bold`}
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                    {row.finish || ""}
                </td>
                {/* Y.Finish */}
                <td className={`${tdCls} ${fw}`}>{row.yFinish || ""}</td>
                {/* Def.% */}
                <td className={`${tdCls} font-bold`}
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                    {row.defPct > 0 ? `${row.defPct}%` : ""}
                </td>
                {/* Hour columns */}
                {HOUR_KEYS.map((k) => (
                    <td key={k} className={`${tdCls} ${fw}`}>
                        {row[k] ? row[k] : ""}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <div className="w-full overflow-x-auto">
            <table
                className="w-full"
                style={{
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    tableLayout: "auto",
                }}
            >
                <thead>
                <tr>
                    <th className={`${thCls} text-left pl-1`}>Line</th>
                    <th className={`${thCls} text-left pl-1`}>Style No</th>
                    <th className={thCls}>Sew.Start</th>
                    <th className={thCls}>Day</th>
                    <th className={thCls}>Worker</th>
                    <th className={thCls}>Hour</th>
                    <th className={thCls}>Tar/H</th>
                    <th className={thCls}>Tar/Day</th>
                    <th className={thCls}>Tar/Now</th>
                    <th className={`${thCls} bg-blue-900`}>DIF.</th>
                    <th className={`${thCls} bg-green-800`}>Finish%</th>
                    <th className={thCls}>Finish</th>
                    <th className={thCls}>Y.Finish</th>
                    <th className={thCls}>Def.%</th>
                    {HOUR_LABELS.map((l) => (
                        <th key={l} className={thCls}>{l}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, i) => renderRow(row, i, false))}
                {renderRow(total, 0, true)}
                </tbody>
            </table>
        </div>
    );
}

// ─── CtrlButton ───────────────────────────────────────────────────────────────
function CtrlButton({ icon, label, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center gap-1.5 rounded-xl px-5 py-3.5 cursor-pointer
                border-2 font-bold text-xs tracking-wide transition-all duration-150
                min-w-[76px] font-sans
                ${active
                ? "bg-blue-700 border-blue-400 text-white scale-105"
                : "bg-slate-900 border-slate-700 text-blue-300 hover:bg-slate-800 hover:border-blue-600 hover:text-blue-200 hover:scale-105"
            }
            `}
        >
            <span className="text-2xl leading-none">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TvGeneralDisplay() {
    const [now, setNow]                   = useState(new Date());
    const [showControls, setShowControls] = useState(false);
    const [zoom, setZoom]                 = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const popupRef     = useRef(null);
    const theme        = useTheme();

    const { messages, loading, connectionState, isConnected } = useWebsocketServer(
        `/topic/messages/tv-data-update`
    );

    const { data: tvGeneralData, isLoading, isSuccess, refetch } = useGetTvGeneralDataQuery(undefined, {
        pollingInterval: 300000,
    });

    useEffect(() => {
        if (messages.isUpdate === true) refetch();
    }, [messages]);

    const computedRows = isSuccess && Array.isArray(tvGeneralData)
        ? tvGeneralData.map(calcRow)
        : [];

    const total = computedRows.length > 0 ? buildTotal(computedRows) : null;

    // Clock
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // Fullscreen change listener
    useEffect(() => {
        const fn = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", fn);
        return () => document.removeEventListener("fullscreenchange", fn);
    }, []);

    // Close popup on outside click
    useEffect(() => {
        const fn = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target))
                setShowControls(false);
        };
        if (showControls) document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, [showControls]);

    // Escape closes popup
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") setShowControls(false); };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, []);

    const handleFullscreen = useCallback(async () => {
        const el = containerRef.current;
        if (!document.fullscreenElement) {
            try { await el.requestFullscreen(); } catch (e) { console.error(e); }
        } else {
            await document.exitFullscreen();
        }
    }, []);

    const handleZoomIn    = () => setZoom((z) => Math.min(+(z + 0.1).toFixed(1), 3));
    const handleZoomOut   = () => setZoom((z) => Math.max(+(z - 0.1).toFixed(1), 0.3));
    const handleZoomReset = () => setZoom(1);

    const pad     = (n) => String(n).padStart(2, "0");
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const [h, m, s] = timeStr.split(":").map(Number);

    if (isLoading) return <CircularProgress />;
    if (!isSuccess || computedRows.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="bg-slate-100 min-h-screen font-sans box-border"
        >
            {/* ── Zoom wrapper ── */}
            <div style={{
                padding: 12,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: `${(1 / zoom) * 100}%`,
                transition: "transform 0.2s ease",
            }}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-4 py-2">
                        {/* Logo */}
                        <div className="flex items-center gap-2 min-w-[140px]">
                            <Logo />
                        </div>

                        {/* Title */}
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, cursor: "pointer", color: theme.palette.primary.main }}
                            onClick={(e) => { e.stopPropagation(); setShowControls(true); }}
                            title="Click for display controls"
                        >
                            Product Real Status
                        </Typography>

                        {/* Date / Time */}
                        <div className="text-right min-w-[180px]">
                            <div className="text-xl font-bold">{dateStr}</div>
                            <div className="text-red-500 text-3xl font-bold tracking-widest"
                                 style={{ fontVariantNumeric: "tabular-nums" }}>
                                <span>
                                  <NumberFlow value={h} format={{ minimumIntegerDigits: 2 }} />
                                  :
                                  <NumberFlow value={m} format={{ minimumIntegerDigits: 2 }} />
                                  :
                                  <NumberFlow value={s} format={{ minimumIntegerDigits: 2 }} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    <DataTable rows={computedRows} total={total} />

                </div>
            </div>

            {/* ── CONTROLS POPUP ── */}
            {showControls && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        ref={popupRef}
                        className="bg-slate-900 rounded-2xl px-10 py-8 flex flex-col items-center gap-5 min-w-[300px]"
                        style={{ boxShadow: "0 12px 60px rgba(0,0,0,0.8), 0 0 0 1px #1e3a5f" }}
                    >
                        {/* Title */}
                        <div className="text-center">
                            <div className="text-blue-300 text-xl font-black tracking-widest">
                                Product Real Status
                            </div>
                            <div className="text-slate-600 text-xs tracking-widest mt-0.5">
                                DISPLAY CONTROLS
                            </div>
                        </div>

                        <CtrlButton
                            icon={isFullscreen ? "⊡" : "⛶"}
                            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            onClick={handleFullscreen}
                            active={isFullscreen}
                        />

                        <div className="w-full h-px bg-slate-700" />
                        <div className="text-slate-500 text-xs font-bold tracking-widest">ZOOM LEVEL</div>

                        <div className="flex gap-3 items-center">
                            <CtrlButton icon="−" label="Zoom Out" onClick={handleZoomOut} />
                            <div className="text-blue-300 text-2xl font-black min-w-[68px] text-center
                                bg-slate-950 border-2 border-slate-700 rounded-lg py-1.5 px-1">
                                {Math.round(zoom * 100)}%
                            </div>
                            <CtrlButton icon="+" label="Zoom In" onClick={handleZoomIn} />
                        </div>

                        <CtrlButton icon="↺" label="Reset" onClick={handleZoomReset} />

                        <div className="w-full h-px bg-slate-700" />

                        <button
                            onClick={() => setShowControls(false)}
                            className="bg-red-900 border-2 border-red-600 rounded-xl text-white
                                px-8 py-2.5 text-sm font-black tracking-wide cursor-pointer
                                hover:bg-red-700 transition-colors duration-150"
                        >
                            ✕ CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}