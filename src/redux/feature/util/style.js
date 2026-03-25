export function actionBtnStyle(color, bg) {
    return {
        width: 28, height: 28, borderRadius: 7,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: bg, color, border: "none",
        cursor: "pointer", fontSize: 13, fontWeight: 700,
        textDecoration: "none", backdropFilter: "blur(4px)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
    };
}