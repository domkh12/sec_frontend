import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// MOCK DATA - MES FOCUSED
// ═══════════════════════════════════════════════════════════════
const DATA = {
    workOrders: [
        { id:"WO-2026-001", product:"Men's Polo Shirt", style:"P001", buyer:"H&M", qty:5000, line:"Line A1", status:"In Progress" },
        { id:"WO-2026-002", product:"Women's T-Shirt", style:"P002", buyer:"Zara", qty:3000, line:"Line B1", status:"In Progress" },
        { id:"WO-2026-003", product:"Cargo Shorts", style:"P003", buyer:"Gap", qty:2000, line:"Line A2", status:"Pending" },
    ],

    operators: [
        { id:"OP-001", name:"Malis Heng", line:"Line A1", badge:"1234" },
        { id:"OP-002", name:"Bopha Ly", line:"Line A1", badge:"1235" },
        { id:"OP-003", name:"Sina Kem", line:"Line B1", badge:"1236" },
    ],

    defectTypes: [
        { id:1, code:"ST001", name:"Stitch Skip", severity:"Major" },
        { id:2, code:"ST002", name:"Open Seam", severity:"Critical" },
        { id:3, code:"ST003", name:"Size Variation", severity:"Major" },
        { id:4, code:"ST004", name:"Color Shade", severity:"Minor" },
        { id:5, code:"ST005", name:"Oil Stain", severity:"Minor" },
        { id:6, code:"ST006", name:"Cutting Error", severity:"Major" },
    ],

    operations: [
        { id:1, name:"Front Placket", smv:1.8, line:"Line A1" },
        { id:2, name:"Collar Attach", smv:2.2, line:"Line A1" },
        { id:3, name:"Side Seam", smv:0.9, line:"Line A1" },
        { id:4, name:"Sleeve Attach", smv:1.5, line:"Line A1" },
    ]
};

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const ACCENT = {
    amber:  { text:"#fbbf24", border:"rgba(251,191,36,0.3)",  bg:"rgba(251,191,36,0.1)",  bar:"from-amber-400/70 to-amber-300/30" },
    blue:   { text:"#60a5fa", border:"rgba(96,165,250,0.3)",  bg:"rgba(96,165,250,0.1)",  bar:"from-blue-400/70 to-blue-300/30" },
    green:  { text:"#34d399", border:"rgba(52,211,153,0.3)",  bg:"rgba(52,211,153,0.1)",  bar:"from-emerald-400/70 to-emerald-300/30" },
    rose:   { text:"#fb7185", border:"rgba(251,113,133,0.3)", bg:"rgba(251,113,133,0.1)", bar:"from-rose-400/70 to-rose-300/30" },
    violet: { text:"#a78bfa", border:"rgba(167,139,250,0.3)", bg:"rgba(167,139,250,0.1)", bar:"from-violet-400/70 to-violet-300/30" },
    cyan:   { text:"#22d3ee", border:"rgba(34,211,238,0.3)",  bg:"rgba(34,211,238,0.1)",  bar:"from-cyan-400/70 to-cyan-300/30" },
    orange: { text:"#fb923c", border:"rgba(251,146,60,0.3)",  bg:"rgba(251,146,60,0.1)",  bar:"from-orange-400/70 to-orange-300/30" },
    teal:   { text:"#2dd4bf", border:"rgba(45,212,191,0.3)",  bg:"rgba(45,212,191,0.1)",  bar:"from-teal-400/70 to-teal-300/30" },
};

