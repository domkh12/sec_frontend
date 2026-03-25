// ── helpers ────────────────────────────────────────────────────────────────────
export const IMAGE_EXTS = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG", "BMP", "AVIF"];

export function getFileExtension(url) {
    return url.split(".").pop().split("?")[0].toUpperCase();
}

export function getFileName(url) {
    const raw = decodeURIComponent(url.split("/").pop().split("?")[0]);
    if (raw.length > 36) return raw.slice(0, 18) + "…" + raw.slice(-10);
    return raw;
}

export function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

