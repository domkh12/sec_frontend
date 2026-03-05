import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════════
const DATA = {
  users: [
    { id: 1, name: "Sophea Keo", role: "Admin", dept: "IT", status: "Active", lastLogin: "2026-03-05 08:12" },
    { id: 2, name: "Dara Pich", role: "Supervisor", dept: "Production", status: "Active", lastLogin: "2026-03-05 07:45" },
    { id: 3, name: "Malis Heng", role: "Operator", dept: "Sewing", status: "Active", lastLogin: "2026-03-04 17:30" },
    { id: 4, name: "Ratha Sok", role: "QC Inspector", dept: "Quality", status: "Inactive", lastLogin: "2026-03-01 09:00" },
    { id: 5, name: "Bopha Ly", role: "Operator", dept: "Cutting", status: "Active", lastLogin: "2026-03-05 08:00" },
  ],
  roles: [
    { id: 1, name: "Admin", users: 3, permissions: 42, desc: "Full system access" },
    { id: 2, name: "Supervisor", users: 12, permissions: 28, desc: "Production oversight" },
    { id: 3, name: "Operator", users: 85, permissions: 8, desc: "Line data entry" },
    { id: 4, name: "QC Inspector", users: 10, permissions: 15, desc: "Quality control access" },
    { id: 5, name: "Viewer", users: 5, permissions: 4, desc: "Read-only access" },
  ],
  departments: [
    { id: 1, name: "Cutting", head: "Virak Noun", lines: 4, workers: 48, status: "Active" },
    { id: 2, name: "Sewing", head: "Chanta Mao", lines: 12, workers: 240, status: "Active" },
    { id: 3, name: "Finishing", head: "Panha Rin", lines: 6, workers: 96, status: "Active" },
    { id: 4, name: "Quality", head: "Sreymom Chan", lines: 2, workers: 32, status: "Active" },
    { id: 5, name: "Packing", head: "Kosal Vong", lines: 4, workers: 60, status: "Active" },
  ],
  productionLines: [
    { id: 1, name: "Line A1", dept: "Sewing", workers: 22, target: 600, actual: 574, eff: 96 },
    { id: 2, name: "Line A2", dept: "Sewing", workers: 20, target: 580, actual: 490, eff: 84 },
    { id: 3, name: "Line B1", dept: "Sewing", workers: 24, target: 620, actual: 612, eff: 99 },
    { id: 4, name: "Line B2", dept: "Sewing", workers: 18, target: 520, actual: 388, eff: 75 },
    { id: 5, name: "Cut-1", dept: "Cutting", workers: 12, target: 1200, actual: 1180, eff: 98 },
    { id: 6, name: "Cut-2", dept: "Cutting", workers: 10, target: 1000, actual: 870, eff: 87 },
  ],
  products: [
    { id: 1, code: "P001", name: "Men's Polo Shirt", category: "Tops", color: "Navy", size: "M", uom: "PCS" },
    { id: 2, code: "P002", name: "Women's T-Shirt", category: "Tops", color: "White", size: "S", uom: "PCS" },
    { id: 3, code: "P003", name: "Cargo Shorts", category: "Bottoms", color: "Khaki", size: "L", uom: "PCS" },
    { id: 4, code: "P004", name: "Sports Jersey", category: "Sportswear", color: "Red", size: "XL", uom: "PCS" },
    { id: 5, code: "P005", name: "Hooded Jacket", category: "Outerwear", color: "Black", size: "M", uom: "PCS" },
  ],
  shifts: [
    { id: 1, name: "Morning Shift", start: "06:00", end: "14:00", workers: 210, supervisor: "Dara Pich" },
    { id: 2, name: "Afternoon Shift", start: "14:00", end: "22:00", workers: 185, supervisor: "Kosal Vong" },
    { id: 3, name: "Night Shift", start: "22:00", end: "06:00", workers: 80, supervisor: "Panha Rin" },
  ],
  workOrders: [
    { id: "WO-2026-001", product: "Men's Polo Shirt", qty: 5000, due: "2026-03-15", line: "Line A1", status: "In Progress", done: 2840 },
    { id: "WO-2026-002", product: "Women's T-Shirt", qty: 3000, due: "2026-03-12", line: "Line B1", status: "In Progress", done: 2100 },
    { id: "WO-2026-003", product: "Cargo Shorts", qty: 2000, due: "2026-03-20", line: "Line A2", status: "Pending", done: 0 },
    { id: "WO-2026-004", product: "Sports Jersey", qty: 1500, due: "2026-03-10", line: "Line B2", status: "Delayed", done: 800 },
    { id: "WO-2026-005", product: "Hooded Jacket", qty: 4000, due: "2026-03-25", line: "Cut-1", status: "Pending", done: 0 },
  ],
  defects: [
    { id: 1, line: "Line A2", product: "Men's Polo Shirt", type: "Stitch Skip", qty: 12, severity: "Major", date: "2026-03-05", status: "Open" },
    { id: 2, line: "Line B2", product: "Sports Jersey", type: "Color Bleeding", qty: 5, severity: "Critical", date: "2026-03-05", status: "Open" },
    { id: 3, line: "Line A1", product: "Women's T-Shirt", type: "Size Variation", qty: 8, severity: "Minor", date: "2026-03-04", status: "Resolved" },
    { id: 4, line: "Cut-2", product: "Cargo Shorts", type: "Cutting Error", qty: 20, severity: "Major", date: "2026-03-04", status: "Rework" },
  ],
  auditLog: [
    { id: 1, user: "Sophea Keo", action: "Created Work Order WO-2026-005", time: "2026-03-05 09:14", module: "Production" },
    { id: 2, user: "Dara Pich", action: "Updated Line B2 target to 520", time: "2026-03-05 08:55", module: "Setup" },
    { id: 3, user: "Malis Heng", action: "Logged output: Line A1 = 574 pcs", time: "2026-03-05 08:30", module: "Production" },
    { id: 4, user: "Ratha Sok", action: "Filed defect report #2", time: "2026-03-05 08:10", module: "Quality" },
    { id: 5, user: "Sophea Keo", action: "Added user: Bopha Ly", time: "2026-03-04 17:00", module: "Admin" },
  ],
  materials: [
    { id: 1, code: "M001", name: "Cotton Fabric 200gsm", unit: "Meters", stock: 12400, reorder: 2000, supplier: "Tex Co." },
    { id: 2, code: "M002", name: "Polyester Thread #60", unit: "Spools", stock: 840, reorder: 200, supplier: "Thread World" },
    { id: 3, code: "M003", name: "YKK Zipper 20cm", unit: "Pcs", stock: 5500, reorder: 1000, supplier: "YKK Cambodia" },
    { id: 4, code: "M004", name: "Elastic Band 2cm", unit: "Meters", stock: 3200, reorder: 500, supplier: "Elastic Plus" },
  ],
  tvDisplays: [
    { id: 1, name: "Floor A Display", location: "Sewing Floor A", line: "Line A1, A2", status: "Online", ip: "192.168.1.101" },
    { id: 2, name: "Floor B Display", location: "Sewing Floor B", line: "Line B1, B2", status: "Online", ip: "192.168.1.102" },
    { id: 3, name: "Cutting Display", location: "Cutting Hall", line: "Cut-1, Cut-2", status: "Offline", ip: "192.168.1.103" },
  ],
};