// ═══════════════════════════════════════════════════════════════
// QR CODE SCANNER SIMULATION
// ═══════════════════════════════════════════════════════════════
function QRScanner({ onScan, onClose }) {
    const [simulatedCode, setSimulatedCode] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const handleSimulateScan = () => {
        if (!simulatedCode) return;
        onScan(simulatedCode);
        setSimulatedCode("");
    };

    // Simulate camera view
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(10px)" }}>
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden"
                 style={{ background:"linear-gradient(145deg,rgba(28,26,18,0.98),rgba(18,20,16,0.99))", border:"1px solid rgba(34,211,238,0.3)" }}>

                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-cyan-400/70 to-cyan-300/30 rounded-b-full"/>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white/90">Scan Bundle QR Code</h3>
                        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 text-xl">×</button>
                    </div>

                    {/* Camera preview simulation */}
                    <div className="relative aspect-square rounded-2xl mb-4 overflow-hidden"
                         style={{ background:"rgba(0,0,0,0.5)", border:"2px solid rgba(34,211,238,0.3)" }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-cyan-400/50 rounded-xl animate-pulse"/>
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="text-[10px] text-white/40 bg-black/50 px-3 py-1 rounded-full">Position QR code in frame</span>
                        </div>
                    </div>

                    {/* Manual entry for demo */}
                    <div className="space-y-3">
                        <p className="text-[10px] text-white/30 text-center">— or enter manually —</p>
                        <div className="flex gap-2">
                            <input type="text"
                                   className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-xs text-white/80 placeholder-white/20"
                                   placeholder="Enter bundle ID (e.g. BNDL-001)"
                                   value={simulatedCode}
                                   onChange={(e) => setSimulatedCode(e.target.value)}/>
                            <button onClick={handleSimulateScan}
                                    className="px-4 py-3 rounded-xl text-xs font-semibold"
                                    style={{ background:"linear-gradient(135deg,rgba(34,211,238,0.25),rgba(34,211,238,0.1))", border:"1px solid rgba(34,211,238,0.4)", color:"#22d3ee" }}>
                                Scan
                            </button>
                        </div>
                    </div>

                    {/* Quick demo bundles */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Demo Bundles</p>
                        <div className="flex gap-2 flex-wrap">
                            {["BNDL-001", "BNDL-002", "BNDL-003"].map(id => (
                                <button key={id}
                                        onClick={() => onScan(id)}
                                        className="px-3 py-1.5 rounded-lg text-[10px] border border-white/20 text-white/60 hover:bg-white/10">
                                    {id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SWIPE TO CONFIRM COMPONENT
// ═══════════════════════════════════════════════════════════════
function SwipeToConfirm({ onConfirm, disabled = false, color = "green" }) {
    const [swipePosition, setSwipePosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const containerRef = useRef(null);
    const a = ACCENT[color];

    const handleDragStart = (e) => {
        if (disabled || hasConfirmed) return;
        setIsDragging(true);
    };

    const handleDragMove = (e) => {
        if (!isDragging || disabled || hasConfirmed) return;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const maxSwipe = rect.width - 60; // button width

        let newPos = clientX - rect.left - 30;
        newPos = Math.max(0, Math.min(newPos, maxSwipe));
        setSwipePosition(newPos);
    };

    const handleDragEnd = () => {
        if (!isDragging || disabled || hasConfirmed) return;

        const container = containerRef.current;
        if (!container) return;

        const maxSwipe = container.offsetWidth - 60;

        if (swipePosition > maxSwipe * 0.7) { // 70% threshold
            setHasConfirmed(true);
            onConfirm();
        } else {
            setSwipePosition(0);
        }
        setIsDragging(false);
    };

    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (isDragging) {
                e.preventDefault();
                handleDragMove(e);
            }
        };

        const handleGlobalEnd = () => {
            if (isDragging) {
                handleDragEnd();
            }
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('touchmove', handleGlobalMove, { passive: false });
        window.addEventListener('mouseup', handleGlobalEnd);
        window.addEventListener('touchend', handleGlobalEnd);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalEnd);
            window.removeEventListener('touchend', handleGlobalEnd);
        };
    }, [isDragging, swipePosition, disabled, hasConfirmed]);

    return (
        <div className="relative w-full h-14 rounded-xl overflow-hidden select-none"
             ref={containerRef}
             style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${a.border}` }}>

            {/* Background text */}
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium tracking-wider"
                 style={{ color: a.text + '80' }}>
                {hasConfirmed ? "Confirmed ✓" : "→ Swipe to confirm →"}
            </div>

            {/* Draggable button */}
            <div className="absolute top-1 bottom-1 left-1"
                 style={{ transform: `translateX(${swipePosition}px)`, transition: isDragging ? 'none' : 'transform 0.2s' }}>
                <div className={`w-[52px] h-[52px] rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                     style={{ background:a.bg, border:`1px solid ${a.border}` }}
                     onMouseDown={handleDragStart}
                     onTouchStart={handleDragStart}>
                    <span className="text-xl" style={{ color:a.text }}>→</span>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// BUNDLE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
function BundleCard({ bundle, onUpdateDefect, onComplete, isActive }) {
    const [expanded, setExpanded] = useState(false);
    const a = ACCENT[bundle.status === 'completed' ? 'green' : 'amber'];

    return (
        <div className={`relative rounded-2xl overflow-hidden transition-all ${isActive ? 'ring-2 ring-cyan-400' : ''}`}
             style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))", border:`1px solid ${a.border}` }}>

            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.bar}`}/>

            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                             style={{ background:a.bg, border:`1px solid ${a.border}` }}>
                            📦
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold" style={{ color:a.text }}>{bundle.id}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                    {bundle.size}/8 pcs
                  </span>
                            </div>
                            <p className="text-[11px] text-white/40 mt-0.5">{bundle.style} · {bundle.operation}</p>
                        </div>
                    </div>
                    <button onClick={() => setExpanded(!expanded)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:bg-white/10">
                        {expanded ? '−' : '+'}
                    </button>
                </div>

                {/* 8 pcs grid - always visible */}
                <div className="grid grid-cols-8 gap-1 mb-3">
                    {bundle.pieces.map((piece, idx) => (
                        <div key={idx}
                             className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-bold
                       ${piece.defect ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                                 piece.completed ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' :
                                     'bg-white/10 text-white/40 border border-white/20'}`}>
                            {piece.defect ? '✗' : piece.completed ? '✓' : (idx + 1)}
                        </div>
                    ))}
                </div>

                {/* Defect counters (expanded) */}
                {expanded && (
                    <div className="space-y-4 mt-3 pt-3 border-t border-white/10">
                        <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Defect Tracking</p>

                        {/* Defect type rows */}
                        {DATA.defectTypes.slice(0, 3).map(defect => {
                            const count = bundle.defects.filter(d => d.type === defect.name).length;
                            return (
                                <div key={defect.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${defect.severity === 'Critical' ? 'bg-rose-500' :
                              defect.severity === 'Major' ? 'bg-amber-500' : 'bg-blue-500'}`}/>
                                        <span className="text-[11px] text-white/70">{defect.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => onUpdateDefect(bundle.id, defect.name, -1)}
                                                className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10 text-white/50 hover:bg-white/20">
                                            −
                                        </button>
                                        <span className="text-xs font-semibold w-4 text-center" style={{ color: defect.severity === 'Critical' ? '#fb7185' : '#fbbf24' }}>
                            {count}
                          </span>
                                        <button onClick={() => onUpdateDefect(bundle.id, defect.name, 1)}
                                                className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10 text-white/50 hover:bg-white/20">
                                            +
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Total defects */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-[11px] text-white/50">Total Defects</span>
                            <span className="text-sm font-bold" style={{ color: bundle.defects.length > 0 ? '#fb7185' : '#34d399' }}>
                    {bundle.defects.length}
                  </span>
                        </div>
                    </div>
                )}

                {/* Swipe to complete */}
                {bundle.size === 8 && bundle.defects.length === 0 && bundle.status !== 'completed' && (
                    <div className="mt-4">
                        <SwipeToConfirm onConfirm={() => onComplete(bundle.id)} color="green"/>
                    </div>
                )}

                {/* Show if completed */}
                {bundle.status === 'completed' && (
                    <div className="mt-4 py-2 rounded-lg text-center text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Completed
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// BUNDLE GENERATOR
// ═══════════════════════════════════════════════════════════════
function generateBundleId() {
    const prefixes = ['BNDL', 'LOT', 'BATCH'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    return `${prefix}-${num}`;
}

function generateQRData(bundle) {
    // Simulate QR code data format
    return JSON.stringify({
        id: bundle.id,
        style: bundle.style,
        operation: bundle.operation,
        qty: 8,
        workOrder: bundle.workOrder,
        timestamp: new Date().toISOString()
    });
}

// ═══════════════════════════════════════════════════════════════
// QR CODE DISPLAY COMPONENT
// ═══════════════════════════════════════════════════════════════
function QRCodeDisplay({ data, onClose }) {
    // Simulated QR code (would use actual QR library in production)
    const qrSimulation = Array(15).fill(0).map(() =>
        Array(15).fill(0).map(() => Math.random() > 0.5 ? 1 : 0)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(10px)" }}>
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden"
                 style={{ background:"linear-gradient(145deg,rgba(28,26,18,0.98),rgba(18,20,16,0.99))", border:"1px solid rgba(34,211,238,0.3)" }}>

                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-cyan-400/70 to-cyan-300/30 rounded-b-full"/>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white/90">Bundle QR Code</h3>
                        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 text-xl">×</button>
                    </div>

                    {/* Simulated QR Code */}
                    <div className="aspect-square bg-white p-4 rounded-xl mb-4">
                        <div className="grid grid-cols-15 gap-0.5 w-full h-full">
                            {qrSimulation.map((row, i) =>
                                row.map((cell, j) => (
                                    <div key={`${i}-${j}`}
                                         className={`w-full h-full ${cell ? 'bg-black' : 'bg-transparent'}`}/>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bundle info */}
                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-white/5">
                        <div className="flex justify-between text-[11px]">
                            <span className="text-white/40">Bundle ID:</span>
                            <span className="text-cyan-300 font-mono">{data.id}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="text-white/40">Style:</span>
                            <span className="text-white/80">{data.style}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="text-white/40">Operation:</span>
                            <span className="text-white/80">{data.operation}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="text-white/40">Work Order:</span>
                            <span className="text-white/80">{data.workOrder}</span>
                        </div>
                    </div>

                    <button onClick={onClose}
                            className="w-full py-3 rounded-xl text-xs font-semibold"
                            style={{ background:"linear-gradient(135deg,rgba(34,211,238,0.25),rgba(34,211,238,0.1))", border:"1px solid rgba(34,211,238,0.4)", color:"#22d3ee" }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN MES INTERFACE
// ═══════════════════════════════════════════════════════════════
export default function MESInterface() {
    const [activeTab, setActiveTab] = useState("scan"); // scan | bundles | generate
    const [showScanner, setShowScanner] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [currentBundle, setCurrentBundle] = useState(null);
    const [bundles, setBundles] = useState([]);
    const [selectedLine, setSelectedLine] = useState("Line A1");
    const [selectedOperator, setSelectedOperator] = useState("OP-001");

    // Generate a new bundle
    const generateBundle = () => {
        const workOrder = DATA.workOrders.find(wo => wo.line === selectedLine) || DATA.workOrders[0];
        const operation = DATA.operations.find(op => op.line === selectedLine) || DATA.operations[0];

        const newBundle = {
            id: generateBundleId(),
            workOrder: workOrder.id,
            style: workOrder.style,
            product: workOrder.product,
            operation: operation.name,
            line: selectedLine,
            pieces: Array(8).fill().map(() => ({ completed: false, defect: false })),
            defects: [],
            status: 'active',
            timestamp: new Date().toISOString(),
            size: 0
        };

        setBundles(prev => [newBundle, ...prev]);
        setCurrentBundle(newBundle);
        setShowQRCode(true);
    };

    // Handle QR scan
    const handleScan = (code) => {
        setShowScanner(false);

        // Check if bundle exists
        let bundle = bundles.find(b => b.id === code);

        if (!bundle) {
            // Create new bundle from scan (simulate found in system)
            const workOrder = DATA.workOrders[0];
            const operation = DATA.operations[0];

            bundle = {
                id: code,
                workOrder: workOrder.id,
                style: workOrder.style,
                product: workOrder.product,
                operation: operation.name,
                line: selectedLine,
                pieces: Array(8).fill().map(() => ({ completed: false, defect: false })),
                defects: [],
                status: 'active',
                timestamp: new Date().toISOString(),
                size: 0
            };

            setBundles(prev => [bundle, ...prev]);
        }

        setCurrentBundle(bundle);
    };

    // Update defect count for a bundle
    const updateDefect = (bundleId, defectType, delta) => {
        setBundles(prev => prev.map(bundle => {
            if (bundle.id !== bundleId) return bundle;

            const newDefects = [...bundle.defects];
            const existingIndex = newDefects.findIndex(d => d.type === defectType);

            if (existingIndex >= 0) {
                const newCount = newDefects[existingIndex].count + delta;
                if (newCount <= 0) {
                    newDefects.splice(existingIndex, 1);
                } else {
                    newDefects[existingIndex] = { ...newDefects[existingIndex], count: newCount };
                }
            } else if (delta > 0) {
                newDefects.push({ type: defectType, count: 1 });
            }

            // Update pieces based on total defects
            const totalDefects = newDefects.reduce((sum, d) => sum + d.count, 0);
            const newPieces = bundle.pieces.map((piece, idx) => ({
                ...piece,
                defect: idx < totalDefects,
                completed: piece.completed && !(idx < totalDefects)
            }));

            return {
                ...bundle,
                defects: newDefects,
                pieces: newPieces,
                size: totalDefects > 0 ? 8 - totalDefects : bundle.pieces.filter(p => p.completed).length
            };
        }));
    };

    // Complete a bundle
    const completeBundle = (bundleId) => {
        setBundles(prev => prev.map(bundle => {
            if (bundle.id !== bundleId) return bundle;

            const completedPieces = bundle.pieces.map(p => ({
                ...p,
                completed: !p.defect // Mark all non-defect as completed
            }));

            return {
                ...bundle,
                pieces: completedPieces,
                status: 'completed',
                size: 8 - bundle.defects.reduce((sum, d) => sum + d.count, 0)
            };
        }));
    };

    // Active bundles (not completed)
    const activeBundles = bundles.filter(b => b.status !== 'completed');
    const completedBundles = bundles.filter(b => b.status === 'completed');

    return (
        <div className="min-h-screen" style={{ background:"radial-gradient(ellipse at 10% 10%,#1c2d1a 0%,transparent 50%),radial-gradient(ellipse at 90% 90%,#1a1f2e 0%,transparent 50%),#0c0e0b" }}>

            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

            {/* Scanner modal */}
            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)}/>}

            {/* QR Code display */}
            {showQRCode && currentBundle && (
                <QRCodeDisplay data={currentBundle} onClose={() => setShowQRCode(false)}/>
            )}

            {/* Header */}
            <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/[0.06]" style={{ background:"rgba(12,14,11,0.85)" }}>
                <div className="px-5 py-3 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background:"rgba(34,211,238,0.15)", border:"1px solid rgba(34,211,238,0.3)" }}>🏭</div>
                    <div className="flex-1">
                        <h1 className="text-sm font-bold text-white/90">MES · Bundle Tracking</h1>
                        <p className="text-[9px] text-white/30 tracking-widest uppercase">Line {selectedLine} · Operator {DATA.operators.find(o => o.id === selectedOperator)?.name}</p>
                    </div>

                    {/* Line selector */}
                    <select className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-[11px] text-white/70"
                            value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)}>
                        <option>Line A1</option>
                        <option>Line A2</option>
                        <option>Line B1</option>
                    </select>
                </div>

                {/* Tabs */}
                <div className="flex px-5 gap-1">
                    {[
                        { id: 'scan', label: '📷 Scan Bundle', icon: 'scan' },
                        { id: 'bundles', label: '📦 Active Bundles', icon: 'bundles' },
                        { id: 'generate', label: '✨ Generate QR', icon: 'generate' }
                    ].map(tab => (
                        <button key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-[11px] font-medium transition-all border-b-2 ${activeTab === tab.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 px-5 py-6 max-w-4xl mx-auto">

                {/* SCAN TAB */}
                {activeTab === 'scan' && (
                    <div className="space-y-4">
                        <div className="text-center py-8">
                            <button onClick={() => setShowScanner(true)}
                                    className="w-32 h-32 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl transition-all hover:scale-110"
                                    style={{ background:"rgba(34,211,238,0.15)", border:"2px solid rgba(34,211,238,0.3)" }}>
                                📷
                            </button>
                            <h2 className="text-base font-bold text-white/80 mb-1">Scan Bundle QR Code</h2>
                            <p className="text-[11px] text-white/30">Position the QR code in front of camera</p>
                        </div>

                        {/* Recent bundles */}
                        {bundles.length > 0 && (
                            <div className="mt-8">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Recent Bundles</p>
                                <div className="space-y-3">
                                    {bundles.slice(0, 3).map(bundle => (
                                        <button key={bundle.id}
                                                onClick={() => setCurrentBundle(bundle)}
                                                className="w-full p-3 rounded-xl flex items-center gap-3 bg-white/5 border border-white/10">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">📦</div>
                                            <div className="flex-1 text-left">
                                                <p className="text-xs font-mono text-cyan-300">{bundle.id}</p>
                                                <p className="text-[10px] text-white/40">{bundle.product} · {bundle.operation}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-1 rounded-full ${bundle.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                {bundle.status}
                              </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* BUNDLES TAB */}
                {activeTab === 'bundles' && (
                    <div className="space-y-6">
                        {/* Active bundles */}
                        <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span>Active Bundles</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px]">{activeBundles.length}</span>
                            </p>
                            <div className="space-y-3">
                                {activeBundles.length > 0 ? activeBundles.map(bundle => (
                                    <BundleCard key={bundle.id}
                                                bundle={bundle}
                                                onUpdateDefect={updateDefect}
                                                onComplete={completeBundle}
                                                isActive={currentBundle?.id === bundle.id}/>
                                )) : (
                                    <div className="text-center py-10 text-white/30 text-sm">No active bundles</div>
                                )}
                            </div>
                        </div>

                        {/* Completed bundles */}
                        {completedBundles.length > 0 && (
                            <div className="mt-6">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Completed</p>
                                <div className="space-y-2">
                                    {completedBundles.map(bundle => (
                                        <div key={bundle.id}
                                             className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 opacity-60">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">✓</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-mono text-white/60">{bundle.id}</p>
                                                <p className="text-[10px] text-white/30">{bundle.product}</p>
                                            </div>
                                            <span className="text-[10px] text-emerald-300">{8 - bundle.defects.length}/8 pcs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* GENERATE TAB */}
                {activeTab === 'generate' && (
                    <div className="space-y-6">
                        <div className="rounded-2xl p-6 text-center"
                             style={{ background:"rgba(34,211,238,0.05)", border:"1px solid rgba(34,211,238,0.2)" }}>
                            <div className="text-5xl mb-4">📦</div>
                            <h2 className="text-base font-bold text-white/80 mb-2">Generate New Bundle</h2>
                            <p className="text-[11px] text-white/40 mb-6">Create a new 8-piece bundle with QR code</p>

                            <div className="space-y-4 mb-6 text-left">
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-[11px] text-white/50">Line</span>
                                    <span className="text-xs text-cyan-300">{selectedLine}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-[11px] text-white/50">Work Order</span>
                                    <span className="text-xs text-white/80">{DATA.workOrders.find(wo => wo.line === selectedLine)?.id || 'WO-2026-001'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-[11px] text-white/50">Product</span>
                                    <span className="text-xs text-white/80">{DATA.workOrders.find(wo => wo.line === selectedLine)?.product || "Men's Polo Shirt"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-[11px] text-white/50">Operation</span>
                                    <span className="text-xs text-white/80">{DATA.operations.find(op => op.line === selectedLine)?.name || 'Assembly'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-[11px] text-white/50">Bundle Size</span>
                                    <span className="text-xs font-bold text-green-400">8 pieces</span>
                                </div>
                            </div>

                            <button onClick={generateBundle}
                                    className="w-full py-4 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                                    style={{ background:"linear-gradient(135deg,rgba(34,211,238,0.25),rgba(34,211,238,0.1))", border:"1px solid rgba(34,211,238,0.4)", color:"#22d3ee" }}>
                                ✨ Generate Bundle QR Code
                            </button>
                        </div>

                        {/* Recent generated */}
                        {bundles.filter(b => b.status === 'active').length > 0 && (
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Recently Generated</p>
                                <div className="space-y-2">
                                    {bundles.slice(0, 3).map(bundle => (
                                        <div key={bundle.id}
                                             className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">📱</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-mono text-cyan-300">{bundle.id}</p>
                                                <p className="text-[10px] text-white/40">{bundle.operation}</p>
                                            </div>
                                            <button onClick={() => { setCurrentBundle(bundle); setShowQRCode(true); }}
                                                    className="text-[10px] px-3 py-1.5 rounded-lg bg-white/10 text-white/70">
                                                Show QR
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Current bundle context */}
                {currentBundle && activeTab !== 'bundles' && (
                    <div className="fixed bottom-5 left-5 right-5 max-w-md mx-auto z-40">
                        <div className="rounded-xl p-3 backdrop-blur-xl"
                             style={{ background:"rgba(12,14,11,0.95)", border:"1px solid rgba(34,211,238,0.3)" }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">📦</div>
                                <div className="flex-1">
                                    <p className="text-xs font-mono text-cyan-300">{currentBundle.id}</p>
                                    <p className="text-[9px] text-white/40">{currentBundle.product}</p>
                                </div>
                                <button onClick={() => setActiveTab('bundles')}
                                        className="px-3 py-1.5 rounded-lg text-[10px] bg-white/10 text-white/70">
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}