
function ViewToggle({ view, onChange }) {
    return (
        <div style={{
            display: "flex", background: "#f3f4f6",
            borderRadius: 9, padding: 3, gap: 2,
        }}>
            {[
                { key: "grid", label: "⊞ Grid" },
                { key: "list", label: "☰ List" },
            ].map(({ key, label }) => (
                <button key={key} onClick={() => onChange(key)} style={{
                    padding: "5px 12px", borderRadius: 7, border: "none",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: view === key ? "#fff" : "transparent",
                    color: view === key ? "#111827" : "#9ca3af",
                    boxShadow: view === key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s",
                }}>
                    {label}
                </button>
            ))}
        </div>
    );
}

export default ViewToggle;