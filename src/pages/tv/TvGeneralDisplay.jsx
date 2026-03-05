import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "../../components/util/Logo.jsx";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import { useGetTvGeneralDataQuery } from "../../redux/feature/tv/tvApiSlice.js";
import useWebsocketServer from "../../hook/useWebsocketServer.js";

// ─── Hour keys ────────────────────────────────────────────────────────────────
const HOUR_KEYS   = ["h8","h9","h10","h11","h13","h14","h15","h16","h17","h18"];
const HOUR_LABELS = ["8:00","9:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"];

// ─── Frontend calculation ─────────────────────────────────────────────────────
function calcRow(row) {
    const finish = HOUR_KEYS.reduce(
        (sum, k) => sum + (typeof row[k] === "number" ? row[k] : 0),
        0
    );

    const completedHours = HOUR_KEYS.filter(
        (k) => typeof row[k] === "number" && row[k] > 0
    ).length;

    const tarNow = completedHours * row.tarH;
    const dif = finish - tarNow;

    const finishPct =
        row.tarDay > 0
            ? Math.round((finish / row.tarDay) * 1000) / 10
            : 0;

    const defPct =
        finish > 0
            ? Math.round((row.defects / finish) * 1000) / 10
            : 0;

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

function getDifColor(dif) {
    if (dif >= 0)    return { bg: "#16a34a", fg: "#fff" };
    if (dif >= -300) return { bg: "#eab308", fg: "#000" };
    if (dif >= -700) return { bg: "#f97316", fg: "#fff" };
    return { bg: "#dc2626", fg: "#fff" };
}

// ─── FinishCell ───────────────────────────────────────────────────────────────
function FinishCell({ pct }) {
    const color  = getBarColor(pct);
    const capped = Math.min(pct, 100);
    return (
        <td style={{ border: "1px solid #b0c4de", padding: 0, position: "relative", overflow: "hidden", minWidth: 70 }}>
            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${capped}%`, background: color, opacity: 0.82 }} />
            <div style={{
                position: "relative", zIndex: 1, textAlign: "center",
                fontWeight: "bold", fontSize: 20, padding: "3px 2px",
                color: "#111",
                textShadow: capped >= 45 ? "0 1px 2px rgba(0,0,0,0.45)" : "none",
            }}>
                {pct ? `${pct}%` : ""}
            </div>
        </td>
    );
}

// ─── DataTable ────────────────────────────────────────────────────────────────
function DataTable({ rows, total }) {
    const thS = (extra = {}) => ({
        background: "#1b4faa", color: "#fff", border: "1px solid #2a5fc0",
        padding: "5px 3px", textAlign: "center", fontSize: 15,
        fontWeight: "bold", whiteSpace: "nowrap", lineHeight: 1.2, ...extra,
    });
    const tdS = (extra = {}) => ({
        border: "1px solid #b0c4de", padding: "3px 3px", textAlign: "center",
        fontSize: 20, whiteSpace: "nowrap", lineHeight: 1.3, ...extra,
    });

    const renderRow = (row, idx, isTotal) => {
        const rowBg = isTotal ? "#c8a84b" : idx % 2 === 0 ? "#ffffff" : "#dce8fa";
        const fw    = isTotal ? "bold" : "normal";

        return (
            <tr key={row.line || "total"} style={{ background: rowBg }}>
                <td style={tdS({ color: isTotal ? "#000" : "#1e3a8a", fontWeight: "bold", fontSize: 32, textAlign: "left", paddingLeft: 5 })}>{row.line}</td>
                <td style={tdS({ textAlign: "left", paddingLeft: 4, fontWeight: fw, maxWidth: 148, overflow: "hidden", textOverflow: "ellipsis" })}>{row.styleNo}</td>
                <td style={tdS()}>{row.sewStart}</td>
                <td style={tdS()}>{row.day}</td>
                <td style={tdS()}>{row.worker}</td>
                <td style={tdS()}></td>
                <td style={tdS()}>{row.hour}</td>
                <td style={tdS()}>{row.tarH}</td>
                <td style={tdS()}>{row.tarDay}</td>
                <td style={tdS({ fontWeight: fw })}>{row.tarNow || ""}</td>
                <td style={tdS({ color: "#e20b0b", fontWeight: "bold" })}>{row.dif || ""}</td>
                <FinishCell pct={row.finishPct} />
                <td style={{
                    position: "relative", zIndex: 1, textAlign: "center",
                    fontWeight: "bold", fontSize: 20, padding: "3px 2px",
                    color: "#111", border: "1px solid #b0c4de",
                    textShadow: "0 1px 2px rgba(0,0,0,0.45)"
                }}>{row.finish || ""}</td>
                <td style={tdS({ fontWeight: fw })}>{row.yFinish || ""}</td>
                <td style={{
                    position: "relative", zIndex: 1, textAlign: "center",
                    fontWeight: "bold", fontSize: 20, padding: "3px 2px",
                    color: "#111", border: "1px solid #b0c4de",
                    textShadow: "0 1px 2px rgba(0,0,0,0.45)"
                }}>
                    {row.defPct > 0 ? ` ${row.defPct}%` : ""}
                </td>
                {HOUR_KEYS.map((k) => (
                    <td key={k} style={tdS({ fontWeight: fw })}>
                        {row[k] ? row[k] : ""}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
            <colgroup>
                <col style={{ width: 38 }} /><col style={{ width: 148 }} /><col style={{ width: 60 }} />
                <col style={{ width: 32 }} /><col style={{ width: 46 }} /><col style={{ width: 38 }} />
                <col style={{ width: 36 }} /><col style={{ width: 42 }} /><col style={{ width: 50 }} />
                <col style={{ width: 54 }} /><col style={{ width: 58 }} /><col style={{ width: 72 }} />
                <col style={{ width: 50 }} /><col style={{ width: 56 }} /><col style={{ width: 44 }} />
                {HOUR_LABELS.map((l) => <col key={l} style={{ width: 46 }} />)}
            </colgroup>
            <thead>
            <tr>
                <th style={thS({ textAlign: "left", paddingLeft: 4 })}>Line</th>
                <th style={thS({ textAlign: "left", paddingLeft: 4 })}>Style No</th>
                <th style={thS()}>Sew.Start</th>
                <th style={thS()}>Day</th>
                <th style={thS()}>Worker</th>
                <th style={thS()}>Act.</th>
                <th style={thS()}>Hour</th>
                <th style={thS()}>Tar/H</th>
                <th style={thS()}>Tar/Day</th>
                <th style={thS()}>Tar/Now</th>
                <th style={thS({ background: "#1a3a8a" })}>DIF.</th>
                <th style={thS({ background: "#155724" })}>Finish%</th>
                <th style={thS()}>Finish</th>
                <th style={thS()}>Y.Finish</th>
                <th style={thS()}>Def.%</th>
                {HOUR_LABELS.map((l) => <th key={l} style={thS()}>{l}</th>)}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, i) => renderRow(row, i, false))}
            {renderRow(total, 0, true)}
            </tbody>
        </table>
    );
}

// ─── CtrlButton ───────────────────────────────────────────────────────────────
function CtrlButton({ icon, label, onClick, active }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                backgroundColor: active ? "#1565c0" : hov ? "#1e3a5f" : "#0f2030",
                border: `2px solid ${active ? "#4a90d9" : hov ? "#3a6090" : "#1e3a5f"}`,
                borderRadius: 12, padding: "14px 20px", cursor: "pointer",
                color: active ? "#fff" : hov ? "#7eb8f7" : "#aac8e8",
                fontSize: 12, fontWeight: "bold", fontFamily: "Arial, sans-serif",
                letterSpacing: "0.5px", transition: "all 0.15s",
                transform: hov ? "scale(1.05)" : "scale(1)", minWidth: 76,
            }}
        >
            <span style={{ fontSize: 26, lineHeight: 1 }}>{icon}</span>
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

    const {
        messages,
        loading,
        connectionState,
        isConnected
    } = useWebsocketServer(`/topic/messages/tv-data-update`);

    const { data: tvGeneralData, isLoading, isSuccess, refetch } = useGetTvGeneralDataQuery(undefined,{
        pollingInterval: 300000,
    });

    // ─── WebSocket refetch ────────────────────────────────────────────────────
    useEffect(() => {
        if (messages.isUpdate === true) {
            refetch();
        }
    }, [messages]);

    // ─── Derive computed rows and total from API data ─────────────────────────
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

    if (isLoading) return <CircularProgress />;

    if (!isSuccess || computedRows.length === 0) return null;

    return (
        <div
            ref={containerRef}
            style={{ background: "#f0f4f8", minHeight: "100vh", fontFamily: "Arial, sans-serif", boxSizing: "border-box" }}
        >
            {/* ── Zoom wrapper ── */}
            <div style={{
                padding: 12,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: zoom !== 1 ? `${(1 / zoom) * 100}%` : "100%",
                transition: "transform 0.2s ease",
            }}>
                <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.12)", overflow: "hidden" }}>

                    {/* Header */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 14px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
                            <Logo />
                        </div>

                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, cursor: "pointer", color: theme.palette.primary.main }}
                            onClick={(e) => { e.stopPropagation(); setShowControls(true); }}
                            title="Click for display controls"
                        >
                            Product Real Status
                        </Typography>

                        <div style={{ textAlign: "right", minWidth: 180 }}>
                            <div style={{ fontSize: 20, fontWeight: "bold" }}>{dateStr}</div>
                            <div style={{ color: "#ff4444", fontSize: 26, fontWeight: "bold", letterSpacing: 3, fontVariantNumeric: "tabular-nums" }}>
                                {timeStr}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: "auto" }}>
                        <DataTable rows={computedRows} total={total} />
                    </div>

                </div>
            </div>

            {/* ── CONTROLS POPUP ── */}
            {showControls && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: "rgba(0,0,10,0.6)",
                    backdropFilter: "blur(4px)",
                }}>
                    <div ref={popupRef} style={{
                        backgroundColor: "#0d1b2a",
                        borderRadius: 20,
                        padding: "32px 40px",
                        boxShadow: "0 12px 60px rgba(0,0,0,0.8), 0 0 0 1px #1e3a5f",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 22,
                        minWidth: 300,
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#7eb8f7", fontSize: 22, fontWeight: 900, letterSpacing: 3, fontFamily: "'Arial Black', sans-serif" }}>
                                Product Real Status
                            </div>
                            <div style={{ color: "#445566", fontSize: 12, letterSpacing: 2, marginTop: 2 }}>
                                DISPLAY CONTROLS
                            </div>
                        </div>

                        <CtrlButton
                            icon={isFullscreen ? "⊡" : "⛶"}
                            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            onClick={handleFullscreen}
                            active={isFullscreen}
                        />

                        <div style={{ width: "100%", height: 1, backgroundColor: "#1e3a5f" }} />
                        <div style={{ color: "#556677", fontSize: 11, fontWeight: "bold", letterSpacing: 2 }}>ZOOM LEVEL</div>

                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <CtrlButton icon="−" label="Zoom Out" onClick={handleZoomOut} />
                            <div style={{
                                color: "#7eb8f7", fontSize: 22, fontWeight: 900,
                                fontFamily: "'Arial Black', sans-serif",
                                minWidth: 68, textAlign: "center",
                                backgroundColor: "#0a1520",
                                border: "2px solid #1e3a5f",
                                borderRadius: 8, padding: "6px 4px",
                            }}>
                                {Math.round(zoom * 100)}%
                            </div>
                            <CtrlButton icon="+" label="Zoom In" onClick={handleZoomIn} />
                        </div>

                        <CtrlButton icon="↺" label="Reset" onClick={handleZoomReset} />

                        <div style={{ width: "100%", height: 1, backgroundColor: "#1e3a5f" }} />

                        <button
                            onClick={() => setShowControls(false)}
                            style={{
                                backgroundColor: "#7b1111",
                                border: "2px solid #c62828",
                                borderRadius: 10, color: "#fff",
                                padding: "10px 32px", fontSize: 14,
                                fontWeight: "bold", cursor: "pointer",
                                fontFamily: "'Arial Black', sans-serif",
                                letterSpacing: 1, transition: "background 0.15s",
                            }}
                        >
                            ✕ CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}