const STATS = {
  activeLines: 12, todayOutput: 4820, efficiency: 91, openDefects: 7,
  totalWorkers: 476, pendingOrders: 3,
};

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const ACCENT = {
  amber: { text: "#fbbf24", border: "rgba(251,191,36,0.3)", bg: "rgba(251,191,36,0.1)", bar: "from-amber-400/70 to-amber-300/30" },
  blue:  { text: "#60a5fa", border: "rgba(96,165,250,0.3)",  bg: "rgba(96,165,250,0.1)",  bar: "from-blue-400/70 to-blue-300/30" },
  green: { text: "#34d399", border: "rgba(52,211,153,0.3)",  bg: "rgba(52,211,153,0.1)",  bar: "from-emerald-400/70 to-emerald-300/30" },
  rose:  { text: "#fb7185", border: "rgba(251,113,133,0.3)", bg: "rgba(251,113,133,0.1)", bar: "from-rose-400/70 to-rose-300/30" },
};

// ═══════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════
function GlassCard({ children, color = "amber", className = "" }) {
  const a = ACCENT[color];
  return (
    <div className={`relative rounded-2xl overflow-hidden p-5 ${className}`}
      style={{
        background: "linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${a.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1),0 8px 32px rgba(0,0,0,0.4),0 0 40px ${a.bg}`,
      }}>
      <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${a.bar} rounded-b-full`} />
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

function Badge({ children, color = "amber" }) {
  const c = { amber:"bg-amber-400/20 text-amber-300 border-amber-400/30", blue:"bg-blue-400/20 text-blue-300 border-blue-400/30", green:"bg-emerald-400/20 text-emerald-300 border-emerald-400/30", rose:"bg-rose-400/20 text-rose-300 border-rose-400/30", gray:"bg-white/10 text-white/50 border-white/15" }[color] || "";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${c}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = {
    "Active":"green","Online":"green","In Progress":"blue","Resolved":"green",
    "Inactive":"gray","Offline":"gray","Pending":"amber","Delayed":"rose",
    "Open":"rose","Rework":"amber","Critical":"rose","Major":"amber","Minor":"blue",
  };
  return <Badge color={map[status]||"gray"}>{status}</Badge>;
}

function Table({ cols, rows, color = "blue" }) {
  const a = ACCENT[color];
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${a.border}` }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: `${a.bg}`, borderBottom: `1px solid ${a.border}` }}>
            {cols.map(c => <th key={c} className="text-left px-3 py-2.5 font-semibold tracking-wider uppercase text-white/50">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-3 py-2.5 text-white/75">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PageHeader({ title, subtitle, icon, onBack, color = "amber" }) {
  const a = ACCENT[color];
  return (
    <div className="flex items-center gap-4 mb-6">
      <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors border border-white/10 hover:border-white/20 bg-white/5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: a.bg, border: `1px solid ${a.border}` }}>{icon}</div>
      <div>
        <h2 className="text-base font-bold text-white/90">{title}</h2>
        <p className="text-[10px] text-white/35 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "amber" }) {
  const a = ACCENT[color];
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(12px)", border:`1px solid ${a.border}`, boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07)" }}>
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-lg font-bold leading-none" style={{ color: a.text }}>{value}</div>
        <div className="text-[10px] text-white/35 tracking-wide uppercase mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, color = "blue" }) {
  const c = { amber:"#fbbf24", blue:"#60a5fa", green:"#34d399", rose:"#fb7185" }[color];
  const col = value >= 90 ? "green" : value >= 75 ? "blue" : value >= 50 ? "amber" : "rose";
  const cc = { amber:"#fbbf24", blue:"#60a5fa", green:"#34d399", rose:"#fb7185" }[col];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all" style={{ width:`${value}%`, background: cc }} />
      </div>
      <span className="text-[10px] font-medium" style={{ color: cc }}>{value}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

