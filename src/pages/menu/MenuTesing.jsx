import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════════
const DATA = {
  users: [
    { id:1, name:"Sophea Keo", role:"Admin", dept:"IT", status:"Active", lastLogin:"2026-03-05 08:12", email:"sophea@sec.com" },
    { id:2, name:"Dara Pich", role:"Supervisor", dept:"Production", status:"Active", lastLogin:"2026-03-05 07:45", email:"dara@sec.com" },
    { id:3, name:"Malis Heng", role:"Operator", dept:"Sewing", status:"Active", lastLogin:"2026-03-04 17:30", email:"malis@sec.com" },
    { id:4, name:"Ratha Sok", role:"QC Inspector", dept:"Quality", status:"Inactive", lastLogin:"2026-03-01 09:00", email:"ratha@sec.com" },
    { id:5, name:"Bopha Ly", role:"Operator", dept:"Cutting", status:"Active", lastLogin:"2026-03-05 08:00", email:"bopha@sec.com" },
    { id:6, name:"Virak Noun", role:"Supervisor", dept:"Cutting", status:"Active", lastLogin:"2026-03-05 07:30", email:"virak@sec.com" },
    { id:7, name:"Chanta Mao", role:"Supervisor", dept:"Sewing", status:"Active", lastLogin:"2026-03-05 07:55", email:"chanta@sec.com" },
  ],
  roles: [
    { id:1, name:"Admin", users:3, permissions:42, desc:"Full system access" },
    { id:2, name:"Supervisor", users:12, permissions:28, desc:"Production oversight" },
    { id:3, name:"Operator", users:85, permissions:8, desc:"Line data entry" },
    { id:4, name:"QC Inspector", users:10, permissions:15, desc:"Quality control access" },
    { id:5, name:"HR Manager", users:2, permissions:20, desc:"HR & payroll access" },
    { id:6, name:"Viewer", users:5, permissions:4, desc:"Read-only access" },
  ],
  departments: [
    { id:1, name:"Cutting", head:"Virak Noun", lines:4, workers:48, status:"Active", floor:"A" },
    { id:2, name:"Sewing", head:"Chanta Mao", lines:12, workers:240, status:"Active", floor:"B" },
    { id:3, name:"Finishing", head:"Panha Rin", lines:6, workers:96, status:"Active", floor:"C" },
    { id:4, name:"Quality", head:"Sreymom Chan", lines:2, workers:32, status:"Active", floor:"D" },
    { id:5, name:"Packing", head:"Kosal Vong", lines:4, workers:60, status:"Active", floor:"E" },
    { id:6, name:"Embroidery", head:"Sina Kem", lines:3, workers:36, status:"Active", floor:"A" },
    { id:7, name:"Washing", head:"Pov Lim", lines:2, workers:24, status:"Active", floor:"F" },
  ],
  productionLines: [
    { id:1, name:"Line A1", dept:"Sewing", workers:22, target:600, actual:574, eff:96, supervisor:"Dara Pich" },
    { id:2, name:"Line A2", dept:"Sewing", workers:20, target:580, actual:490, eff:84, supervisor:"Chanta Mao" },
    { id:3, name:"Line B1", dept:"Sewing", workers:24, target:620, actual:612, eff:99, supervisor:"Dara Pich" },
    { id:4, name:"Line B2", dept:"Sewing", workers:18, target:520, actual:388, eff:75, supervisor:"Virak Noun" },
    { id:5, name:"Cut-1", dept:"Cutting", workers:12, target:1200, actual:1180, eff:98, supervisor:"Virak Noun" },
    { id:6, name:"Cut-2", dept:"Cutting", workers:10, target:1000, actual:870, eff:87, supervisor:"Virak Noun" },
    { id:7, name:"Finish-1", dept:"Finishing", workers:16, target:800, actual:762, eff:95, supervisor:"Panha Rin" },
    { id:8, name:"Pack-1", dept:"Packing", workers:14, target:700, actual:648, eff:93, supervisor:"Kosal Vong" },
  ],
  products: [
    { id:1, code:"P001", name:"Men's Polo Shirt", category:"Tops", buyer:"H&M", smv:12.5, color:"Navy", status:"Active" },
    { id:2, code:"P002", name:"Women's T-Shirt", category:"Tops", buyer:"Zara", smv:8.0, color:"White", status:"Active" },
    { id:3, code:"P003", name:"Cargo Shorts", category:"Bottoms", buyer:"Gap", smv:18.0, color:"Khaki", status:"Active" },
    { id:4, code:"P004", name:"Sports Jersey", category:"Sportswear", buyer:"Nike", smv:14.5, color:"Red", status:"Active" },
    { id:5, code:"P005", name:"Hooded Jacket", category:"Outerwear", buyer:"Adidas", smv:32.0, color:"Black", status:"Active" },
    { id:6, code:"P006", name:"Denim Jeans", category:"Bottoms", buyer:"Levi's", smv:28.0, color:"Blue", status:"Draft" },
  ],
  shifts: [
    { id:1, name:"Morning Shift", start:"06:00", end:"14:00", workers:210, supervisor:"Dara Pich", days:"Mon-Sat" },
    { id:2, name:"Afternoon Shift", start:"14:00", end:"22:00", workers:185, supervisor:"Kosal Vong", days:"Mon-Sat" },
    { id:3, name:"Night Shift", start:"22:00", end:"06:00", workers:80, supervisor:"Panha Rin", days:"Mon-Fri" },
  ],
  workOrders: [
    { id:"WO-2026-001", product:"Men's Polo Shirt", buyer:"H&M", qty:5000, due:"2026-03-15", line:"Line A1", status:"In Progress", done:2840, priority:"High" },
    { id:"WO-2026-002", product:"Women's T-Shirt", buyer:"Zara", qty:3000, due:"2026-03-12", line:"Line B1", status:"In Progress", done:2100, priority:"High" },
    { id:"WO-2026-003", product:"Cargo Shorts", buyer:"Gap", qty:2000, due:"2026-03-20", line:"Line A2", status:"Pending", done:0, priority:"Medium" },
    { id:"WO-2026-004", product:"Sports Jersey", buyer:"Nike", qty:1500, due:"2026-03-10", line:"Line B2", status:"Delayed", done:800, priority:"Critical" },
    { id:"WO-2026-005", product:"Hooded Jacket", buyer:"Adidas", qty:4000, due:"2026-03-25", line:"Cut-1", status:"Pending", done:0, priority:"Medium" },
  ],
  defects: [
    { id:1, line:"Line A2", product:"Men's Polo Shirt", type:"Stitch Skip", qty:12, severity:"Major", date:"2026-03-05", status:"Open", inspector:"Ratha Sok" },
    { id:2, line:"Line B2", product:"Sports Jersey", type:"Color Bleeding", qty:5, severity:"Critical", date:"2026-03-05", status:"Open", inspector:"Ratha Sok" },
    { id:3, line:"Line A1", product:"Women's T-Shirt", type:"Size Variation", qty:8, severity:"Minor", date:"2026-03-04", status:"Resolved", inspector:"Sreymom Chan" },
    { id:4, line:"Cut-2", product:"Cargo Shorts", type:"Cutting Error", qty:20, severity:"Major", date:"2026-03-04", status:"Rework", inspector:"Ratha Sok" },
    { id:5, line:"Finish-1", product:"Hooded Jacket", type:"Loose Thread", qty:15, severity:"Minor", date:"2026-03-03", status:"Resolved", inspector:"Sreymom Chan" },
  ],
  auditLog: [
    { id:1, user:"Sophea Keo", action:"Created Work Order WO-2026-005", time:"2026-03-05 09:14", module:"Production" },
    { id:2, user:"Dara Pich", action:"Updated Line B2 target to 520", time:"2026-03-05 08:55", module:"Setup" },
    { id:3, user:"Malis Heng", action:"Logged output: Line A1 = 574 pcs", time:"2026-03-05 08:30", module:"Production" },
    { id:4, user:"Ratha Sok", action:"Filed defect report #2", time:"2026-03-05 08:10", module:"Quality" },
    { id:5, user:"Sophea Keo", action:"Added user: Bopha Ly", time:"2026-03-04 17:00", module:"Admin" },
    { id:6, user:"Chanta Mao", action:"Approved leave for 3 workers", time:"2026-03-04 14:20", module:"HR" },
  ],
  materials: [
    { id:1, code:"M001", name:"Cotton Fabric 200gsm", unit:"Meters", stock:12400, reorder:2000, supplier:"Tex Co.", cost:2.5 },
    { id:2, code:"M002", name:"Polyester Thread #60", unit:"Spools", stock:840, reorder:200, supplier:"Thread World", cost:1.2 },
    { id:3, code:"M003", name:"YKK Zipper 20cm", unit:"Pcs", stock:5500, reorder:1000, supplier:"YKK Cambodia", cost:0.8 },
    { id:4, code:"M004", name:"Elastic Band 2cm", unit:"Meters", stock:320, reorder:500, supplier:"Elastic Plus", cost:0.3 },
    { id:5, code:"M005", name:"Button 15mm", unit:"Pcs", stock:18000, reorder:5000, supplier:"Button House", cost:0.05 },
    { id:6, code:"M006", name:"Care Label", unit:"Pcs", stock:25000, reorder:8000, supplier:"Label Pro", cost:0.02 },
  ],
  tvDisplays: [
    { id:1, name:"Floor A Display", location:"Sewing Floor A", line:"Line A1, A2", status:"Online", ip:"192.168.1.101", lastPing:"2026-03-05 09:10" },
    { id:2, name:"Floor B Display", location:"Sewing Floor B", line:"Line B1, B2", status:"Online", ip:"192.168.1.102", lastPing:"2026-03-05 09:10" },
    { id:3, name:"Cutting Display", location:"Cutting Hall", line:"Cut-1, Cut-2", status:"Offline", ip:"192.168.1.103", lastPing:"2026-03-04 18:00" },
    { id:4, name:"Finishing Display", location:"Finishing Floor", line:"Finish-1", status:"Online", ip:"192.168.1.104", lastPing:"2026-03-05 09:09" },
  ],
  employees: [
    { id:"E001", name:"Sophea Keo", dept:"IT", position:"System Admin", hire:"2022-01-15", salary:1200, status:"Active", type:"Permanent" },
    { id:"E002", name:"Dara Pich", dept:"Production", position:"Supervisor", hire:"2021-03-01", salary:850, status:"Active", type:"Permanent" },
    { id:"E003", name:"Malis Heng", dept:"Sewing", position:"Machine Operator", hire:"2023-06-10", salary:280, status:"Active", type:"Permanent" },
    { id:"E004", name:"Ratha Sok", dept:"Quality", position:"QC Inspector", hire:"2022-09-20", salary:400, status:"Inactive", type:"Contract" },
    { id:"E005", name:"Bopha Ly", dept:"Cutting", position:"Cutter", hire:"2024-01-05", salary:260, status:"Active", type:"Permanent" },
    { id:"E006", name:"Kosal Vong", dept:"Packing", position:"Supervisor", hire:"2020-11-12", salary:780, status:"Active", type:"Permanent" },
    { id:"E007", name:"Sina Kem", dept:"Embroidery", position:"Lead Operator", hire:"2023-02-28", salary:320, status:"Active", type:"Permanent" },
  ],
  attendance: [
    { id:1, employee:"Malis Heng", dept:"Sewing", date:"2026-03-05", in:"06:02", out:"14:05", ot:0, status:"Present" },
    { id:2, employee:"Bopha Ly", dept:"Cutting", date:"2026-03-05", in:"06:10", out:"14:00", ot:0, status:"Present" },
    { id:3, employee:"Ratha Sok", dept:"Quality", date:"2026-03-05", in:"--", out:"--", ot:0, status:"Absent" },
    { id:4, employee:"Sina Kem", dept:"Embroidery", date:"2026-03-05", in:"06:00", out:"16:00", ot:2, status:"OT" },
    { id:5, employee:"Kosal Vong", dept:"Packing", date:"2026-03-05", in:"14:00", out:"22:10", ot:0, status:"Present" },
    { id:6, employee:"Dara Pich", dept:"Production", date:"2026-03-05", in:"05:55", out:"14:00", ot:0, status:"Present" },
  ],
  leaves: [
    { id:1, employee:"Ratha Sok", type:"Sick Leave", from:"2026-03-05", to:"2026-03-07", days:3, status:"Approved", approver:"Sophea Keo" },
    { id:2, employee:"Malis Heng", type:"Annual Leave", from:"2026-03-15", to:"2026-03-16", days:2, status:"Pending", approver:"--" },
    { id:3, employee:"Bopha Ly", type:"Emergency", from:"2026-03-04", to:"2026-03-04", days:1, status:"Approved", approver:"Dara Pich" },
    { id:4, employee:"Sina Kem", type:"Annual Leave", from:"2026-03-20", to:"2026-03-22", days:3, status:"Pending", approver:"--" },
  ],
  payroll: [
    { id:1, employee:"Dara Pich", dept:"Production", base:850, ot:120, bonus:50, deduction:30, net:990, month:"Feb 2026", status:"Paid" },
    { id:2, employee:"Malis Heng", dept:"Sewing", base:280, ot:45, bonus:10, deduction:8, net:327, month:"Feb 2026", status:"Paid" },
    { id:3, employee:"Bopha Ly", dept:"Cutting", base:260, ot:30, bonus:0, deduction:8, net:282, month:"Feb 2026", status:"Paid" },
    { id:4, employee:"Kosal Vong", dept:"Packing", base:780, ot:80, bonus:40, deduction:25, net:875, month:"Feb 2026", status:"Paid" },
    { id:5, employee:"Sina Kem", dept:"Embroidery", base:320, ot:96, bonus:20, deduction:10, net:426, month:"Feb 2026", status:"Processing" },
  ],
  buyers: [
    { id:1, name:"H&M", country:"Sweden", contact:"Anna Larsson", email:"anna@hm.com", activeOrders:2, totalPcs:12000, status:"Active" },
    { id:2, name:"Zara", country:"Spain", contact:"Carlos Ruiz", email:"carlos@zara.com", activeOrders:1, totalPcs:3000, status:"Active" },
    { id:3, name:"Gap", country:"USA", contact:"John Smith", email:"john@gap.com", activeOrders:1, totalPcs:2000, status:"Active" },
    { id:4, name:"Nike", country:"USA", contact:"Sarah Lee", email:"sarah@nike.com", activeOrders:1, totalPcs:1500, status:"Active" },
    { id:5, name:"Adidas", country:"Germany", contact:"Klaus Weber", email:"klaus@adidas.com", activeOrders:1, totalPcs:4000, status:"Active" },
  ],
  suppliers: [
    { id:1, name:"Tex Co.", country:"China", contact:"Wang Lei", material:"Fabrics", rating:4.8, status:"Active", leadDays:21 },
    { id:2, name:"Thread World", country:"Vietnam", contact:"Nguyen Hai", material:"Threads", rating:4.5, status:"Active", leadDays:14 },
    { id:3, name:"YKK Cambodia", country:"Cambodia", contact:"Sothy Khem", material:"Zippers", rating:5.0, status:"Active", leadDays:7 },
    { id:4, name:"Button House", country:"China", contact:"Li Ming", material:"Buttons", rating:4.2, status:"Active", leadDays:18 },
    { id:5, name:"Label Pro", country:"Cambodia", contact:"Vanna Ros", material:"Labels", rating:4.6, status:"Active", leadDays:5 },
  ],
  purchaseOrders: [
    { id:"PO-2026-001", supplier:"Tex Co.", material:"Cotton Fabric 200gsm", qty:"5000 M", amount:12500, date:"2026-02-20", delivery:"2026-03-12", status:"In Transit" },
    { id:"PO-2026-002", supplier:"Thread World", material:"Polyester Thread #60", qty:"200 Spools", amount:240, date:"2026-02-25", delivery:"2026-03-10", status:"Delivered" },
    { id:"PO-2026-003", supplier:"YKK Cambodia", material:"YKK Zipper 20cm", qty:"3000 Pcs", amount:2400, date:"2026-03-01", delivery:"2026-03-08", status:"Delivered" },
    { id:"PO-2026-004", supplier:"Button House", material:"Button 15mm", qty:"20000 Pcs", amount:1000, date:"2026-03-03", delivery:"2026-03-21", status:"Pending" },
    { id:"PO-2026-005", supplier:"Elastic Plus", material:"Elastic Band 2cm", qty:"1000 M", amount:300, date:"2026-03-04", delivery:"2026-03-18", status:"Confirmed" },
  ],
  shipments: [
    { id:"SH-2026-001", buyer:"H&M", wo:"WO-2026-001", qty:2000, method:"Sea Freight", vessel:"MSC CARGO", etd:"2026-03-18", eta:"2026-04-10", status:"Scheduled" },
    { id:"SH-2026-002", buyer:"Zara", wo:"WO-2026-002", qty:3000, method:"Air Freight", vessel:"BKK-BCN", etd:"2026-03-13", eta:"2026-03-15", status:"Confirmed" },
    { id:"SH-2026-003", buyer:"Nike", wo:"WO-2026-004", qty:800, method:"Sea Freight", vessel:"EVERGREEN", etd:"2026-03-20", eta:"2026-04-15", status:"Pending" },
  ],
  machines: [
    { id:"MC-001", name:"Juki DDL-8700", type:"Single Needle", dept:"Sewing", line:"Line A1", status:"Running", lastService:"2026-02-01", nextService:"2026-05-01" },
    { id:"MC-002", name:"Juki MO-6714", type:"Overlock", dept:"Sewing", line:"Line A1", status:"Running", lastService:"2026-01-15", nextService:"2026-04-15" },
    { id:"MC-003", name:"Brother KM-4300", type:"Button Sew", dept:"Sewing", line:"Line B1", status:"Maintenance", lastService:"2026-03-04", nextService:"2026-06-04" },
    { id:"MC-004", name:"Eastman Eagle", type:"Straight Knife", dept:"Cutting", line:"Cut-1", status:"Running", lastService:"2026-02-20", nextService:"2026-05-20" },
    { id:"MC-005", name:"Pfaff 3588", type:"Feed Off Arm", dept:"Sewing", line:"Line B2", status:"Idle", lastService:"2026-01-10", nextService:"2026-04-10" },
    { id:"MC-006", name:"Tajima TMEF", type:"Embroidery", dept:"Embroidery", line:"Emb-1", status:"Running", lastService:"2026-02-28", nextService:"2026-05-28" },
  ],
  costings: [
    { id:1, product:"Men's Polo Shirt", fabric:3.20, trim:0.45, labor:1.80, overhead:0.60, total:6.05, fob:8.50, margin:28.8 },
    { id:2, product:"Women's T-Shirt", fabric:1.80, trim:0.25, labor:1.10, overhead:0.40, total:3.55, fob:5.20, margin:31.7 },
    { id:3, product:"Cargo Shorts", fabric:4.10, trim:0.90, labor:2.60, overhead:0.80, total:8.40, fob:12.00, margin:30.0 },
    { id:4, product:"Sports Jersey", fabric:2.50, trim:0.60, labor:2.00, overhead:0.65, total:5.75, fob:8.00, margin:28.1 },
    { id:5, product:"Hooded Jacket", fabric:8.20, trim:1.80, labor:4.80, overhead:1.50, total:16.30, fob:24.00, margin:32.1 },
  ],
  standards: [
    { id:1, product:"Men's Polo Shirt", operation:"Front Placket", smv:1.8, machine:"Single Needle", skill:"Medium" },
    { id:2, product:"Men's Polo Shirt", operation:"Collar Attach", smv:2.2, machine:"Single Needle", skill:"High" },
    { id:3, product:"Women's T-Shirt", operation:"Side Seam", smv:0.9, machine:"Overlock", skill:"Low" },
    { id:4, product:"Cargo Shorts", operation:"Pocket Attach", smv:3.1, machine:"Single Needle", skill:"Medium" },
    { id:5, product:"Sports Jersey", operation:"Number Print", smv:2.5, machine:"Heat Press", skill:"Medium" },
  ],
  inspections: [
    { id:1, wo:"WO-2026-001", stage:"In-Process", inspector:"Ratha Sok", date:"2026-03-05", checked:200, passed:194, failed:6, result:"Pass" },
    { id:2, wo:"WO-2026-002", stage:"Final", inspector:"Sreymom Chan", date:"2026-03-04", checked:500, passed:492, failed:8, result:"Pass" },
    { id:3, wo:"WO-2026-004", stage:"In-Process", inspector:"Ratha Sok", date:"2026-03-04", checked:150, passed:128, failed:22, result:"Fail" },
    { id:4, wo:"WO-2026-001", stage:"Initial", inspector:"Sreymom Chan", date:"2026-03-02", checked:100, passed:100, failed:0, result:"Pass" },
  ],
};

