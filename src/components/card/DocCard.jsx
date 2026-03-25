import { useState } from "react";
import {actionBtnStyle} from "../../redux/feature/util/style.js";
import {getFileExtension, getFileName} from "../../redux/feature/util/helper.js";

// ── Extension config ──────────────────────────────────────────────────────────

const EXT_CONFIG = {
    // Spreadsheets
    XLSM: { color: "#166534", bg: "#dcfce7", accent: "#22c55e", label: "Excel", icon: "/images/excel.png"  },
    XLSX: { color: "#166534", bg: "#dcfce7", accent: "#22c55e", label: "Excel", icon: "/images/excel.png"  },
    XLS:  { color: "#166534", bg: "#dcfce7", accent: "#22c55e", label: "Excel", icon: "/images/excel.png"  },
    CSV:  { color: "#0369a1", bg: "#e0f2fe", accent: "#0ea5e9", label: "CSV",   icon: "/images/csv.png"    },
    // Documents
    PDF:  { color: "#b91c1c", bg: "#fee2e2", accent: "#ef4444", label: "PDF",   icon: "/images/pdf.png"    },
    DOCX: { color: "#1d4ed8", bg: "#dbeafe", accent: "#3b82f6", label: "Word",  icon: "/images/word.png"   },
    DOC:  { color: "#1d4ed8", bg: "#dbeafe", accent: "#3b82f6", label: "Word",  icon: "/images/word.png"   },
    PPTX: { color: "#c2410c", bg: "#ffedd5", accent: "#f97316", label: "PPT",   icon: "/images/ppt.png"    },
    PPT:  { color: "#c2410c", bg: "#ffedd5", accent: "#f97316", label: "PPT",   icon: "/images/ppt.png"    },
    // Archives
    ZIP:  { color: "#92400e", bg: "#fef3c7", accent: "#f59e0b", label: "ZIP",   icon: "/images/zip.png"    },
    RAR:  { color: "#92400e", bg: "#fef3c7", accent: "#f59e0b", label: "RAR",   icon: "/images/zip.png"    },
    // Text
    TXT:  { color: "#374151", bg: "#f3f4f6", accent: "#6b7280", label: "TXT",   icon: "/images/txt.png"    },
    JSON: { color: "#7c3aed", bg: "#ede9fe", accent: "#8b5cf6", label: "JSON",  icon: "/images/json.png"   },
};

const FALLBACK_CONFIG = {
    color: "#374151", bg: "#f3f4f6", accent: "#9ca3af", label: "FILE", icon: "/images/file.png",
};

function extConfig(ext) {
    return EXT_CONFIG[ext] ?? { ...FALLBACK_CONFIG, label: ext };
}

// ── Component ─────────────────────────────────────────────────────────────────

function DocCard({ url, onDelete, fileSize }) {
    const [hovered, setHovered] = useState(false);
    const ext = getFileExtension(url);
    const name = getFileName(url);
    const cfg = extConfig(ext);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                background: hovered ? "#fff" : "#fcfcfc",
                border: `1.5px solid ${hovered ? cfg.accent : "#e5e7eb"}`,
                borderRadius: 14,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "default",
                transition: "all 0.18s ease",
                boxShadow: hovered
                    ? `0 6px 24px 0 ${cfg.accent}22`
                    : "0 1px 4px rgba(0,0,0,0.05)",
            }}
        >
            {/* icon badge */}
            <div style={{
                width: 46, height: 52, borderRadius: 10,
                background: cfg.bg,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                border: `1px solid ${cfg.accent}33`,
                gap: 4,
            }}>
                <img
                    src={cfg.icon}
                    alt={cfg.label}
                    style={{ width: 26, height: 26, objectFit: "contain" }}
                />
                <span style={{
                    fontSize: 8, fontWeight: 800, color: cfg.color,
                    letterSpacing: 0.3, fontFamily: "monospace",
                    textTransform: "uppercase",
                }}>
                    {cfg.label}
                </span>
            </div>

            {/* info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: 13, fontWeight: 600, color: "#111827",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                    title={name}
                >
                    {name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    {fileSize && (
                        <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>
                            {fileSize}
                        </span>
                    )}
                    <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: cfg.color, background: cfg.bg,
                        borderRadius: 5, padding: "1px 6px",
                        fontFamily: "monospace",
                    }}>
                        {ext}
                    </span>
                </div>
            </div>

            {/* actions */}
            <div style={{
                display: "flex", gap: 6,
                opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
            }}>
                <a
                    href={url}
                    download
                    title="Download"
                    style={{ ...actionBtnStyle("#16a34a", "#f0fdf4"), border: "1px solid #bbf7d0" }}
                >
                    ↓
                </a>
                {onDelete && (
                    <button
                        onClick={() => onDelete(url)}
                        title="Delete"
                        style={{ ...actionBtnStyle("#e11d48", "#fff1f2"), border: "1px solid #fecdd3" }}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export default DocCard;