function UsersPage({ onBack }) {
  return (
    <div>
      <PageHeader title="User Management" subtitle="Administration • Access Control" icon="👥" onBack={onBack} color="amber" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Total Users" value={DATA.users.length} icon="👤" color="amber" />
        <StatCard label="Active" value={DATA.users.filter(u=>u.status==="Active").length} icon="✅" color="green" />
        <StatCard label="Inactive" value={DATA.users.filter(u=>u.status==="Inactive").length} icon="🔒" color="rose" />
      </div>
      <GlassCard color="amber">
        <Table color="amber"
          cols={["#","Name","Role","Department","Status","Last Login"]}
          rows={DATA.users.map(u => [u.id, u.name, u.role, u.dept, <StatusBadge status={u.status}/>, u.lastLogin])}
        />
      </GlassCard>
    </div>
  );
}

function RolesPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Roles & Permissions" subtitle="Administration • Access Control" icon="🛡️" onBack={onBack} color="amber" />
      <GlassCard color="amber">
        <Table color="amber"
          cols={["#","Role","Description","Users","Permissions"]}
          rows={DATA.roles.map(r => [r.id, <span className="font-semibold text-amber-300">{r.name}</span>, r.desc, r.users, <Badge color="blue">{r.permissions} perms</Badge>])}
        />
      </GlassCard>
    </div>
  );
}

function DepartmentsPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Departments" subtitle="Data Setup • Factory Structure" icon="🏢" onBack={onBack} color="blue" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Departments" value={DATA.departments.length} icon="🏢" color="blue" />
        <StatCard label="Total Workers" value={STATS.totalWorkers} icon="👷" color="green" />
        <StatCard label="Active Lines" value={STATS.activeLines} icon="⚡" color="amber" />
        <StatCard label="Total Lines" value={DATA.productionLines.length} icon="🔧" color="rose" />
      </div>
      <GlassCard color="blue">
        <Table color="blue"
          cols={["#","Department","Head","Lines","Workers","Status"]}
          rows={DATA.departments.map(d => [d.id, <span className="font-semibold text-blue-300">{d.name}</span>, d.head, d.lines, d.workers, <StatusBadge status={d.status}/>])}
        />
      </GlassCard>
    </div>
  );
}

function ProductionLinesPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Production Lines" subtitle="Data Setup • Factory Structure" icon="🏗️" onBack={onBack} color="blue" />
      <GlassCard color="blue">
        <Table color="blue"
          cols={["Line","Dept","Workers","Target","Actual","Efficiency"]}
          rows={DATA.productionLines.map(l => [
            <span className="font-semibold text-blue-300">{l.name}</span>, l.dept, l.workers,
            l.target.toLocaleString(), l.actual.toLocaleString(),
            <ProgressBar value={l.eff}/>
          ])}
        />
      </GlassCard>
    </div>
  );
}

function ProductsPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Products" subtitle="Data Setup • Products" icon="👕" onBack={onBack} color="blue" />
      <GlassCard color="blue">
        <Table color="blue"
          cols={["Code","Product","Category","Color","Size","UOM"]}
          rows={DATA.products.map(p => [
            <span className="font-mono text-blue-300">{p.code}</span>, p.name,
            <Badge color="blue">{p.category}</Badge>, p.color, p.size, p.uom
          ])}
        />
      </GlassCard>
    </div>
  );
}

function MaterialsPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Materials" subtitle="Data Setup • Products" icon="🧵" onBack={onBack} color="blue" />
      <GlassCard color="blue">
        <Table color="blue"
          cols={["Code","Material","Unit","Stock","Reorder","Supplier","Status"]}
          rows={DATA.materials.map(m => [
            <span className="font-mono text-blue-300">{m.code}</span>, m.name, m.unit,
            m.stock.toLocaleString(), m.reorder.toLocaleString(), m.supplier,
            m.stock < m.reorder ? <Badge color="rose">Low Stock</Badge> : <Badge color="green">OK</Badge>
          ])}
        />
      </GlassCard>
    </div>
  );
}

function ShiftsPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Shift Management" subtitle="Data Setup • Factory Structure" icon="🕐" onBack={onBack} color="blue" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DATA.shifts.map((s, i) => (
          <GlassCard key={i} color="blue">
            <div className="text-2xl mb-2">🕐</div>
            <h3 className="font-bold text-white/90 text-sm mb-1">{s.name}</h3>
            <p className="text-xs text-white/40 mb-3">{s.start} – {s.end}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-white/40">Supervisor</span><span className="text-blue-300">{s.supervisor}</span></div>
              <div className="flex justify-between text-xs"><span className="text-white/40">Workers</span><span className="text-white/75">{s.workers}</span></div>
              <div className="flex justify-between text-xs"><span className="text-white/40">Duration</span><span className="text-white/75">8 hrs</span></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function WorkOrdersPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Work Orders" subtitle="Production • Planning" icon="📋" onBack={onBack} color="green" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="In Progress" value={DATA.workOrders.filter(w=>w.status==="In Progress").length} icon="⚙️" color="green" />
        <StatCard label="Pending" value={DATA.workOrders.filter(w=>w.status==="Pending").length} icon="⏳" color="amber" />
        <StatCard label="Delayed" value={DATA.workOrders.filter(w=>w.status==="Delayed").length} icon="⚠️" color="rose" />
      </div>
      <GlassCard color="green">
        <Table color="green"
          cols={["Order ID","Product","Qty","Done","Progress","Line","Due","Status"]}
          rows={DATA.workOrders.map(w => [
            <span className="font-mono text-green-300 text-[10px]">{w.id}</span>,
            w.product, w.qty.toLocaleString(), w.done.toLocaleString(),
            <ProgressBar value={w.qty > 0 ? Math.round(w.done/w.qty*100) : 0}/>,
            w.line, w.due, <StatusBadge status={w.status}/>
          ])}
        />
      </GlassCard>
    </div>
  );
}