const STATS = { activeLines:12, todayOutput:4820, efficiency:91, openDefects:7, totalWorkers:476, pendingOrders:3 };

// ═══════════════════════════════════════════════════════════════
// PERMISSION REQUESTS DATA (initial seed)
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// PERMISSION RECORDS DATA
// ═══════════════════════════════════════════════════════════════
const PERMISSION_TYPES = [
  "System Access","Module Access","Data Export","Report Access",
  "Override Authority","Special Operation","Admin Privilege","Temporary Elevation",
];

const INITIAL_PERMISSIONS = [
  { id:"PR-001", worker:"Malis Heng", dept:"Sewing", position:"Machine Operator", type:"Module Access", module:"Quality", fromDate:"2026-03-06", toDate:"2026-03-20", reason:"Requested to view defect reports for Line A1 improvement project", status:"Approved", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 08:00", note:"Read-only access approved for 2 weeks." },
  { id:"PR-002", worker:"Dara Pich", dept:"Production", position:"Supervisor", type:"Data Export", module:"Production", fromDate:"2026-03-05", toDate:"2026-03-05", reason:"Monthly KPI report export for management meeting", status:"Approved", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 07:30", note:"One-time export approved." },
  { id:"PR-003", worker:"Bopha Ly", dept:"Cutting", position:"Cutter", type:"Override Authority", module:"Work Orders", fromDate:"2026-03-07", toDate:"2026-03-10", reason:"Requested to update cutting targets while supervisor is on leave", status:"Pending", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 09:00", note:"" },
  { id:"PR-004", worker:"Ratha Sok", dept:"Quality", position:"QC Inspector", type:"System Access", module:"HR", fromDate:"2026-03-10", toDate:"2026-03-31", reason:"Assisting HR with attendance audit for QC department", status:"Rejected", enteredBy:"Sophea Keo", enteredAt:"2026-03-04 14:00", note:"Not permitted. Coordinate through HR Manager." },
  { id:"PR-005", worker:"Sina Kem", dept:"Embroidery", position:"Lead Operator", type:"Report Access", module:"Finance", fromDate:"2026-03-08", toDate:"2026-03-15", reason:"Needs costing data for new embroidery style pricing proposal", status:"Pending", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 10:00", note:"" },
];

// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════
const ACCENT = {
  amber:  { text:"#fbbf24", border:"rgba(251,191,36,0.3)",  bg:"rgba(251,191,36,0.1)",  bar:"from-amber-400/70 to-amber-300/30"   },
  blue:   { text:"#60a5fa", border:"rgba(96,165,250,0.3)",   bg:"rgba(96,165,250,0.1)",   bar:"from-blue-400/70 to-blue-300/30"    },
  green:  { text:"#34d399", border:"rgba(52,211,153,0.3)",   bg:"rgba(52,211,153,0.1)",   bar:"from-emerald-400/70 to-emerald-300/30" },
  rose:   { text:"#fb7185", border:"rgba(251,113,133,0.3)",  bg:"rgba(251,113,133,0.1)",  bar:"from-rose-400/70 to-rose-300/30"    },
  violet: { text:"#a78bfa", border:"rgba(167,139,250,0.3)",  bg:"rgba(167,139,250,0.1)",  bar:"from-violet-400/70 to-violet-300/30"  },
  cyan:   { text:"#22d3ee", border:"rgba(34,211,238,0.3)",   bg:"rgba(34,211,238,0.1)",   bar:"from-cyan-400/70 to-cyan-300/30"    },
  orange: { text:"#fb923c", border:"rgba(251,146,60,0.3)",   bg:"rgba(251,146,60,0.1)",   bar:"from-orange-400/70 to-orange-300/30"  },
  teal:   { text:"#2dd4bf", border:"rgba(45,212,191,0.3)",   bg:"rgba(45,212,191,0.1)",   bar:"from-teal-400/70 to-teal-300/30"    },
};

function GlassCard({ children, color="amber", className="" }) {
  const a = ACCENT[color];
  return (
      <div className={`relative rounded-2xl overflow-hidden p-5 ${className}`}
           style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:`1px solid ${a.border}`, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.1),0 8px 32px rgba(0,0,0,0.4),0 0 40px ${a.bg}` }}>
        <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${a.bar} rounded-b-full`}/>
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"/>
        {children}
      </div>
  );
}

function Badge({ children, color="amber" }) {
  const c = { amber:"bg-amber-400/20 text-amber-300 border-amber-400/30", blue:"bg-blue-400/20 text-blue-300 border-blue-400/30", green:"bg-emerald-400/20 text-emerald-300 border-emerald-400/30", rose:"bg-rose-400/20 text-rose-300 border-rose-400/30", violet:"bg-violet-400/20 text-violet-300 border-violet-400/30", cyan:"bg-cyan-400/20 text-cyan-300 border-cyan-400/30", orange:"bg-orange-400/20 text-orange-300 border-orange-400/30", gray:"bg-white/10 text-white/50 border-white/15" }[color]||"bg-white/10 text-white/50 border-white/15";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${c}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = { "Active":"green","Online":"green","In Progress":"blue","Resolved":"green","Paid":"green","Pass":"green","Running":"green","Delivered":"green","Confirmed":"green","Permanent":"blue","Present":"green","Approved":"green","In Transit":"blue","Scheduled":"blue","Processing":"amber","Inactive":"gray","Offline":"gray","Pending":"amber","OT":"cyan","Idle":"gray","Draft":"gray","Delayed":"rose","Open":"rose","Rework":"amber","Absent":"rose","Critical":"rose","Major":"amber","Minor":"blue","Fail":"rose","High":"rose","Medium":"amber","Low":"green","Contract":"violet","Rejected":"rose","Urgent":"rose","Normal":"blue" };
  return <Badge color={map[status]||"gray"}>{status}</Badge>;
}

function Table({ cols, rows, color="blue" }) {
  const a = ACCENT[color];
  return (
      <div className="overflow-x-auto rounded-xl" style={{ border:`1px solid ${a.border}` }}>
        <table className="w-full text-xs">
          <thead><tr style={{ background:a.bg, borderBottom:`1px solid ${a.border}` }}>{cols.map(c=><th key={c} className="text-left px-3 py-2.5 font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">{c}</th>)}</tr></thead>
          <tbody>{rows.map((row,i)=><tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">{row.map((cell,j)=><td key={j} className="px-3 py-2.5 text-white/75 whitespace-nowrap">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
  );
}

function PageHeader({ title, subtitle, icon, onBack, color="amber" }) {
  const a = ACCENT[color];
  return (
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors border border-white/10 hover:border-white/20 bg-white/5 shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Back
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background:a.bg, border:`1px solid ${a.border}` }}>{icon}</div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white/90 truncate">{title}</h2>
          <p className="text-[10px] text-white/35 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
  );
}

function StatCard({ label, value, icon, color="amber", sub }) {
  const a = ACCENT[color];
  return (
      <div className="rounded-xl px-4 py-3 flex items-center gap-3"
           style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(12px)", border:`1px solid ${a.border}`, boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07)" }}>
        <span className="text-xl">{icon}</span>
        <div>
          <div className="text-lg font-bold leading-none" style={{ color:a.text }}>{value}</div>
          <div className="text-[10px] text-white/35 tracking-wide uppercase mt-0.5">{label}</div>
          {sub && <div className="text-[9px] text-white/25 mt-0.5">{sub}</div>}
        </div>
      </div>
  );
}

