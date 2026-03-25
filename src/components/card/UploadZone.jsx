import {useCallback, useRef, useState} from "react";

function UploadZone({ onUpload, isLoading }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
        else setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const dt = e.dataTransfer;
        if (dt.files && dt.files.length > 0) {
            onUpload({ target: { files: dt.files } });
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "52px 24px",
                borderRadius: 18,
                border: `2px dashed ${isDragging ? "#6366f1" : "#d1d5db"}`,
                background: isDragging
                    ? "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)"
                    : "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                gap: 12,
                boxShadow: isDragging ? "0 0 0 4px #6366f122" : "none",
            }}
        >
            <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: isDragging ? "#6366f1" : "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, transition: "all 0.2s",
                boxShadow: isDragging ? "0 4px 20px #6366f144" : "none",
            }}>
                {isLoading ? "⏳" : isDragging ? "📂" : "☁️"}
            </div>
            <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: isDragging ? "#4338ca" : "#374151", margin: 0 }}>
                    {isLoading ? "Uploading files…" : isDragging ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "5px 0 0" }}>
                    {isLoading ? "Please wait…" : "or click to browse · Images, Excel, Word, PDF, ZIP…"}
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

export default UploadZone;