import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {useParams} from "react-router-dom";
import {useGetTvDataQuery} from "../../redux/feature/tv/tvApiSlice.js";
import {Backdrop} from "@mui/material";
import useWebsocketServer from "../../hook/useWebsocketServer.js";
import dayjs from "dayjs";

// ─── Hour keys ────────────────────────────────────────────────────────────────
const hourKeys = ["h8", "h9", "h10", "h11", "h13", "h14", "h15", "h16", "h17", "h18"];

function TVLineDisplay() {
    const [currentTime, setCurrentTime] = useState("");
    const [showControls, setShowControls] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const popupRef = useRef(null);
    const {name} = useParams();

    const {data: data, isLoading, isSuccess, refetch} = useGetTvDataQuery({name}, {
        pollingInterval: 300000,
    });

    const {
        messages,
        loading,
        connectionState,
        isConnected
    } = useWebsocketServer(`/topic/messages/tv-data-update`);

    // ─── Build hourly rows from dailyRecords (last 3 days) + defect row ───────
    const hourRowsRaw = useMemo(() => {
        const records = data?.dailyRecords ?? [];

        // Sort descending by date, take latest 3
        const sorted = [...records]
            .sort((a, b) => {
                const toDate = (d) => {
                    const [mm, dd] = d.split("-");
                    return new Date(2025, Number(mm) - 1, Number(dd));
                };
                return toDate(b.date) - toDate(a.date);
            })
            .slice(0, 3);

        const todayDate = sorted[0]?.date ?? null;

        const dataRows = sorted.map((record) => ({
            date:    record.date,
            dTarg:   record.dTarg ?? null,
            h8:      record.h8    ?? null,
            h9:      record.h9    ?? null,
            h10:     record.h10   ?? null,
            h11:     record.h11   ?? null,
            h13:     record.h13   ?? null,
            h14:     record.h14   ?? null,
            h15:     record.h15   ?? null,
            h16:     record.h16   ?? null,
            h17:     record.h17   ?? null,
            h18:     record.h18   ?? null,
            isToday: record.isToday ?? record.date === todayDate,
        }));

        const defects = data?.defects ?? {};
        const defectRow = {
            date: "Defect", dTarg: null,
            h8:  defects.h8  ?? null, h9:  defects.h9  ?? null,
            h10: defects.h10 ?? null, h11: defects.h11 ?? null,
            h13: defects.h13 ?? null, h14: defects.h14 ?? null,
            h15: defects.h15 ?? null, h16: defects.h16 ?? null,
            h17: defects.h17 ?? null, h18: defects.h18 ?? null,
            isDefect: true,
        };

        return [...dataRows, defectRow];
    }, [data]);

    // ─── Calculate Total per row ──────────────────────────────────────────────
    const hourRowsWithTotal = useMemo(() =>
            hourRowsRaw.map((row) => {
                const total = hourKeys.reduce((sum, k) => sum + (typeof row[k] === "number" ? row[k] : 0), 0);
                return { ...row, total };
            }),
        [hourRowsRaw]);

    // ─── Today row & qty ──────────────────────────────────────────────────────
    const todayRow = useMemo(
        () => hourRowsWithTotal.find((r) => r.isToday),
        [hourRowsWithTotal]
    );
    const todayQtyCalc = todayRow ? todayRow.total : 0;

    // ─── Calculate Rate% ──────────────────────────────────────────────────────
    const hourRows = useMemo(() =>
            hourRowsWithTotal.map((row) => {
                let rateValue = 0;
                if (row.isDefect) {
                    rateValue = todayQtyCalc > 0 ? Math.round((row.total / todayQtyCalc) * 100) : 0;
                } else {
                    rateValue = row.dTarg > 0 ? Math.round((row.total / row.dTarg) * 100) : 0;
                }
                return { ...row, rate: `${rateValue}%`, rateValue };
            }),
        [hourRowsWithTotal, todayQtyCalc]);

    // ─── Target summary values ────────────────────────────────────────────────
    const H_TARG = data?.hTarg ?? 0;
    const D_TARG = todayRow?.dTarg ?? 0;
    const W_HOUR = data?.wHour ?? 0;
    const INPUT  = data?.input ?? 0;

    const completedHours = todayRow
        ? hourKeys.filter((k) => typeof todayRow[k] === "number" && todayRow[k] > 0).length
        : 0;
    const nowTarCalc = completedHours * H_TARG;
    const difQtyCalc = todayQtyCalc - nowTarCalc;

    // ─── WebSocket refetch ────────────────────────────────────────────────────
    useEffect(() => {
        if (messages.isUpdate === true) {
            refetch();
        }
    }, [messages]);

    // ─── Clock ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // ─── Fullscreen listener ──────────────────────────────────────────────────
    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", onFsChange);
        return () => document.removeEventListener("fullscreenchange", onFsChange);
    }, []);

    // ─── Close popup on outside click ────────────────────────────────────────
    useEffect(() => {
        const handleClick = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowControls(false);
            }
        };
        if (showControls) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showControls]);

    // ─── Fullscreen toggle ────────────────────────────────────────────────────
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

    // ─── Table column definitions ─────────────────────────────────────────────
    const columnsTar = [
        { id: "wHour",    label: "W.Hour"   },
        { id: "dTarg",    label: "D.Targ"   },
        { id: "hTarg",    label: "H.Targ"   },
        { id: "input",    label: "Input"    },
        { id: "todayQty", label: "Today Qty"},
        { id: "nowTar",   label: "Now.Tar"  },
        { id: "difQty",   label: "Dif Qty"  },
    ];

    const tarData = {
        wHour:    { value: String(W_HOUR),       color: "#1565c0" },
        dTarg:    { value: String(D_TARG),        color: "#c62828" },
        hTarg:    { value: String(H_TARG),        color: "#c62828" },
        input:    { value: String(INPUT),         color: "#1565c0" },
        todayQty: { value: String(todayQtyCalc),  color: "#1565c0" },
        nowTar:   { value: String(nowTarCalc),    color: "#1565c0" },
        difQty:   { value: String(difQtyCalc),    color: difQtyCalc < 0 ? "#c62828" : "#1565c0" },
    };

    const columnsHour = [
        { id: "date",  label: "Date"  },
        { id: "h8",    label: "8:00"  },
        { id: "h9",    label: "9:00"  },
        { id: "h10",   label: "10:00" },
        { id: "h11",   label: "11:00" },
        { id: "h13",   label: "13:00" },
        { id: "h14",   label: "14:00" },
        { id: "h15",   label: "15:00" },
        { id: "h16",   label: "16:00" },
        { id: "h17",   label: "17:00" },
        { id: "h18",   label: "18:00" },
        { id: "total", label: "Total" },
        { id: "rate",  label: "Rate%" },
    ];

    const getRateColor = (rate) => {
        if (rate >= 90) return "#1565c0";
        if (rate >= 70) return "#2e7d32";
        if (rate >= 50) return "#f9a825";
        return "#c62828";
    };

    const CtrlButton = ({ icon, label, onClick, active }) => {
        const [hov, setHov] = useState(false);
        return (
            <button
                onClick={onClick}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: active ? "#1565c0" : hov ? "#1e3a5f" : "#0f2030",
                    border: `2px solid ${active ? "#4a90d9" : hov ? "#3a6090" : "#1e3a5f"}`,
                    borderRadius: "12px",
                    padding: "14px 20px",
                    cursor: "pointer",
                    color: active ? "#fff" : hov ? "#7eb8f7" : "#aac8e8",
                    fontSize: "12px",
                    fontWeight: "bold",
                    fontFamily: "'Arial', sans-serif",
                    letterSpacing: "0.5px",
                    transition: "all 0.15s",
                    transform: hov ? "scale(1.05)" : "scale(1)",
                    minWidth: "76px",
                }}
            >
                <span style={{ fontSize: "26px", lineHeight: 1 }}>{icon}</span>
                <span>{label}</span>
            </button>
        );
    };

    let content;

    if (isLoading) content = (<Backdrop open={isLoading}/>);

    if (isSuccess) content = (
        <div ref={containerRef} style={{ position: "relative", width: "100%", minHeight: "100vh", backgroundColor: "#0a0a14" }}>
            {/* Zoom wrapper */}
            <div style={{
                backgroundColor: "#b0c4de",
                minHeight: "100vh",
                padding: "8px",
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                color: "#000",
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: zoom !== 1 ? `${(1 / zoom) * 100}%` : "100%",
            }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", alignItems: "center", marginBottom: "4px" }}>
                    <div />
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", fontSize: "28px", fontWeight: "900" }}>
                        <span style={{ color: "#c62828" }}>{data.day}Day</span>
                        <span
                            onClick={(e) => { e.stopPropagation(); setShowControls(true); }}
                            style={{
                                cursor: "pointer",
                                color: "#000",
                                position: "relative",
                                userSelect: "none",
                                textDecoration: "underline",
                                textDecorationColor: "#1565c0",
                                textDecorationThickness: "3px",
                                textUnderlineOffset: "4px",
                            }}
                            title="Click for display controls"
                        >
                            LINE {data.line}
                        </span>
                        <span>Worker {data.worker}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "28px", fontWeight: "900" }}>{currentTime}</div>
                </div>

                {/* Info rows */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: "18px", fontWeight: "bold", marginBottom: "6px", gap: "2px" }}>
                    <div><span>Order No.: </span><span style={{ color: "#c62828" }}>{data.orderNo}</span></div>
                    <div><span>Total in line: </span><span style={{ color: "#c62828" }}>{data.totalInLine}</span></div>
                    <div><span>Balance In Line: </span><span style={{ color: "#c62828" }}>{data.balanceInLine}</span></div>
                    <div><span>Order Qty: </span><span style={{ color: "#c62828" }}>{data.orderQty}</span></div>
                    <div><span>Total Output: </span><span style={{ color: "#c62828" }}>{data.totalOutput}</span></div>
                    <div><span>QC Repair Back: </span><span style={{ color: "#c62828" }}>{data.qcRepairBack}</span></div>
                    <div><span>Sew D. ST {dayjs(data.startDate).format("DD/MM")} F. {dayjs(data.finishDate).format("DD/MM")}</span></div>
                    <div><span>Order Inline: </span><span style={{ color: "#c62828" }}>{data.orderInline}</span></div>
                    <div><span>Balance Day: </span><span style={{ fontWeight: "900" }}>{data.balanceDay}</span></div>
                </div>

                {/* Target Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "6px" }}>
                    <thead>
                    <tr>{columnsTar.map((col) => (
                        <th key={col.id} style={{ backgroundColor: "#000080", color: "#fff", border: "1px solid #666", textAlign: "center", padding: "4px 2px", fontSize: "20px", fontWeight: "bold" }}>
                            {col.label}
                        </th>
                    ))}</tr>
                    </thead>
                    <tbody>
                    <tr>
                        {columnsTar.map((col) => (
                            <td key={col.id} style={{ border: "1px solid #888", textAlign: "center", padding: "2px", backgroundColor: "#d0dff0" }}>
                                <span style={{ fontSize: "48px", fontWeight: "900", color: tarData[col.id]?.color || "#000" }}>
                                    {tarData[col.id]?.value || ""}
                                </span>
                            </td>
                        ))}
                    </tr>
                    </tbody>
                </table>

                {/* Hourly Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "6px" }}>
                    <thead>
                    <tr>
                        {columnsHour.map((col) => (
                            <th key={col.id} style={{
                                backgroundColor: ["date", "total", "rate"].includes(col.id) ? "#000080" : "#1565c0",
                                color: "#fff", border: "1px solid #666", textAlign: "center", padding: "4px 2px", fontSize: "20px", fontWeight: "bold"
                            }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {hourRows.map((row, i) => (
                        <tr key={i}>
                            {columnsHour.map((col) => {
                                const isRate = col.id === "rate";
                                const isDate = col.id === "date";
                                const rateValue = row.rateValue ?? 0;
                                // ── Force red for defect row, otherwise use normal color logic ──
                                const rateColor = row.isDefect ? "#c62828" : getRateColor(rateValue);
                                const textColor = rateValue > 80 ? "#fff" : "#000";
                                const cellValue = row[col.id] === null || row[col.id] === undefined ? "" : row[col.id];

                                return (
                                    <td
                                        key={col.id}
                                        style={{
                                            border: "1px solid #888",
                                            textAlign: "center",
                                            padding: "0",
                                            backgroundColor: isDate ? "#c8d8e8" : "#d0dff0",
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {isRate ? (
                                            <>
                                                <div style={{
                                                    position: "absolute",
                                                    top: 0, left: 0,
                                                    height: "100%",
                                                    width: `${Math.min(rateValue, 100)}%`,
                                                    backgroundColor: rateColor,
                                                    transition: "width 0.3s ease",
                                                }} />
                                                <div style={{
                                                    position: "relative",
                                                    fontSize: "28px",
                                                    fontWeight: "900",
                                                    color: textColor,
                                                    padding: "4px 0",
                                                }}>
                                                    {row.rate}
                                                </div>
                                            </>
                                        ) : (
                                            <span style={{
                                                fontSize: "24px",
                                                fontWeight: "900",
                                                color: isDate ? "#1565c0" : "#000",
                                            }}>
                                                {cellValue}
                                            </span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Controls Popup */}
            {showControls && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: "rgba(0,0,10,0.6)",
                    backdropFilter: "blur(4px)",
                }}>
                    <div ref={popupRef} style={{
                        backgroundColor: "#0d1b2a",
                        borderRadius: "20px",
                        padding: "32px 40px",
                        boxShadow: "0 12px 60px rgba(0,0,0,0.8), 0 0 0 1px #1e3a5f",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "22px",
                        minWidth: "300px",
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#7eb8f7", fontSize: "22px", fontWeight: "900", letterSpacing: "3px", fontFamily: "'Arial Black', sans-serif" }}>
                                LINE {data.line}
                            </div>
                            <div style={{ color: "#445566", fontSize: "12px", letterSpacing: "2px", marginTop: "2px" }}>DISPLAY CONTROLS</div>
                        </div>

                        <CtrlButton
                            icon={isFullscreen ? "⊡" : "⛶"}
                            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            onClick={handleFullscreen}
                            active={isFullscreen}
                        />

                        <div style={{ width: "100%", height: "1px", backgroundColor: "#1e3a5f" }} />
                        <div style={{ color: "#556677", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px" }}>ZOOM LEVEL</div>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <CtrlButton icon="−" label="Zoom Out" onClick={handleZoomOut} />
                            <div style={{
                                color: "#7eb8f7",
                                fontSize: "22px",
                                fontWeight: "900",
                                fontFamily: "'Arial Black', sans-serif",
                                minWidth: "68px",
                                textAlign: "center",
                                backgroundColor: "#0a1520",
                                border: "2px solid #1e3a5f",
                                borderRadius: "8px",
                                padding: "6px 4px",
                            }}>
                                {Math.round(zoom * 100)}%
                            </div>
                            <CtrlButton icon="+" label="Zoom In" onClick={handleZoomIn} />
                        </div>

                        <CtrlButton icon="↺" label="Reset" onClick={handleZoomReset} />

                        <div style={{ width: "100%", height: "1px", backgroundColor: "#1e3a5f" }} />

                        <button
                            onClick={() => setShowControls(false)}
                            style={{
                                backgroundColor: "#7b1111",
                                border: "2px solid #c62828",
                                borderRadius: "10px",
                                color: "#fff",
                                padding: "10px 32px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontFamily: "'Arial Black', sans-serif",
                                letterSpacing: "1px",
                                transition: "background 0.15s",
                            }}
                        >
                            ✕ CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return content;
}

export default TVLineDisplay;