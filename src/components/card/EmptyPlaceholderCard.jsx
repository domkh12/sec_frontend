import {useCallback, useRef, useState} from "react";

function EmptyPlaceholderCard({ onUpload, isLoading }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) {
            onUpload({ target: { files: e.dataTransfer.files } });
        }
    }, [onUpload]);

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isLoading && inputRef.current?.click()}
            style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                minHeight: 260,
                borderRadius: 16,
                border: `2px dashed ${isDragging ? "#6366f1" : "#e2e8f0"}`,
                background: isDragging
                    ? "linear-gradient(135deg, #eef2ff, #e0e7ff)"
                    : "linear-gradient(135deg, #fafafa, #f4f6f8)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                boxShadow: isDragging ? "0 0 0 4px #6366f120" : "none",
            }}
        >
            {/* animated cloud icon */}
            <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: isDragging ? "#6366f1" : "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32,
                transition: "all 0.2s",
                boxShadow: isDragging ? "0 8px 24px #6366f140" : "0 2px 8px rgba(0,0,0,0.06)",
            }}>
                {isLoading ? "⏳" : isDragging ? "📂" : "☁️"}
            </div>

            <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDragging ? "#4338ca" : "#374151" }}>
                    {isLoading ? "Uploading…" : isDragging ? "Drop to upload" : "No files yet"}
                </p>
                <p style={{ margin: "5px 0 0", fontSize: 13, color: "#94a3b8" }}>
                    {isLoading ? "Please wait…" : "Drag & drop files here, or click to browse"}
                </p>
            </div>

            {!isLoading && (
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 20px", borderRadius: 10,
                    background: "#111827", color: "#fff",
                    fontWeight: 600, fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                }}>
                    ⬆ Choose Files
                </div>
            )}

            <input ref={inputRef} type="file" multiple disabled={isLoading}
                   onChange={onUpload} style={{ display: "none" }} />
        </div>
    );
}

export default EmptyPlaceholderCard;