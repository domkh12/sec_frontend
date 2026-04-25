import {useState} from "react";
import {getFileExtension, getFileName} from "../../redux/feature/util/helper.js";
import {actionBtnStyle} from "../../redux/feature/util/style.js";



function ImageCard({ url, onDelete, fileSize }) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);
    const name = getFileName(url);
    const ext = getFileExtension(url);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                border: `2px solid ${hovered ? "#6366f1" : "#e5e7eb"}`,
                boxShadow: hovered ? "0 8px 30px rgba(99,102,241,0.18)" : "0 1px 4px rgba(0,0,0,0.06)",
                transition: "all 0.2s ease",
                background: "#f8f8f8",
                aspectRatio: "4/3",
                cursor: "default",
            }}
        >
            {/* image preview */}
            {!imgError ? (
                <img
                    src={url}
                    alt={name}
                    onError={() => setImgError(true)}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transform: hovered ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.3s ease",
                    }}
                />
            ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
                    <ImageIcon color="#94a3b8" />
                </div>
            )}

            {/* overlay on hover */}
            <div style={{
                position: "absolute", inset: 0,
                background: hovered ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" : "transparent",
                transition: "background 0.2s ease",
            }} />

            {/* ext badge top-left */}
            <div style={{
                position: "absolute", top: 8, left: 8,
                background: "rgba(0,0,0,0.55)",
                borderRadius: 6, padding: "2px 7px",
                fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "monospace",
                letterSpacing: 0.5,
            }}>
                {ext}
            </div>

            {/* actions top-right */}
            <div style={{
                position: "absolute", top: 8, right: 8,
                display: "flex", gap: 5,
                opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
            }}>
                <a href={url} download title="Download"
                   style={actionBtnStyle("#16a34a", "#dcfce7")}>↓</a>
                {onDelete && (
                    <button onClick={() => onDelete(url)} title="Delete"
                            style={actionBtnStyle("#e11d48", "#ffe4e6")}>✕</button>
                )}
            </div>

            {/* name + size on hover */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "8px 10px",
                opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
            }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                {fileSize && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{fileSize}</div>}
            </div>
        </div>
    );
}

export default ImageCard;