function RealtimePage({ onBack }) {
  return (
    <div>
      <PageHeader title="Real-time Monitor" subtitle="Production • Monitoring" icon="📡" onBack={onBack} color="green" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Active Lines" value={STATS.activeLines} icon="⚡" color="green" />
        <StatCard label="Today Output" value={STATS.todayOutput.toLocaleString()} icon="👕" color="blue" />
        <StatCard label="Avg Efficiency" value={`${STATS.efficiency}%`} icon="📈" color="amber" />
        <StatCard label="Open Defects" value={STATS.openDefects} icon="⚠️" color="rose" />
      </div>
      <GlassCard color="green">
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Live Line Performance</p>
        <div className="space-y-3">
          {DATA.productionLines.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-16 text-xs text-white/60 shrink-0">{l.name}</span>
              <div className="flex-1"><ProgressBar value={l.eff}/></div>
              <span className="text-xs text-white/50 shrink-0 w-20 text-right">{l.actual}/{l.target} pcs</span>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.eff >= 90 ? "#34d399" : l.eff >= 75 ? "#60a5fa" : "#fb7185" }}/>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function DefectsPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Defect Reports" subtitle="Quality & Reports • Quality Control" icon="🔍" onBack={onBack} color="rose" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Open" value={DATA.defects.filter(d=>d.status==="Open").length} icon="🚨" color="rose" />
        <StatCard label="In Rework" value={DATA.defects.filter(d=>d.status==="Rework").length} icon="🔄" color="amber" />
        <StatCard label="Resolved" value={DATA.defects.filter(d=>d.status==="Resolved").length} icon="✅" color="green" />
      </div>
      <GlassCard color="rose">
        <Table color="rose"
          cols={["#","Line","Product","Defect Type","Qty","Severity","Date","Status"]}
          rows={DATA.defects.map(d => [
            d.id, d.line, d.product, d.type, d.qty,
            <StatusBadge status={d.severity}/>, d.date, <StatusBadge status={d.status}/>
          ])}
        />
      </GlassCard>
    </div>
  );
}

function DashboardPage({ onBack }) {
  const totalTarget = DATA.productionLines.reduce((s,l)=>s+l.target,0);
  const totalActual = DATA.productionLines.reduce((s,l)=>s+l.actual,0);
  return (
    <div>
      <PageHeader title="Analytics Dashboard" subtitle="Quality & Reports • Analytics" icon="📊" onBack={onBack} color="rose" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        <StatCard label="Today Output" value={STATS.todayOutput.toLocaleString()} icon="👕" color="green" />
        <StatCard label="Total Target" value={totalTarget.toLocaleString()} icon="🎯" color="blue" />
        <StatCard label="Overall Eff." value={`${Math.round(totalActual/totalTarget*100)}%`} icon="📈" color="amber" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard color="rose">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Line Efficiency Overview</p>
          {DATA.productionLines.map((l,i)=>(
            <div key={i} className="mb-2">
              <div className="flex justify-between text-[11px] text-white/50 mb-1"><span>{l.name}</span><span>{l.dept}</span></div>
              <ProgressBar value={l.eff}/>
            </div>
          ))}
        </GlassCard>
        <GlassCard color="rose">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Work Order Status</p>
          {["In Progress","Pending","Delayed"].map(s => {
            const count = DATA.workOrders.filter(w=>w.status===s).length;
            const pct = Math.round(count/DATA.workOrders.length*100);
            return (
              <div key={s} className="mb-3">
                <div className="flex justify-between text-[11px] text-white/50 mb-1"><span>{s}</span><span>{count} orders</span></div>
                <ProgressBar value={pct}/>
              </div>
            );
          })}
        </GlassCard>
      </div>
    </div>
  );
}