function ProgressBar({ value }) {
  const col = value>=90?"#34d399":value>=75?"#60a5fa":value>=50?"#fbbf24":"#fb7185";
  return (
      <div className="flex items-center gap-2 min-w-[80px]">
        <div className="flex-1 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width:`${Math.min(value,100)}%`, background:col }}/></div>
        <span className="text-[10px] font-medium w-8 text-right" style={{ color:col }}>{value}%</span>
      </div>
  );
}

function Stars({ rating }) {
  return <span className="text-amber-400 text-xs">{"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))} <span className="text-white/40">{rating}</span></span>;
}

// ═══════════════════════════════════════════════════════════════
// INPUT COMPONENTS
// ═══════════════════════════════════════════════════════════════
function FormField({ label, required, children }) {
  return (
      <div>
        <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
          {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        {children}
      </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all";
const selectCls = "w-full bg-[#1a1c18] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-amber-400/50 transition-all appearance-none";

// ═══════════════════════════════════════════════════════════════
// HR ENTRY MODAL — HR records the worker's permission request
// ═══════════════════════════════════════════════════════════════
function HREntryModal({ onClose, onSave }) {
  const BLANK = { worker:"", dept:"", position:"", type:"", module:"", fromDate:"", toDate:"", reason:"", status:"Pending", note:"" };
  const [form, setForm] = useState(BLANK);
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const modules = ["Production","Quality","HR","Finance","Procurement","Maintenance","Administration","Reports","All Modules"];
  const valid = form.worker && form.dept && form.type && form.module && form.fromDate && form.toDate && form.reason;

  const handleSave = () => {
    if (!valid) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => onClose(), 1800);
  };

  const daysDiff = (a,b) => { const d=new Date(b)-new Date(a); return isNaN(d)?0:Math.max(0,Math.round(d/86400000)+1); };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.78)",backdropFilter:"blur(10px)"}}>
        <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl"
             style={{background:"linear-gradient(145deg,rgba(28,26,18,0.98),rgba(18,20,16,0.99))",border:"1px solid rgba(251,191,36,0.22)",boxShadow:"0 40px 100px rgba(0,0,0,0.8),0 0 80px rgba(251,191,36,0.06)"}}>
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-amber-400/60 to-amber-300/20 rounded-b-full"/>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.3)"}}>🔐</div>
              <div>
                <h3 className="text-sm font-bold text-white/90">Record Permission Request</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">HR Entry • On Behalf of Worker</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all text-xl leading-none">×</button>
          </div>

          {saved ? (
              <div className="flex flex-col items-center py-14 px-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{background:"rgba(52,211,153,0.15)",border:"1px solid rgba(52,211,153,0.3)"}}>✅</div>
                <p className="text-sm font-semibold text-emerald-400 mb-1">Record Saved</p>
                <p className="text-xs text-white/35 text-center">Permission request has been recorded successfully.</p>
              </div>
          ) : (
              <div className="px-6 pb-6 space-y-4">

                {/* ── SECTION: Worker Info ── */}
                <div className="rounded-xl px-4 py-3" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p className="text-[9px] text-amber-400/50 font-semibold uppercase tracking-widest mb-3">Worker Information</p>
                  <div className="grid grid-cols-1 gap-3">
                    <FormField label="Worker Name" required>
                      <div className="relative">
                        <select className={selectCls} value={form.worker}
                                onChange={e => {
                                  const emp = DATA.employees.find(em=>em.name===e.target.value);
                                  setForm(f=>({...f, worker:e.target.value, dept:emp?.dept||"", position:emp?.position||""}));
                                }}>
                          <option value="">Select worker…</option>
                          {DATA.employees.map(e=><option key={e.id} value={e.name}>{e.name} — {e.position} ({e.dept})</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span>
                      </div>
                    </FormField>
                    {form.worker && (
                        <div className="flex items-center gap-3 rounded-xl p-3" style={{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.15)"}}>
                          <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center text-sm shrink-0">👷</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white/80 truncate">{form.worker}</p>
                            <p className="text-[10px] text-white/35">{form.position} · {form.dept}</p>
                          </div>
                          <Badge color="amber">Selected</Badge>
                        </div>
                    )}
                  </div>
                </div>

                {/* ── SECTION: Permission Details ── */}
                <div className="rounded-xl px-4 py-3" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p className="text-[9px] text-blue-400/50 font-semibold uppercase tracking-widest mb-3">Permission Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Permission Type" required>
                      <div className="relative">
                        <select className={selectCls} value={form.type} onChange={e=>set("type",e.target.value)}>
                          <option value="">Select type…</option>
                          {PERMISSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span>
                      </div>
                    </FormField>
                    <FormField label="Module / Area" required>
                      <div className="relative">
                        <select className={selectCls} value={form.module} onChange={e=>set("module",e.target.value)}>
                          <option value="">Select module…</option>
                          {modules.map(m=><option key={m} value={m}>{m}</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span>
                      </div>
                    </FormField>
                  </div>
                </div>

                {/* ── SECTION: Date Range ── */}
                <div className="rounded-xl px-4 py-3" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p className="text-[9px] text-green-400/50 font-semibold uppercase tracking-widest mb-3">Access Period</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="From Date" required>
                      <input type="date" className={inputCls} value={form.fromDate} onChange={e=>set("fromDate",e.target.value)} style={{colorScheme:"dark"}}/>
                    </FormField>
                    <FormField label="Until Date" required>
                      <input type="date" className={inputCls} value={form.toDate} onChange={e=>set("toDate",e.target.value)} style={{colorScheme:"dark"}}/>
                    </FormField>
                  </div>
                  {form.fromDate && form.toDate && daysDiff(form.fromDate,form.toDate) > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-white/30">Duration:</span>
                        <span className="text-[10px] font-semibold text-green-400">{daysDiff(form.fromDate,form.toDate)} day(s)</span>
                      </div>
                  )}
                </div>

                {/* ── SECTION: Reason & Note ── */}
                <div className="rounded-xl px-4 py-3" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p className="text-[9px] text-violet-400/50 font-semibold uppercase tracking-widest mb-3">Reason & Notes</p>
                  <div className="space-y-3">
                    <FormField label="Reason Given by Worker" required>
                  <textarea className={`${inputCls} resize-none`} rows={3}
                            placeholder="What did the worker say they need this access for…"
                            value={form.reason} onChange={e=>set("reason",e.target.value)}/>
                    </FormField>
                    <FormField label="HR Note (optional)">
                      <input type="text" className={inputCls} placeholder="Internal note from HR…"
                             value={form.note} onChange={e=>set("note",e.target.value)}/>
                    </FormField>
                  </div>
                </div>

                {/* Status toggle */}
                <FormField label="Initial Status">
                  <div className="flex gap-2">
                    {["Pending","Approved","Rejected"].map(s=>(
                        <button key={s} onClick={()=>set("status",s)}
                                className={`flex-1 py-2 rounded-xl text-[11px] font-medium border transition-all ${form.status===s
                                    ? s==="Approved"?"bg-emerald-400/20 border-emerald-400/40 text-emerald-300"
                                        : s==="Rejected"?"bg-rose-400/20 border-rose-400/40 text-rose-300"
                                            : "bg-amber-400/20 border-amber-400/40 text-amber-300"
                                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/8"}`}>
                          {s==="Approved"?"✓":s==="Rejected"?"✗":"⏳"} {s}
                        </button>
                    ))}
                  </div>
                </FormField>

                {!valid && <p className="text-[10px] text-white/20 text-center">Fill in all required fields (*) to save</p>}

                <div className="flex gap-3 pt-1">
                  <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                  <button onClick={handleSave} disabled={!valid}
                          className="flex-grow-[2] py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                          style={{background:"linear-gradient(135deg,rgba(251,191,36,0.28),rgba(251,191,36,0.12))",border:"1px solid rgba(251,191,36,0.4)",color:"#fbbf24"}}>
                    💾 Save Record
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS PAGE — HR manages all records
// ═══════════════════════════════════════════════════════════════
function PermissionsPage({ onBack }) {
  const [records, setRecords] = useState(INITIAL_PERMISSIONS);
  const [showEntry, setShowEntry] = useState(false);
  const [editing, setEditing] = useState(null); // id of inline-status-editing
  const [filter, setFilter] = useState("All");

  const handleSave = (form) => {
    const id = `PR-${String(records.length+1).padStart(3,"0")}`;
    setRecords(r=>[{ ...form, id, enteredBy:"Sophea Keo", enteredAt:new Date().toISOString().slice(0,16).replace("T"," ") }, ...r]);
  };

  const changeStatus = (id, status) => {
    setRecords(r=>r.map(x=>x.id===id?{...x,status}:x));
    setEditing(null);
  };

  const deleteRecord = (id) => setRecords(r=>r.filter(x=>x.id!==id));

  const filters = ["All","Pending","Approved","Rejected"];
  const filtered = filter==="All" ? records : records.filter(r=>r.status===filter);

  const daysDiff = (a,b)=>{ const d=new Date(b)-new Date(a); return isNaN(d)?0:Math.max(0,Math.round(d/86400000)+1); };

  const statusColor = { Approved:"green", Pending:"amber", Rejected:"rose" };

  return (
      <div>
        {showEntry && <HREntryModal onClose={()=>setShowEntry(false)} onSave={handleSave}/>}

        <PageHeader title="Permission Records" subtitle="HR • Access Control Entry" icon="🔐" onBack={onBack} color="amber"/>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Records" value={records.length} icon="🔐" color="amber"/>
          <StatCard label="Pending" value={records.filter(r=>r.status==="Pending").length} icon="⏳" color="amber"/>
          <StatCard label="Approved" value={records.filter(r=>r.status==="Approved").length} icon="✅" color="green"/>
          <StatCard label="Rejected" value={records.filter(r=>r.status==="Rejected").length} icon="✗" color="rose"/>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex gap-2">
            {filters.map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${filter===f
                            ?"bg-amber-400/20 border-amber-400/40 text-amber-300"
                            :"bg-white/5 border-white/10 text-white/40 hover:bg-white/8"}`}>
                  {f}
                </button>
            ))}
          </div>
          <button onClick={()=>setShowEntry(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
                  style={{background:"linear-gradient(135deg,rgba(251,191,36,0.25),rgba(251,191,36,0.1))",border:"1px solid rgba(251,191,36,0.4)",color:"#fbbf24"}}>
            + New Entry
          </button>
        </div>

        {/* Records list */}
        <div className="space-y-3">
          {filtered.map(rec => {
            const sc = statusColor[rec.status] || "gray";
            const a = ACCENT[sc];
            return (
                <div key={rec.id} className="relative rounded-2xl overflow-hidden transition-all hover:-translate-y-px"
                     style={{background:"linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))",border:`1px solid ${a.border}`,boxShadow:`0 4px 20px rgba(0,0,0,0.3),0 0 24px ${a.bg}`}}>
                  <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${a.bar}`}/>

                  <div className="p-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold"
                             style={{background:a.bg,border:`1px solid ${a.border}`,color:a.text}}>
                          {rec.worker.split(" ").map(w=>w[0]).join("").slice(0,2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-mono text-[10px] text-white/30">{rec.id}</span>
                            <StatusBadge status={rec.status}/>
                          </div>
                          <p className="text-xs font-semibold text-white/85 truncate">{rec.worker}</p>
                          <p className="text-[10px] text-white/35">{rec.position} · {rec.dept}</p>
                        </div>
                      </div>

                      {/* Type + Module */}
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-semibold text-white/65 mb-1">{rec.type}</p>
                        <Badge color="blue">{rec.module}</Badge>
                      </div>
                    </div>

                    {/* Date range */}
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-amber-400/60">📅</span>
                        <span className="text-white/55">{rec.fromDate}</span>
                        <span className="text-white/20 mx-0.5">→</span>
                        <span className="text-white/55">{rec.toDate}</span>
                        <span className="ml-1 px-1.5 py-0.5 rounded-md text-[9px]"
                              style={{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.4)"}}>
                      {daysDiff(rec.fromDate,rec.toDate)}d
                    </span>
                      </div>
                      <span className="text-[10px] text-white/25">Entered by {rec.enteredBy} · {rec.enteredAt}</span>
                    </div>

                    {/* Reason */}
                    <div className="mt-2.5 rounded-lg px-3 py-2 text-[11px] text-white/50 leading-relaxed"
                         style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                      <span className="text-white/25 text-[9px] uppercase tracking-widest mr-2">Reason</span>{rec.reason}
                    </div>

                    {/* HR Note */}
                    {rec.note && (
                        <div className="mt-2 rounded-lg px-3 py-1.5 text-[10px] text-white/40 italic"
                             style={{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.12)"}}>
                          💬 {rec.note}
                        </div>
                    )}

                    {/* Actions row */}
                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                      {/* Status changer */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-white/25 uppercase tracking-widest mr-1">Status:</span>
                        {["Pending","Approved","Rejected"].map(s=>(
                            <button key={s} onClick={()=>changeStatus(rec.id,s)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${rec.status===s
                                        ? s==="Approved"?"bg-emerald-400/25 border-emerald-400/40 text-emerald-300"
                                            : s==="Rejected"?"bg-rose-400/25 border-rose-400/40 text-rose-300"
                                                : "bg-amber-400/25 border-amber-400/40 text-amber-300"
                                        : "bg-white/5 border-white/8 text-white/25 hover:text-white/50 hover:bg-white/8"}`}>
                              {s==="Approved"?"✓":s==="Rejected"?"✗":"⏳"} {s}
                            </button>
                        ))}
                      </div>
                      <button onClick={()=>deleteRecord(rec.id)}
                              className="px-2.5 py-1 rounded-lg text-[10px] text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-400/20 transition-all">
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
            );
          })}
          {filtered.length===0 && (
              <div className="text-center py-14 text-white/20 text-sm">No {filter.toLowerCase()} records found</div>
          )}
        </div>
      </div>
  );
}

// ALL PAGES
// ═══════════════════════════════════════════════════════════════

function UsersPage({onBack}){return(<div><PageHeader title="User Management" subtitle="Administration • Access Control" icon="👥" onBack={onBack} color="amber"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Total" value={DATA.users.length} icon="👤" color="amber"/><StatCard label="Active" value={DATA.users.filter(u=>u.status==="Active").length} icon="✅" color="green"/><StatCard label="Inactive" value={DATA.users.filter(u=>u.status==="Inactive").length} icon="🔒" color="rose"/><StatCard label="Roles" value={DATA.roles.length} icon="🛡️" color="blue"/></div><GlassCard color="amber"><Table color="amber" cols={["#","Name","Email","Role","Department","Status","Last Login"]} rows={DATA.users.map(u=>[u.id,<span className="font-medium text-white/90">{u.name}</span>,<span className="text-white/50 font-mono text-[10px]">{u.email}</span>,u.role,u.dept,<StatusBadge status={u.status}/>,u.lastLogin])}/></GlassCard></div>);}

function RolesPage({onBack}){return(<div><PageHeader title="Roles & Permissions" subtitle="Administration • Access Control" icon="🛡️" onBack={onBack} color="amber"/><GlassCard color="amber"><Table color="amber" cols={["#","Role","Description","Users","Permissions"]} rows={DATA.roles.map(r=>[r.id,<span className="font-semibold text-amber-300">{r.name}</span>,r.desc,r.users,<Badge color="blue">{r.permissions} perms</Badge>])}/></GlassCard></div>);}

function AuditLogPage({onBack}){return(<div><PageHeader title="Audit Log" subtitle="Administration • System" icon="📜" onBack={onBack} color="amber"/><GlassCard color="amber"><div className="space-y-2">{DATA.auditLog.map((log,i)=>(<div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"><div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 bg-amber-400/15 border border-amber-400/25">📝</div><div className="flex-1 min-w-0"><p className="text-xs text-white/80">{log.action}</p><p className="text-[10px] text-white/35 mt-0.5">{log.user} • {log.time}</p></div><Badge color="amber">{log.module}</Badge></div>))}</div></GlassCard></div>);}

function SettingsPage({onBack}){const settings=[{group:"Factory",items:[{label:"Factory Name",value:"SEC Mega Factory"},{label:"Location",value:"Phnom Penh, Cambodia"},{label:"Timezone",value:"UTC+7"}]},{group:"Production",items:[{label:"Working Days",value:"Mon – Sat"},{label:"Shifts/Day",value:"3"},{label:"OT Policy",value:"Max 2 hrs/day"}]},{group:"Notifications",items:[{label:"Defect Alert",value:"qc@sec-factory.com"},{label:"Low Stock Alert",value:"Enabled"},{label:"Delay Warning",value:"Enabled"}]},{group:"Integration",items:[{label:"ERP System",value:"SAP B1"},{label:"API Version",value:"v2.4.1"},{label:"Backup",value:"Daily 02:00"}]}];return(<div><PageHeader title="System Settings" subtitle="Administration • System" icon="⚙️" onBack={onBack} color="amber"/><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{settings.map((s,i)=>(<GlassCard key={i} color="amber"><p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-widest mb-3">{s.group}</p><div className="space-y-3">{s.items.map((item,j)=>(<div key={j} className="flex flex-col gap-0.5"><span className="text-[10px] text-white/35 uppercase tracking-wide">{item.label}</span><span className="text-xs text-white/75">{item.value}</span></div>))}</div></GlassCard>))}</div></div>);}

function DepartmentsPage({onBack}){return(<div><PageHeader title="Departments" subtitle="Data Setup • Factory Structure" icon="🏢" onBack={onBack} color="blue"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Departments" value={DATA.departments.length} icon="🏢" color="blue"/><StatCard label="Total Workers" value={STATS.totalWorkers} icon="👷" color="green"/><StatCard label="Total Lines" value={DATA.productionLines.length} icon="⚡" color="amber"/><StatCard label="Floors" value={6} icon="🏗️" color="violet"/></div><GlassCard color="blue"><Table color="blue" cols={["#","Department","Head","Floor","Lines","Workers","Status"]} rows={DATA.departments.map(d=>[d.id,<span className="font-semibold text-blue-300">{d.name}</span>,d.head,<Badge color="violet">Floor {d.floor}</Badge>,d.lines,d.workers,<StatusBadge status={d.status}/>])}/></GlassCard></div>);}

function ProductionLinesPage({onBack}){return(<div><PageHeader title="Production Lines" subtitle="Data Setup • Factory Structure" icon="🏗️" onBack={onBack} color="blue"/><GlassCard color="blue"><Table color="blue" cols={["Line","Dept","Supervisor","Workers","Target","Actual","Efficiency"]} rows={DATA.productionLines.map(l=>[<span className="font-semibold text-blue-300">{l.name}</span>,l.dept,l.supervisor,l.workers,l.target.toLocaleString(),l.actual.toLocaleString(),<ProgressBar value={l.eff}/>])}/></GlassCard></div>);}

function ProductsPage({onBack}){return(<div><PageHeader title="Products / Style" subtitle="Data Setup • Products" icon="👕" onBack={onBack} color="blue"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total Styles" value={DATA.products.length} icon="👕" color="blue"/><StatCard label="Active" value={DATA.products.filter(p=>p.status==="Active").length} icon="✅" color="green"/><StatCard label="Draft" value={DATA.products.filter(p=>p.status==="Draft").length} icon="📝" color="amber"/></div><GlassCard color="blue"><Table color="blue" cols={["Code","Style Name","Category","Buyer","SMV","Color","Status"]} rows={DATA.products.map(p=>[<span className="font-mono text-blue-300">{p.code}</span>,p.name,<Badge color="blue">{p.category}</Badge>,p.buyer,`${p.smv} min`,p.color,<StatusBadge status={p.status}/>])}/></GlassCard></div>);}

function MaterialsPage({onBack}){return(<div><PageHeader title="Materials / BOM" subtitle="Data Setup • Materials" icon="🧵" onBack={onBack} color="blue"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total Items" value={DATA.materials.length} icon="🧵" color="blue"/><StatCard label="Low Stock" value={DATA.materials.filter(m=>m.stock<m.reorder).length} icon="⚠️" color="rose"/><StatCard label="OK Stock" value={DATA.materials.filter(m=>m.stock>=m.reorder).length} icon="✅" color="green"/></div><GlassCard color="blue"><Table color="blue" cols={["Code","Material","Unit","Stock","Reorder","Cost/Unit","Supplier","Status"]} rows={DATA.materials.map(m=>[<span className="font-mono text-blue-300">{m.code}</span>,m.name,m.unit,m.stock.toLocaleString(),m.reorder.toLocaleString(),`$${m.cost}`,m.supplier,m.stock<m.reorder?<Badge color="rose">Low Stock</Badge>:<Badge color="green">OK</Badge>])}/></GlassCard></div>);}

function ShiftsPage({onBack}){return(<div><PageHeader title="Shift Management" subtitle="Data Setup • Factory Structure" icon="🕐" onBack={onBack} color="blue"/><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{DATA.shifts.map((s,i)=>(<GlassCard key={i} color="blue"><div className="text-2xl mb-2">🕐</div><h3 className="font-bold text-white/90 text-sm mb-1">{s.name}</h3><p className="text-xs text-white/40 mb-3">{s.start} – {s.end}</p><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-white/40">Days</span><span className="text-blue-300">{s.days}</span></div><div className="flex justify-between text-xs"><span className="text-white/40">Supervisor</span><span className="text-white/75">{s.supervisor}</span></div><div className="flex justify-between text-xs"><span className="text-white/40">Workers</span><span className="text-white/75">{s.workers}</span></div></div></GlassCard>))}</div></div>);}

function StandardsPage({onBack}){return(<div><PageHeader title="Operation Standards (SMV)" subtitle="Data Setup • Standards" icon="📐" onBack={onBack} color="blue"/><GlassCard color="blue"><Table color="blue" cols={["#","Product","Operation","SMV (min)","Machine","Skill Level"]} rows={DATA.standards.map((s,i)=>[i+1,s.product,s.operation,<span className="font-semibold text-blue-300">{s.smv}</span>,s.machine,<StatusBadge status={s.skill}/>])}/></GlassCard></div>);}

function WorkOrdersPage({onBack}){return(<div><PageHeader title="Work Orders" subtitle="Production • Planning" icon="📋" onBack={onBack} color="green"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="In Progress" value={DATA.workOrders.filter(w=>w.status==="In Progress").length} icon="⚙️" color="green"/><StatCard label="Pending" value={DATA.workOrders.filter(w=>w.status==="Pending").length} icon="⏳" color="amber"/><StatCard label="Delayed" value={DATA.workOrders.filter(w=>w.status==="Delayed").length} icon="⚠️" color="rose"/><StatCard label="Total Qty" value={DATA.workOrders.reduce((s,w)=>s+w.qty,0).toLocaleString()} icon="👕" color="blue"/></div><GlassCard color="green"><Table color="green" cols={["Order ID","Product","Buyer","Qty","Done","Progress","Line","Due","Priority","Status"]} rows={DATA.workOrders.map(w=>[<span className="font-mono text-green-300 text-[10px]">{w.id}</span>,w.product,w.buyer,w.qty.toLocaleString(),w.done.toLocaleString(),<ProgressBar value={w.qty>0?Math.round(w.done/w.qty*100):0}/>,w.line,w.due,<StatusBadge status={w.priority}/>,<StatusBadge status={w.status}/>])}/></GlassCard></div>);}

function SchedulePage({onBack}){const days=["Mon 03","Tue 04","Wed 05","Thu 06","Fri 07","Sat 08"];return(<div><PageHeader title="Production Schedule" subtitle="Production • Planning" icon="📅" onBack={onBack} color="green"/><GlassCard color="green"><p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Week of Mar 3–8, 2026</p><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr><th className="text-left px-2 py-2 text-white/40 font-semibold w-24">Line</th>{days.map(d=><th key={d} className="px-2 py-2 text-center text-white/40 font-semibold">{d}</th>)}</tr></thead><tbody>{DATA.productionLines.map((l,i)=>(<tr key={i} className="border-t border-white/5"><td className="px-2 py-2 text-green-300 font-medium">{l.name}</td>{days.map((d,j)=>(<td key={j} className="px-2 py-2 text-center"><div className="mx-auto w-12 h-6 rounded flex items-center justify-center text-[9px]" style={{background:j===2?"rgba(52,211,153,0.2)":j<2?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.04)",border:j===2?"1px solid rgba(52,211,153,0.35)":"1px solid rgba(255,255,255,0.08)",color:j===2?"#34d399":j<2?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.25)"}}>{j===2?"Today":j<2?"Done":"Plan"}</div></td>))}</tr>))}</tbody></table></div></GlassCard></div>);}

function RealtimePage({onBack}){return(<div><PageHeader title="Real-time Monitor" subtitle="Production • Monitoring" icon="📡" onBack={onBack} color="green"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Active Lines" value={STATS.activeLines} icon="⚡" color="green"/><StatCard label="Today Output" value={STATS.todayOutput.toLocaleString()} icon="👕" color="blue"/><StatCard label="Avg Efficiency" value={`${STATS.efficiency}%`} icon="📈" color="amber"/><StatCard label="Open Defects" value={STATS.openDefects} icon="⚠️" color="rose"/></div><GlassCard color="green"><p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Live Line Performance</p><div className="space-y-3">{DATA.productionLines.map((l,i)=>(<div key={i} className="flex items-center gap-3"><span className="w-16 text-xs text-white/60 shrink-0">{l.name}</span><div className="flex-1"><ProgressBar value={l.eff}/></div><span className="text-xs text-white/50 shrink-0 w-24 text-right">{l.actual}/{l.target} pcs</span><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:l.eff>=90?"#34d399":l.eff>=75?"#60a5fa":"#fb7185"}}/></div>))}</div></GlassCard></div>);}

function TVDisplayPage({onBack}){return(<div><PageHeader title="TV Displays" subtitle="Production • Monitoring" icon="📺" onBack={onBack} color="green"/><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{DATA.tvDisplays.map((tv,i)=>(<GlassCard key={i} color={tv.status==="Online"?"green":"rose"}><div className="flex items-start justify-between mb-3"><span className="text-2xl">📺</span><StatusBadge status={tv.status}/></div><h3 className="font-bold text-white/90 text-sm mb-1">{tv.name}</h3><p className="text-xs text-white/40 mb-3">{tv.location}</p><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-white/40">Lines</span><span className="text-white/70">{tv.line}</span></div><div className="flex justify-between text-xs"><span className="text-white/40">IP</span><span className="font-mono text-green-300 text-[11px]">{tv.ip}</span></div><div className="flex justify-between text-xs"><span className="text-white/40">Last Ping</span><span className="text-white/50 text-[10px]">{tv.lastPing}</span></div></div></GlassCard>))}</div></div>);}

function MachinesPage({onBack}){return(<div><PageHeader title="Machine Management" subtitle="Maintenance • Assets" icon="⚙️" onBack={onBack} color="orange"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Total" value={DATA.machines.length} icon="🔧" color="orange"/><StatCard label="Running" value={DATA.machines.filter(m=>m.status==="Running").length} icon="✅" color="green"/><StatCard label="Maintenance" value={DATA.machines.filter(m=>m.status==="Maintenance").length} icon="🔧" color="amber"/><StatCard label="Idle" value={DATA.machines.filter(m=>m.status==="Idle").length} icon="💤" color="gray"/></div><GlassCard color="orange"><Table color="orange" cols={["ID","Machine","Type","Dept","Line","Last Service","Next Service","Status"]} rows={DATA.machines.map(m=>[<span className="font-mono text-orange-300 text-[10px]">{m.id}</span>,m.name,m.type,m.dept,m.line,m.lastService,m.nextService,<StatusBadge status={m.status}/>])}/></GlassCard></div>);}

function DefectsPage({onBack}){return(<div><PageHeader title="Defect Reports" subtitle="Quality • Control" icon="🔍" onBack={onBack} color="rose"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Open" value={DATA.defects.filter(d=>d.status==="Open").length} icon="🚨" color="rose"/><StatCard label="Rework" value={DATA.defects.filter(d=>d.status==="Rework").length} icon="🔄" color="amber"/><StatCard label="Resolved" value={DATA.defects.filter(d=>d.status==="Resolved").length} icon="✅" color="green"/></div><GlassCard color="rose"><Table color="rose" cols={["#","Line","Product","Defect Type","Qty","Severity","Inspector","Date","Status"]} rows={DATA.defects.map(d=>[d.id,d.line,d.product,d.type,d.qty,<StatusBadge status={d.severity}/>,d.inspector,d.date,<StatusBadge status={d.status}/>])}/></GlassCard></div>);}

function InspectionsPage({onBack}){return(<div><PageHeader title="Quality Inspections" subtitle="Quality • Inspection" icon="🔬" onBack={onBack} color="rose"/><div className="grid grid-cols-4 gap-3 mb-5"><StatCard label="Total" value={DATA.inspections.length} icon="🔬" color="rose"/><StatCard label="Pass" value={DATA.inspections.filter(i=>i.result==="Pass").length} icon="✅" color="green"/><StatCard label="Fail" value={DATA.inspections.filter(i=>i.result==="Fail").length} icon="❌" color="rose"/><StatCard label="Avg Pass Rate" value={`${Math.round(DATA.inspections.reduce((s,i)=>s+(i.passed/i.checked*100),0)/DATA.inspections.length)}%`} icon="📊" color="amber"/></div><GlassCard color="rose"><Table color="rose" cols={["Work Order","Stage","Inspector","Date","Checked","Passed","Failed","Result"]} rows={DATA.inspections.map(i=>[<span className="font-mono text-rose-300 text-[10px]">{i.wo}</span>,<Badge color="blue">{i.stage}</Badge>,i.inspector,i.date,i.checked,i.passed,<span className="text-rose-300">{i.failed}</span>,<StatusBadge status={i.result}/>])}/></GlassCard></div>);}

function DashboardPage({onBack}){const totalTarget=DATA.productionLines.reduce((s,l)=>s+l.target,0);const totalActual=DATA.productionLines.reduce((s,l)=>s+l.actual,0);return(<div><PageHeader title="Analytics Dashboard" subtitle="Reports • Analytics" icon="📊" onBack={onBack} color="rose"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Today Output" value={STATS.todayOutput.toLocaleString()} icon="👕" color="green"/><StatCard label="Total Target" value={totalTarget.toLocaleString()} icon="🎯" color="blue"/><StatCard label="Overall Eff." value={`${Math.round(totalActual/totalTarget*100)}%`} icon="📈" color="amber"/><StatCard label="Open Defects" value={STATS.openDefects} icon="⚠️" color="rose"/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><GlassCard color="rose"><p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Line Efficiency</p>{DATA.productionLines.map((l,i)=>(<div key={i} className="mb-2"><div className="flex justify-between text-[11px] text-white/50 mb-1"><span>{l.name}</span><span>{l.dept}</span></div><ProgressBar value={l.eff}/></div>))}</GlassCard><GlassCard color="rose"><p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Order Status</p>{["In Progress","Pending","Delayed"].map(s=>{const count=DATA.workOrders.filter(w=>w.status===s).length;return(<div key={s} className="mb-3"><div className="flex justify-between text-[11px] text-white/50 mb-1"><span>{s}</span><span>{count} orders</span></div><ProgressBar value={Math.round(count/DATA.workOrders.length*100)}/></div>);})}</GlassCard></div></div>);}

function CostingPage({onBack}){return(<div><PageHeader title="Cost Sheet / Costing" subtitle="Finance • Costing" icon="💰" onBack={onBack} color="violet"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Avg FOB" value={`$${(DATA.costings.reduce((s,c)=>s+c.fob,0)/DATA.costings.length).toFixed(2)}`} icon="💵" color="violet"/><StatCard label="Avg Margin" value={`${(DATA.costings.reduce((s,c)=>s+c.margin,0)/DATA.costings.length).toFixed(1)}%`} icon="📈" color="green"/><StatCard label="Styles Costed" value={DATA.costings.length} icon="📋" color="blue"/></div><GlassCard color="violet"><Table color="violet" cols={["Product","Fabric $","Trim $","Labor $","Overhead $","Total Cost","FOB $","Margin %"]} rows={DATA.costings.map(c=>[c.product,`$${c.fabric}`,`$${c.trim}`,`$${c.labor}`,`$${c.overhead}`,<span className="font-semibold text-white/90">${c.total}</span>,<span className="font-semibold text-violet-300">${c.fob}</span>,<span className="font-semibold text-green-400">{c.margin}%</span>])}/></GlassCard></div>);}

function BuyersPage({onBack}){return(<div><PageHeader title="Buyers / Customers" subtitle="Sales • Buyers" icon="🤝" onBack={onBack} color="cyan"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total Buyers" value={DATA.buyers.length} icon="🤝" color="cyan"/><StatCard label="Active Orders" value={DATA.workOrders.length} icon="📋" color="green"/><StatCard label="Total Pcs" value={DATA.buyers.reduce((s,b)=>s+b.totalPcs,0).toLocaleString()} icon="👕" color="blue"/></div><GlassCard color="cyan"><Table color="cyan" cols={["#","Buyer","Country","Contact","Email","Active Orders","Total Pcs","Status"]} rows={DATA.buyers.map(b=>[b.id,<span className="font-semibold text-cyan-300">{b.name}</span>,b.country,b.contact,<span className="text-white/50 text-[10px]">{b.email}</span>,b.activeOrders,b.totalPcs.toLocaleString(),<StatusBadge status={b.status}/>])}/></GlassCard></div>);}

function SuppliersPage({onBack}){return(<div><PageHeader title="Suppliers" subtitle="Procurement • Suppliers" icon="🏭" onBack={onBack} color="teal"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total" value={DATA.suppliers.length} icon="🏭" color="teal"/><StatCard label="Active" value={DATA.suppliers.filter(s=>s.status==="Active").length} icon="✅" color="green"/><StatCard label="Avg Lead" value="13 days" icon="📦" color="amber"/></div><GlassCard color="teal"><Table color="teal" cols={["#","Supplier","Country","Contact","Material","Rating","Lead Days","Status"]} rows={DATA.suppliers.map(s=>[s.id,<span className="font-semibold text-teal-300">{s.name}</span>,s.country,s.contact,s.material,<Stars rating={s.rating}/>,`${s.leadDays}d`,<StatusBadge status={s.status}/>])}/></GlassCard></div>);}

function PurchaseOrdersPage({onBack}){return(<div><PageHeader title="Purchase Orders" subtitle="Procurement • Orders" icon="📦" onBack={onBack} color="teal"/><div className="grid grid-cols-4 gap-3 mb-5"><StatCard label="Total" value={DATA.purchaseOrders.length} icon="📦" color="teal"/><StatCard label="In Transit" value={DATA.purchaseOrders.filter(p=>p.status==="In Transit").length} icon="🚢" color="blue"/><StatCard label="Delivered" value={DATA.purchaseOrders.filter(p=>p.status==="Delivered").length} icon="✅" color="green"/><StatCard label="Pending" value={DATA.purchaseOrders.filter(p=>p.status==="Pending"||p.status==="Confirmed").length} icon="⏳" color="amber"/></div><GlassCard color="teal"><Table color="teal" cols={["PO ID","Supplier","Material","Qty","Amount","Order Date","Delivery","Status"]} rows={DATA.purchaseOrders.map(p=>[<span className="font-mono text-teal-300 text-[10px]">{p.id}</span>,p.supplier,p.material,p.qty,<span className="font-semibold text-white/90">${p.amount.toLocaleString()}</span>,p.date,p.delivery,<StatusBadge status={p.status}/>])}/></GlassCard></div>);}

function ShipmentsPage({onBack}){return(<div><PageHeader title="Shipments / Export" subtitle="Logistics • Shipments" icon="🚢" onBack={onBack} color="cyan"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total" value={DATA.shipments.length} icon="🚢" color="cyan"/><StatCard label="Confirmed" value={DATA.shipments.filter(s=>s.status==="Confirmed").length} icon="✅" color="green"/><StatCard label="Scheduled" value={DATA.shipments.filter(s=>s.status==="Scheduled").length} icon="📅" color="blue"/></div><GlassCard color="cyan"><Table color="cyan" cols={["SH ID","Buyer","Work Order","Qty","Method","Vessel/Flight","ETD","ETA","Status"]} rows={DATA.shipments.map(s=>[<span className="font-mono text-cyan-300 text-[10px]">{s.id}</span>,s.buyer,<span className="font-mono text-[10px] text-white/60">{s.wo}</span>,s.qty.toLocaleString(),<Badge color="blue">{s.method}</Badge>,s.vessel,s.etd,s.eta,<StatusBadge status={s.status}/>])}/></GlassCard></div>);}

function EmployeesPage({onBack}){return(<div><PageHeader title="Employees" subtitle="HR • Employee Management" icon="👷" onBack={onBack} color="violet"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Total" value={DATA.employees.length} icon="👷" color="violet"/><StatCard label="Active" value={DATA.employees.filter(e=>e.status==="Active").length} icon="✅" color="green"/><StatCard label="Permanent" value={DATA.employees.filter(e=>e.type==="Permanent").length} icon="🏅" color="blue"/><StatCard label="Contract" value={DATA.employees.filter(e=>e.type==="Contract").length} icon="📄" color="amber"/></div><GlassCard color="violet"><Table color="violet" cols={["ID","Name","Dept","Position","Hire Date","Salary $","Type","Status"]} rows={DATA.employees.map(e=>[<span className="font-mono text-violet-300 text-[10px]">{e.id}</span>,<span className="font-medium text-white/90">{e.name}</span>,e.dept,e.position,e.hire,<span className="font-semibold text-green-400">${e.salary}</span>,<StatusBadge status={e.type}/>,<StatusBadge status={e.status}/>])}/></GlassCard></div>);}

function AttendancePage({onBack}){return(<div><PageHeader title="Attendance" subtitle="HR • Attendance" icon="🕐" onBack={onBack} color="violet"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Present" value={DATA.attendance.filter(a=>a.status==="Present"||a.status==="OT").length} icon="✅" color="green"/><StatCard label="Absent" value={DATA.attendance.filter(a=>a.status==="Absent").length} icon="❌" color="rose"/><StatCard label="OT" value={DATA.attendance.filter(a=>a.status==="OT").length} icon="⏰" color="amber"/><StatCard label="Date" value="Mar 5" icon="📅" color="blue"/></div><GlassCard color="violet"><Table color="violet" cols={["#","Employee","Dept","Date","Time In","Time Out","OT Hrs","Status"]} rows={DATA.attendance.map((a,i)=>[i+1,a.employee,a.dept,a.date,a.in,a.out,a.ot?<span className="text-amber-400">{a.ot}h</span>:"–",<StatusBadge status={a.status}/>])}/></GlassCard></div>);}

function LeavePage({onBack}){return(<div><PageHeader title="Leave Management" subtitle="HR • Leave" icon="🌴" onBack={onBack} color="violet"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total Requests" value={DATA.leaves.length} icon="📋" color="violet"/><StatCard label="Approved" value={DATA.leaves.filter(l=>l.status==="Approved").length} icon="✅" color="green"/><StatCard label="Pending" value={DATA.leaves.filter(l=>l.status==="Pending").length} icon="⏳" color="amber"/></div><GlassCard color="violet"><Table color="violet" cols={["#","Employee","Leave Type","From","To","Days","Approver","Status"]} rows={DATA.leaves.map((l,i)=>[i+1,l.employee,<Badge color="violet">{l.type}</Badge>,l.from,l.to,l.days,l.approver,<StatusBadge status={l.status}/>])}/></GlassCard></div>);}

function PayrollPage({onBack}){return(<div><PageHeader title="Payroll" subtitle="HR • Finance" icon="💵" onBack={onBack} color="violet"/><div className="grid grid-cols-4 gap-3 mb-5"><StatCard label="Total Payroll" value={`$${DATA.payroll.reduce((s,p)=>s+p.net,0).toLocaleString()}`} icon="💵" color="violet"/><StatCard label="Employees" value={DATA.payroll.length} icon="👷" color="blue"/><StatCard label="Paid" value={DATA.payroll.filter(p=>p.status==="Paid").length} icon="✅" color="green"/><StatCard label="Processing" value={DATA.payroll.filter(p=>p.status==="Processing").length} icon="⏳" color="amber"/></div><GlassCard color="violet"><Table color="violet" cols={["Employee","Dept","Base $","OT $","Bonus $","Deduct $","Net $","Month","Status"]} rows={DATA.payroll.map(p=>[<span className="font-medium text-white/90">{p.employee}</span>,p.dept,`$${p.base}`,<span className="text-amber-400">${p.ot}</span>,<span className="text-green-400">${p.bonus}</span>,<span className="text-rose-400">-${p.deduction}</span>,<span className="font-bold text-violet-300">${p.net}</span>,p.month,<StatusBadge status={p.status}/>])}/></GlassCard></div>);}

function ReportsPage({onBack}){const reports=[{icon:"📊",title:"Daily Production Report",desc:"Output by line, efficiency, target vs actual",color:"green",freq:"Daily"},{icon:"🔍",title:"Quality Summary",desc:"Defect rate, inspection results, AQL",color:"rose",freq:"Daily"},{icon:"👷",title:"Attendance Summary",desc:"Present, absent, OT hours by dept",color:"violet",freq:"Daily"},{icon:"📦",title:"Inventory Status",desc:"Stock levels, low stock alerts, reorder list",color:"teal",freq:"Weekly"},{icon:"💰",title:"Cost Analysis",desc:"Actual vs standard cost per style",color:"violet",freq:"Monthly"},{icon:"🚢",title:"Shipment Status",desc:"On-time delivery rate, pending shipments",color:"cyan",freq:"Weekly"},{icon:"🏭",title:"Machine Utilization",desc:"Running vs idle vs maintenance breakdown",color:"orange",freq:"Weekly"},{icon:"📈",title:"KPI Dashboard",desc:"All factory KPIs in one view",color:"amber",freq:"Real-time"}];return(<div><PageHeader title="Reports" subtitle="Reports • Analytics" icon="📈" onBack={onBack} color="rose"/><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{reports.map((r,i)=>(<GlassCard key={i} color={r.color}><div className="text-2xl mb-2">{r.icon}</div><h3 className="font-semibold text-white/90 text-sm mb-1">{r.title}</h3><p className="text-[11px] text-white/40 mb-3">{r.desc}</p><div className="flex items-center justify-between"><Badge color={r.color}>{r.freq}</Badge><button className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Generate →</button></div></GlassCard>))}</div></div>);}


// ═══════════════════════════════════════════════════════════════
// MENU BUTTON + SECTION + GROUP
// ═══════════════════════════════════════════════════════════════
function MenuButton({title,iconPath,onClick,badge}){
  const [pressed,setPressed]=useState(false);
  return(
      <button onClick={()=>{setPressed(true);setTimeout(()=>setPressed(false),150);onClick?.();}}
              className={`relative flex flex-col items-center justify-center gap-2 w-20 h-20 rounded-2xl cursor-pointer select-none overflow-hidden border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:bg-white/18 hover:border-amber-400/40 hover:-translate-y-0.5 active:scale-95 ${pressed?"scale-95":"scale-100"}`}>
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"/>
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 via-transparent to-transparent"/>
        {badge&&<span className="absolute -top-1 -right-1 z-20 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[9px] font-bold text-gray-900 flex items-center justify-center shadow">{badge}</span>}
        <img src={iconPath} alt={title} className="relative w-8 h-8 object-contain drop-shadow-md flex-shrink-0" onError={e=>{e.target.src="https://api.iconify.design/mdi:dots-grid.svg?color=white";}}/>
        <span className="relative text-[10px] font-light tracking-wide text-white/85 text-center leading-tight px-1 drop-shadow">{title}</span>
      </button>
  );
}

function Section({title,icon,color="amber",children}){
  const a=ACCENT[color];
  return(
      <div className="relative rounded-3xl overflow-hidden p-5"
           style={{background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)",backdropFilter:"blur(20px)",border:`1px solid ${a.border}`,boxShadow:`inset 0 1px 0 rgba(255,255,255,0.12),0 8px 32px rgba(0,0,0,0.4),0 0 40px ${a.bg}`}}>
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

function Group({label,color="amber",children}){
  const c={amber:"text-amber-300/60 border-amber-400/20",blue:"text-blue-300/60 border-blue-400/20",green:"text-emerald-300/60 border-emerald-400/20",rose:"text-rose-300/60 border-rose-400/20",violet:"text-violet-300/60 border-violet-400/20",cyan:"text-cyan-300/60 border-cyan-400/20",orange:"text-orange-300/60 border-orange-400/20",teal:"text-teal-300/60 border-teal-400/20"}[color];
  return(
      <div className="mb-4 last:mb-0">
        <p className={`text-[9px] font-semibold tracking-[0.18em] uppercase mb-3 pb-1 border-b ${c}`}>{label}</p>
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function MenuTesting(){
  const [page,setPage]=useState(null);
  const [permBadge,setPermBadge]=useState(2); // pending count
  const nav=(p)=>setPage(p);
  const back=()=>setPage(null);

  const PAGES={
    users:<UsersPage onBack={back}/>, roles:<RolesPage onBack={back}/>, "audit-log":<AuditLogPage onBack={back}/>, settings:<SettingsPage onBack={back}/>,
    departments:<DepartmentsPage onBack={back}/>, "production-lines":<ProductionLinesPage onBack={back}/>, products:<ProductsPage onBack={back}/>,
    materials:<MaterialsPage onBack={back}/>, shifts:<ShiftsPage onBack={back}/>, standards:<StandardsPage onBack={back}/>,
    "work-orders":<WorkOrdersPage onBack={back}/>, schedule:<SchedulePage onBack={back}/>, realtime:<RealtimePage onBack={back}/>, tv:<TVDisplayPage onBack={back}/>,
    machines:<MachinesPage onBack={back}/>, defects:<DefectsPage onBack={back}/>, inspections:<InspectionsPage onBack={back}/>,
    dashboard:<DashboardPage onBack={back}/>, costing:<CostingPage onBack={back}/>, buyers:<BuyersPage onBack={back}/>,
    suppliers:<SuppliersPage onBack={back}/>, "purchase-orders":<PurchaseOrdersPage onBack={back}/>, shipments:<ShipmentsPage onBack={back}/>,
    employees:<EmployeesPage onBack={back}/>, attendance:<AttendancePage onBack={back}/>, leave:<LeavePage onBack={back}/>,
    payroll:<PayrollPage onBack={back}/>, reports:<ReportsPage onBack={back}/>,
    permissions:<PermissionsPage onBack={back}/>,
  };

  const I=(name,color="white")=>`https://api.iconify.design/mdi:${name}.svg?color=${color}`;

  return(
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .admin-root{font-family:'Sora',sans-serif;}
        @keyframes fadein{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .fadein{animation:fadein 0.45s cubic-bezier(.22,1,.36,1) both;}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
      `}</style>

        <div className="admin-root min-h-screen p-5 lg:p-8"
             style={{background:"radial-gradient(ellipse at 10% 10%,#1c2d1a 0%,transparent 50%),radial-gradient(ellipse at 90% 90%,#1a1f2e 0%,transparent 50%),radial-gradient(ellipse at 55% 45%,#1e1a10 0%,transparent 60%),#0c0e0b"}}>

          <div className="fixed inset-0 pointer-events-none opacity-40" style={{backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
          <div className="fixed w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none -top-24 -left-24 animate-pulse" style={{background:"#854d0e"}}/>
          <div className="fixed w-72 h-72 rounded-full opacity-10 blur-[80px] pointer-events-none bottom-0 right-0 animate-pulse" style={{background:"#1d4ed8",animationDelay:"2s"}}/>

          {/* Header */}
          <div className="relative z-10 mb-7 fadein flex items-center gap-4">
            {page&&<button onClick={back} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors border border-white/10 hover:border-white/20 bg-white/5 shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Menu</button>}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.3)"}}>🏭</div>
            <div>
              <h1 className="text-lg font-bold text-white/90 tracking-tight">SEC Mega Factory</h1>
              <p className="text-[10px] text-white/30 tracking-widest uppercase font-light">Garment ERP System</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {/* Quick permission request button in header */}
              {!page && (
                  <button onClick={() => nav("permissions")}
                          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border"
                          style={{ background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24" }}>
                    🔐 Permissions
                    {permBadge > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-bold text-gray-900 flex items-center justify-center">{permBadge}</span>}
                  </button>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.25)"}}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">Live</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 fadein" key={page}>
            {page&&PAGES[page]?PAGES[page]:(
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
                    {[{l:"Active Lines",v:"12",i:"⚡",c:"amber"},{l:"Today Output",v:"4,820",i:"👕",c:"green"},{l:"Efficiency",v:"91%",i:"📈",c:"blue"},{l:"Open Defects",v:"7",i:"⚠️",c:"rose"},{l:"Work Orders",v:"5",i:"📋",c:"violet"},{l:"Workers",v:"476",i:"👷",c:"cyan"}].map(s=>
                        <StatCard key={s.l} label={s.l} value={s.v} icon={s.i} color={s.c}/>
                    )}
                  </div>

                  {/* Menu Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                    {/* 1 – Administration */}
                    <Section title="Administration" icon="🛡️" color="amber">
                      <Group label="Access Control" color="amber">
                        <MenuButton title="Users" iconPath={I("account-group")} onClick={()=>nav("users")}/>
                        <MenuButton title="Roles" iconPath={I("shield-account")} onClick={()=>nav("roles")}/>
                        <MenuButton title="Permissions" iconPath={I("key-chain")} onClick={()=>nav("permissions")} badge={permBadge||undefined}/>
                      </Group>
                      <Group label="System" color="amber">
                        <MenuButton title="Audit Log" iconPath={I("clipboard-text-clock")} onClick={()=>nav("audit-log")} badge="6"/>
                        <MenuButton title="Settings" iconPath={I("cog")} onClick={()=>nav("settings")}/>
                      </Group>
                    </Section>

                    {/* 2 – Data Setup */}
                    <Section title="Data Setup" icon="⚙️" color="blue">
                      <Group label="Factory" color="blue">
                        <MenuButton title="Departments" iconPath={I("domain")} onClick={()=>nav("departments")}/>
                        <MenuButton title="Prod. Lines" iconPath={I("source-branch")} onClick={()=>nav("production-lines")}/>
                        <MenuButton title="Shifts" iconPath={I("clock-time-four")} onClick={()=>nav("shifts")}/>
                      </Group>
                      <Group label="Products" color="blue">
                        <MenuButton title="Products" iconPath={I("tshirt-crew")} onClick={()=>nav("products")}/>
                        <MenuButton title="Materials" iconPath={I("layers")} onClick={()=>nav("materials")}/>
                        <MenuButton title="Standards" iconPath={I("ruler")} onClick={()=>nav("standards")}/>
                      </Group>
                    </Section>

                    {/* 3 – Production */}
                    <Section title="Production" icon="🏗️" color="green">
                      <Group label="Planning" color="green">
                        <MenuButton title="Work Orders" iconPath={I("clipboard-list")} onClick={()=>nav("work-orders")} badge="3"/>
                        <MenuButton title="Schedule" iconPath={I("calendar-month")} onClick={()=>nav("schedule")}/>
                      </Group>
                      <Group label="Monitoring" color="green">
                        <MenuButton title="Real-time" iconPath={I("monitor-eye")} onClick={()=>nav("realtime")}/>
                        <MenuButton title="TV Display" iconPath={I("television-play")} onClick={()=>nav("tv")}/>
                      </Group>
                    </Section>

                    {/* 4 – Quality */}
                    <Section title="Quality Control" icon="🔬" color="rose">
                      <Group label="Inspection" color="rose">
                        <MenuButton title="Inspections" iconPath={I("magnify-scan")} onClick={()=>nav("inspections")}/>
                        <MenuButton title="Defects" iconPath={I("alert-circle")} onClick={()=>nav("defects")} badge="2"/>
                      </Group>
                      <Group label="Reports" color="rose">
                        <MenuButton title="Dashboard" iconPath={I("view-dashboard")} onClick={()=>nav("dashboard")}/>
                        <MenuButton title="Reports" iconPath={I("chart-bar")} onClick={()=>nav("reports")}/>
                      </Group>
                    </Section>

                    {/* 5 – HR */}
                    <Section title="Human Resources" icon="👷" color="violet">
                      <Group label="Workforce" color="violet">
                        <MenuButton title="Employees" iconPath={I("account-hard-hat")} onClick={()=>nav("employees")}/>
                        <MenuButton title="Attendance" iconPath={I("calendar-check")} onClick={()=>nav("attendance")}/>
                      </Group>
                      <Group label="Compensation" color="violet">
                        <MenuButton title="Leave" iconPath={I("beach")} onClick={()=>nav("leave")}/>
                        <MenuButton title="Payroll" iconPath={I("cash-multiple")} onClick={()=>nav("payroll")}/>
                      </Group>
                    </Section>

                    {/* 6 – Procurement */}
                    <Section title="Procurement" icon="📦" color="teal">
                      <Group label="Partners" color="teal">
                        <MenuButton title="Suppliers" iconPath={I("factory")} onClick={()=>nav("suppliers")}/>
                        <MenuButton title="Buyers" iconPath={I("handshake")} onClick={()=>nav("buyers")}/>
                      </Group>
                      <Group label="Orders" color="teal">
                        <MenuButton title="Purchase PO" iconPath={I("package-variant")} onClick={()=>nav("purchase-orders")}/>
                        <MenuButton title="Shipments" iconPath={I("ferry")} onClick={()=>nav("shipments")}/>
                      </Group>
                    </Section>

                    {/* 7 – Finance */}
                    <Section title="Finance" icon="💰" color="violet">
                      <Group label="Costing" color="violet">
                        <MenuButton title="Cost Sheet" iconPath={I("calculator")} onClick={()=>nav("costing")}/>
                      </Group>
                    </Section>

                    {/* 8 – Maintenance */}
                    <Section title="Maintenance" icon="🔧" color="orange">
                      <Group label="Assets" color="orange">
                        <MenuButton title="Machines" iconPath={I("tools")} onClick={()=>nav("machines")}/>
                      </Group>
                    </Section>

                  </div>
                </>
            )}
          </div>
        </div>
      </>
  );
}