function AuditLogPage({ onBack }) {
  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Administration • System" icon="📜" onBack={onBack} color="amber" />
      <GlassCard color="amber">
        <div className="space-y-2">
          {DATA.auditLog.map((log, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 bg-amber-400/15 border border-amber-400/25">📝</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80">{log.action}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{log.user} • {log.time}</p>
              </div>
              <Badge color="amber">{log.module}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function TVDisplayPage({ onBack }) {
  return (
    <div>
      <PageHeader title="TV Displays" subtitle="Production • Monitoring" icon="📺" onBack={onBack} color="green" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DATA.tvDisplays.map((tv, i) => (
          <GlassCard key={i} color={tv.status === "Online" ? "green" : "rose"}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">📺</span>
              <StatusBadge status={tv.status}/>
            </div>
            <h3 className="font-bold text-white/90 text-sm mb-1">{tv.name}</h3>
            <p className="text-xs text-white/40 mb-3">{tv.location}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-white/40">Lines</span><span className="text-white/70">{tv.line}</span></div>
              <div className="flex justify-between text-xs"><span className="text-white/40">IP Address</span><span className="font-mono text-green-300 text-[11px]">{tv.ip}</span></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function SchedulePage({ onBack }) {
  const days = ["Mon 03", "Tue 04", "Wed 05", "Thu 06", "Fri 07"];
  return (
    <div>
      <PageHeader title="Production Schedule" subtitle="Production • Planning" icon="📅" onBack={onBack} color="green" />
      <GlassCard color="green">
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Week of Mar 3–7, 2026</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left px-2 py-2 text-white/40 font-semibold w-24">Line</th>
                {days.map(d => <th key={d} className="px-2 py-2 text-center text-white/40 font-semibold">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {DATA.productionLines.map((l, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-2 py-2 text-green-300 font-medium">{l.name}</td>
                  {days.map((d, j) => (
                    <td key={j} className="px-2 py-2 text-center">
                      <div className="mx-auto w-12 h-6 rounded flex items-center justify-center text-[9px]"
                        style={{ background: j===2 ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)", border: j===2 ? "1px solid rgba(52,211,153,0.35)" : "1px solid rgba(255,255,255,0.08)", color: j===2 ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                        {j === 2 ? "Today" : j < 2 ? "Done" : "Plan"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function SettingsPage({ onBack }) {
  const settings = [
    { group: "Factory", items: [{ label: "Factory Name", value: "SEC Mega Factory" }, { label: "Location", value: "Phnom Penh, Cambodia" }, { label: "Timezone", value: "Asia/Phnom_Penh (UTC+7)" }] },
    { group: "Production", items: [{ label: "Working Days", value: "Mon – Sat" }, { label: "Shifts Per Day", value: "3" }, { label: "OT Policy", value: "Max 2 hrs/day" }] },
    { group: "Notifications", items: [{ label: "Defect Alert Email", value: "qc@sec-factory.com" }, { label: "Low Stock Alert", value: "Enabled" }, { label: "Delay Warning", value: "Enabled" }] },
  ];
  return (
    <div>
      <PageHeader title="System Settings" subtitle="Administration • System" icon="⚙️" onBack={onBack} color="amber" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {settings.map((s, i) => (
          <GlassCard key={i} color="amber">
            <p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-widest mb-3">{s.group}</p>
            <div className="space-y-3">
              {s.items.map((item, j) => (
                <div key={j} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-white/35 uppercase tracking-wide">{item.label}</span>
                  <span className="text-xs text-white/75">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU BUTTON
// ═══════════════════════════════════════════════════════════════
function MenuButton({ title, iconPath, onClick, badge }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 150); onClick?.(); }}
      className={`relative flex flex-col items-center justify-center gap-2 w-20 h-20 rounded-2xl cursor-pointer select-none overflow-hidden border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:bg-white/18 hover:border-amber-400/40 hover:-translate-y-0.5 active:scale-95 ${pressed?"scale-95":"scale-100"}`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"/>
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 via-transparent to-transparent"/>
      {badge && <span className="absolute -top-1 -right-1 z-20 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[9px] font-bold text-gray-900 flex items-center justify-center shadow">{badge}</span>}
      <img src={iconPath} alt={title} className="relative w-8 h-8 object-contain drop-shadow-md flex-shrink-0"
        onError={e=>{e.target.src="https://api.iconify.design/mdi:dots-grid.svg?color=white";}}/>
      <span className="relative text-[10px] font-light tracking-wide text-white/85 text-center leading-tight px-1 drop-shadow">{title}</span>
    </button>
  );
}

function Section({ title, icon, color="amber", children }) {
  const a = ACCENT[color];
  return (
    <div className="relative rounded-3xl overflow-hidden p-5"
      style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)", backdropFilter:"blur(20px)", border:`1px solid ${a.border}`, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.12),0 8px 32px rgba(0,0,0,0.4),0 0 40px ${a.bg}` }}>
      <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${a.bar} rounded-b-full`}/>
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-3xl"/>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold tracking-widest uppercase" style={{color:a.text}}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Group({ label, color="amber", children }) {
  const c = {amber:"text-amber-300/60 border-amber-400/20",blue:"text-blue-300/60 border-blue-400/20",green:"text-emerald-300/60 border-emerald-400/20",rose:"text-rose-300/60 border-rose-400/20"}[color];
  return (
    <div className="mb-4 last:mb-0">
      <p className={`text-[9px] font-semibold tracking-[0.18em] uppercase mb-3 pb-1 border-b ${c}`}>{label}</p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function MenuTesting() {
  const [page, setPage] = useState(null);
  const nav = (p) => setPage(p);
  const back = () => setPage(null);

  const PAGES = {
    users: <UsersPage onBack={back}/>,
    roles: <RolesPage onBack={back}/>,
    departments: <DepartmentsPage onBack={back}/>,
    "production-lines": <ProductionLinesPage onBack={back}/>,
    products: <ProductsPage onBack={back}/>,
    materials: <MaterialsPage onBack={back}/>,
    shifts: <ShiftsPage onBack={back}/>,
    "work-orders": <WorkOrdersPage onBack={back}/>,
    realtime: <RealtimePage onBack={back}/>,
    defects: <DefectsPage onBack={back}/>,
    dashboard: <DashboardPage onBack={back}/>,
    "audit-log": <AuditLogPage onBack={back}/>,
    tv: <TVDisplayPage onBack={back}/>,
    schedule: <SchedulePage onBack={back}/>,
    settings: <SettingsPage onBack={back}/>,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .admin-root{font-family:'Sora',sans-serif;}
        @keyframes fadein{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .fadein{animation:fadein 0.5s cubic-bezier(.22,1,.36,1) both;}
      `}</style>

      <div className="admin-root min-h-screen p-6 lg:p-10"
        style={{ background:"radial-gradient(ellipse at 10% 10%,#1c2d1a 0%,transparent 50%),radial-gradient(ellipse at 90% 90%,#1a1f2e 0%,transparent 50%),radial-gradient(ellipse at 55% 45%,#1e1a10 0%,transparent 60%),#0c0e0b" }}>

        {/* Grid overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>
        <div className="fixed w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none -top-24 -left-24 animate-pulse" style={{background:"#854d0e"}}/>
        <div className="fixed w-72 h-72 rounded-full opacity-10 blur-[80px] pointer-events-none bottom-0 right-0 animate-pulse" style={{background:"#1d4ed8",animationDelay:"2s"}}/>

        {/* Header */}
        <div className="relative z-10 mb-8 fadein flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.3)"}}>🏭</div>
          <div>
            <h1 className="text-xl font-bold text-white/90 tracking-tight">SEC Mega Factory</h1>
            <p className="text-[10px] text-white/30 tracking-widest uppercase font-light">Garment Management System</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.25)"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">Live</span>
          </div>
        </div>

        {/* PAGE or MENU */}
        <div className="relative z-10 fadein" key={page}>
          {page && PAGES[page] ? PAGES[page] : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <Section title="Administration" icon="🛡️" color="amber">
                  <Group label="Access Control" color="amber">
                    <MenuButton title="Users" iconPath="https://api.iconify.design/mdi:account-group.svg?color=white" onClick={()=>nav("users")}/>
                    <MenuButton title="Roles" iconPath="https://api.iconify.design/mdi:shield-account.svg?color=white" onClick={()=>nav("roles")}/>
                  </Group>
                  <Group label="System" color="amber">
                    <MenuButton title="Audit Log" iconPath="https://api.iconify.design/mdi:clipboard-text-clock.svg?color=white" onClick={()=>nav("audit-log")} badge="5"/>
                    <MenuButton title="Settings" iconPath="https://api.iconify.design/mdi:cog.svg?color=white" onClick={()=>nav("settings")}/>
                  </Group>
                </Section>

                <Section title="Data Setup" icon="⚙️" color="blue">
                  <Group label="Factory Structure" color="blue">
                    <MenuButton title="Departments" iconPath="https://api.iconify.design/mdi:domain.svg?color=white" onClick={()=>nav("departments")}/>
                    <MenuButton title="Prod. Lines" iconPath="https://api.iconify.design/mdi:source-branch.svg?color=white" onClick={()=>nav("production-lines")}/>
                    <MenuButton title="Shifts" iconPath="https://api.iconify.design/mdi:clock-time-four.svg?color=white" onClick={()=>nav("shifts")}/>
                  </Group>
                  <Group label="Products" color="blue">
                    <MenuButton title="Products" iconPath="https://api.iconify.design/mdi:tshirt-crew.svg?color=white" onClick={()=>nav("products")}/>
                    <MenuButton title="Materials" iconPath="https://api.iconify.design/mdi:layers.svg?color=white" onClick={()=>nav("materials")}/>
                  </Group>
                </Section>

                <Section title="Production" icon="🏗️" color="green">
                  <Group label="Planning" color="green">
                    <MenuButton title="Work Orders" iconPath="https://api.iconify.design/mdi:clipboard-list.svg?color=white" onClick={()=>nav("work-orders")} badge="3"/>
                    <MenuButton title="Schedule" iconPath="https://api.iconify.design/mdi:calendar-month.svg?color=white" onClick={()=>nav("schedule")}/>
                  </Group>
                  <Group label="Monitoring" color="green">
                    <MenuButton title="Real-time" iconPath="https://api.iconify.design/mdi:monitor-eye.svg?color=white" onClick={()=>nav("realtime")}/>
                    <MenuButton title="TV Display" iconPath="https://api.iconify.design/mdi:television-play.svg?color=white" onClick={()=>nav("tv")}/>
                  </Group>
                </Section>

                <Section title="Quality & Reports" icon="📊" color="rose">
                  <Group label="Quality Control" color="rose">
                    <MenuButton title="Defects" iconPath="https://api.iconify.design/mdi:alert-circle.svg?color=white" onClick={()=>nav("defects")} badge="2"/>
                  </Group>
                  <Group label="Analytics" color="rose">
                    <MenuButton title="Dashboard" iconPath="https://api.iconify.design/mdi:view-dashboard.svg?color=white" onClick={()=>nav("dashboard")}/>
                  </Group>
                </Section>
              </div>

              {/* Quick stats */}
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:"Active Lines",value:"12",icon:"⚡",color:"amber"},
                  {label:"Today Output",value:"4,820",icon:"👕",color:"green"},
                  {label:"Efficiency",value:"91%",icon:"📈",color:"blue"},
                  {label:"Open Defects",value:"7",icon:"⚠️",color:"rose"},
                ].map(s=><StatCard key={s.label} {...s}/>)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}