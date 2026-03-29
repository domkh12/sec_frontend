import { useState, useEffect, useRef } from "react";

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
const PERMISSION_TYPES = ["System Access","Module Access","Data Export","Report Access","Override Authority","Special Operation","Admin Privilege","Temporary Elevation"];
const INITIAL_PERMISSIONS = [
  { id:"PR-001", worker:"Malis Heng", dept:"Sewing", position:"Machine Operator", type:"Module Access", module:"Quality", fromDate:"2026-03-06", toDate:"2026-03-20", reason:"Requested to view defect reports for Line A1 improvement project", status:"Approved", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 08:00", note:"Read-only access approved for 2 weeks." },
  { id:"PR-002", worker:"Dara Pich", dept:"Production", position:"Supervisor", type:"Data Export", module:"Production", fromDate:"2026-03-05", toDate:"2026-03-05", reason:"Monthly KPI report export for management meeting", status:"Approved", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 07:30", note:"One-time export approved." },
  { id:"PR-003", worker:"Bopha Ly", dept:"Cutting", position:"Cutter", type:"Override Authority", module:"Work Orders", fromDate:"2026-03-07", toDate:"2026-03-10", reason:"Requested to update cutting targets while supervisor is on leave", status:"Pending", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 09:00", note:"" },
  { id:"PR-004", worker:"Ratha Sok", dept:"Quality", position:"QC Inspector", type:"System Access", module:"HR", fromDate:"2026-03-10", toDate:"2026-03-31", reason:"Assisting HR with attendance audit for QC department", status:"Rejected", enteredBy:"Sophea Keo", enteredAt:"2026-03-04 14:00", note:"Not permitted. Coordinate through HR Manager." },
  { id:"PR-005", worker:"Sina Kem", dept:"Embroidery", position:"Lead Operator", type:"Report Access", module:"Finance", fromDate:"2026-03-08", toDate:"2026-03-15", reason:"Needs costing data for new embroidery style pricing proposal", status:"Pending", enteredBy:"Sophea Keo", enteredAt:"2026-03-05 10:00", note:"" },
];

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
// BASE COMPONENTS
// ═══════════════════════════════════════════════════════════════
function GlassCard({ children, color="amber", className="" }) {
  const a = ACCENT[color];
  return (
      <div className={`relative rounded-2xl overflow-hidden p-5 ${className}`}
           style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)", backdropFilter:"blur(20px)", border:`1px solid ${a.border}`, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.1),0 8px 32px rgba(0,0,0,0.4),0 0 40px ${a.bg}` }}>
        <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${a.bar} rounded-b-full`}/>
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"/>
        {children}
      </div>
  );
}

function Badge({ children, color="amber" }) {
  const c = { amber:"bg-amber-400/20 text-amber-300 border-amber-400/30", blue:"bg-blue-400/20 text-blue-300 border-blue-400/30", green:"bg-emerald-400/20 text-emerald-300 border-emerald-400/30", rose:"bg-rose-400/20 text-rose-300 border-rose-400/30", violet:"bg-violet-400/20 text-violet-300 border-violet-400/30", cyan:"bg-cyan-400/20 text-cyan-300 border-cyan-400/30", orange:"bg-orange-400/20 text-orange-300 border-orange-400/30", gray:"bg-white/10 text-white/50 border-white/15", teal:"bg-teal-400/20 text-teal-300 border-teal-400/30" }[color]||"bg-white/10 text-white/50 border-white/15";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${c}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = { "Active":"green","Online":"green","In Progress":"blue","Resolved":"green","Paid":"green","Pass":"green","Running":"green","Delivered":"green","Confirmed":"green","Permanent":"blue","Present":"green","Approved":"green","In Transit":"blue","Scheduled":"blue","Processing":"amber","Inactive":"gray","Offline":"gray","Pending":"amber","OT":"cyan","Idle":"gray","Draft":"gray","Delayed":"rose","Open":"rose","Rework":"amber","Absent":"rose","Critical":"rose","Major":"amber","Minor":"blue","Fail":"rose","High":"rose","Medium":"amber","Low":"green","Contract":"violet","Rejected":"rose","Urgent":"rose","Normal":"blue","Completed":"green" };
  return <Badge color={map[status]||"gray"}>{status}</Badge>;
}

function ProgressBar({ value, showLabel=true }) {
  const col = value>=90?"#34d399":value>=75?"#60a5fa":value>=50?"#fbbf24":"#fb7185";
  return (
      <div className="flex items-center gap-2 min-w-[90px]">
        <div className="flex-1 h-1.5 rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all duration-500" style={{ width:`${Math.min(value,100)}%`, background:col }}/>
        </div>
        {showLabel && <span className="text-[10px] font-semibold w-8 text-right" style={{ color:col }}>{value}%</span>}
      </div>
  );
}

function Stars({ rating }) {
  return <span className="text-amber-400 text-xs">{"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))} <span className="text-white/40">{rating}</span></span>;
}

function StatCard({ label, value, icon, color="amber", sub, trend }) {
  const a = ACCENT[color];
  return (
      <div className="rounded-xl px-4 py-3 flex items-center gap-3"
           style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(12px)", border:`1px solid ${a.border}`, boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07)" }}>
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold leading-none" style={{ color:a.text }}>{value}</div>
          <div className="text-[10px] text-white/35 tracking-wide uppercase mt-0.5">{label}</div>
          {sub && <div className="text-[9px] text-white/25 mt-0.5">{sub}</div>}
        </div>
        {trend && <div className={`text-[10px] font-semibold ${trend>0?"text-emerald-400":"text-rose-400"}`}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</div>}
      </div>
  );
}

function PageHeader({ title, subtitle, icon, onBack, color="amber", actions }) {
  const a = ACCENT[color];
  return (
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors border border-white/10 hover:border-white/20 bg-white/5 shrink-0 hover:-translate-y-px active:translate-y-0 transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Back
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background:a.bg, border:`1px solid ${a.border}` }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-white/90 truncate">{title}</h2>
          <p className="text-[10px] text-white/35 uppercase tracking-widest">{subtitle}</p>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORM PRIMITIVES
// ═══════════════════════════════════════════════════════════════
function FormField({ label, required, children, hint }) {
  return (
      <div>
        <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
          {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        {children}
        {hint && <p className="text-[9px] text-white/20 mt-1">{hint}</p>}
      </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all";
const selectCls = "w-full bg-[#1a1c18] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-amber-400/50 transition-all appearance-none";

// ═══════════════════════════════════════════════════════════════
// TABLE
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════
function Modal({ title, subtitle, icon, accentColor="amber", onClose, children, maxW="max-w-lg" }) {
  const a = ACCENT[accentColor];
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.78)", backdropFilter:"blur(10px)" }}>
        <div className={`relative w-full ${maxW} max-h-[92vh] overflow-y-auto rounded-3xl`}
             style={{ background:"linear-gradient(145deg,rgba(28,26,18,0.98),rgba(18,20,16,0.99))", border:`1px solid ${a.border}`, boxShadow:`0 40px 100px rgba(0,0,0,0.8),0 0 80px ${a.bg}` }}>
          <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${a.bar} rounded-b-full`}/>
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background:a.bg, border:`1px solid ${a.border}` }}>{icon}</div>
              <div>
                <h3 className="text-sm font-bold text-white/90">{title}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all text-xl leading-none">×</button>
          </div>
          {children}
        </div>
      </div>
  );
}

function SavedState({ message="Changes Saved", accentColor="green" }) {
  const a = ACCENT[accentColor];
  return (
      <div className="flex flex-col items-center py-14 px-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background:a.bg, border:`1px solid ${a.border}` }}>✅</div>
        <p className="text-sm font-semibold" style={{ color:a.text }}>{message}</p>
      </div>
  );
}

function ConfirmDeleteModal({ title, desc, onClose, onConfirm }) {
  return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.82)", backdropFilter:"blur(12px)" }}>
        <div className="relative w-full max-w-sm rounded-3xl overflow-hidden"
             style={{ background:"linear-gradient(145deg,rgba(28,26,18,0.98),rgba(18,20,16,0.99))", border:"1px solid rgba(251,113,133,0.3)", boxShadow:"0 40px 100px rgba(0,0,0,0.8)" }}>
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-rose-400/60 to-rose-300/20 rounded-b-full"/>
          <div className="px-6 py-6 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background:"rgba(251,113,133,0.15)", border:"1px solid rgba(251,113,133,0.3)" }}>🗑️</div>
            <h3 className="text-sm font-bold text-white/90 mb-1">{title}</h3>
            {desc && <p className="text-xs text-white/40 mb-4">{desc}</p>}
            <p className="text-[11px] text-rose-300/70 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all" style={{ background:"rgba(251,113,133,0.2)", border:"1px solid rgba(251,113,133,0.4)", color:"#fb7185" }}>🗑 Delete</button>
            </div>
          </div>
        </div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SEARCH + FILTER
// ═══════════════════════════════════════════════════════════════
function SearchBar({ value, onChange, placeholder="Search…" }) {
  return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none">🔍</span>
        <input type="text" placeholder={placeholder} className={inputCls} style={{ paddingLeft:"2rem" }} value={value} onChange={e=>onChange(e.target.value)}/>
        {value && <button onClick={()=>onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-lg leading-none">×</button>}
      </div>
  );
}

function FilterSelect({ value, onChange, options, allLabel="All" }) {
  return (
      <div className="relative">
        <select className="bg-[#1a1c18] border border-white/15 rounded-xl px-3 py-1.5 text-[11px] text-white/60 focus:outline-none focus:border-amber-400/40 transition-all appearance-none pr-6"
                value={value} onChange={e=>onChange(e.target.value)}>
          <option value="All">{allLabel}</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none text-[9px]">▼</span>
      </div>
  );
}

function FilterPills({ options, value, onChange }) {
  return (
      <div className="flex gap-1.5 flex-wrap">
        {options.map(o=>(
            <button key={o.label} onClick={()=>onChange(o.value)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${value===o.value ? "bg-amber-400/20 border-amber-400/40 text-amber-300" : "bg-white/5 border-white/8 text-white/30 hover:text-white/50 hover:bg-white/8"}`}>
              {o.label}
            </button>
        ))}
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ALL_DEPTS
// ═══════════════════════════════════════════════════════════════
const ALL_DEPTS = ["IT", "Production", ...DATA.departments.map(d => d.name)];

// ═══════════════════════════════════════════════════════════════
// USERS PAGE
// ═══════════════════════════════════════════════════════════════
function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleSave = () => { onSave(form); setSaved(true); setTimeout(()=>onClose(),1400); };
  return (
      <Modal title="Edit User" subtitle={`ID: ${user.id}`} icon="✏️" accentColor="amber" onClose={onClose}>
        {saved ? <SavedState message="User Updated"/> : (
            <div className="px-6 pb-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Full Name" required><input type="text" className={inputCls} value={form.name} onChange={e=>set("name",e.target.value)}/></FormField>
                <FormField label="Email" required><input type="email" className={inputCls} value={form.email} onChange={e=>set("email",e.target.value)}/></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Role"><div className="relative"><select className={selectCls} value={form.role} onChange={e=>set("role",e.target.value)}>{DATA.roles.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                <FormField label="Department"><div className="relative"><select className={selectCls} value={form.dept} onChange={e=>set("dept",e.target.value)}>{ALL_DEPTS.map(d=><option key={d} value={d}>{d}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
              </div>
              <FormField label="Status">
                <div className="flex gap-2">
                  {["Active","Inactive"].map(s=>(
                      <button key={s} onClick={()=>set("status",s)} className={`flex-1 py-2 rounded-xl text-[11px] font-medium border transition-all ${form.status===s ? s==="Active"?"bg-emerald-400/20 border-emerald-400/40 text-emerald-300":"bg-rose-400/20 border-rose-400/40 text-rose-300" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/8"}`}>{s==="Active"?"✓":"🔒"} {s}</button>
                  ))}
                </div>
              </FormField>
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} className="flex-grow-[2] py-2.5 rounded-xl text-xs font-semibold" style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.28),rgba(251,191,36,0.12))", border:"1px solid rgba(251,191,36,0.4)", color:"#fbbf24" }}>💾 Save Changes</button>
              </div>
            </div>
        )}
      </Modal>
  );
}

function AddUserModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name:"", email:"", role:"", dept:"", status:"Active" });
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.name && form.email && form.role && form.dept;
  const handleSave = () => { if(!valid) return; onSave(form); setSaved(true); setTimeout(()=>onClose(),1400); };
  return (
      <Modal title="Add New User" subtitle="System Access Account" icon="➕" accentColor="blue" onClose={onClose}>
        {saved ? <SavedState message="User Added" accentColor="green"/> : (
            <div className="px-6 pb-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Full Name" required><input type="text" className={inputCls} placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/></FormField>
                <FormField label="Email" required><input type="email" className={inputCls} placeholder="user@sec.com" value={form.email} onChange={e=>set("email",e.target.value)}/></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Role" required><div className="relative"><select className={selectCls} value={form.role} onChange={e=>set("role",e.target.value)}><option value="">Select role…</option>{DATA.roles.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                <FormField label="Department" required><div className="relative"><select className={selectCls} value={form.dept} onChange={e=>set("dept",e.target.value)}><option value="">Select dept…</option>{ALL_DEPTS.map(d=><option key={d} value={d}>{d}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
              </div>
              <FormField label="Status">
                <div className="flex gap-2">
                  {["Active","Inactive"].map(s=>(
                      <button key={s} onClick={()=>set("status",s)} className={`flex-1 py-2 rounded-xl text-[11px] font-medium border transition-all ${form.status===s ? s==="Active"?"bg-emerald-400/20 border-emerald-400/40 text-emerald-300":"bg-rose-400/20 border-rose-400/40 text-rose-300" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/8"}`}>{s==="Active"?"✓":"🔒"} {s}</button>
                  ))}
                </div>
              </FormField>
              {!valid && <p className="text-[10px] text-white/20 text-center">Fill in all required fields</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={!valid} className="flex-grow-[2] py-2.5 rounded-xl text-xs font-semibold disabled:opacity-25 disabled:cursor-not-allowed" style={{ background:"linear-gradient(135deg,rgba(96,165,250,0.28),rgba(96,165,250,0.12))", border:"1px solid rgba(96,165,250,0.4)", color:"#60a5fa" }}>➕ Add User</button>
              </div>
            </div>
        )}
      </Modal>
  );
}

function UsersPage({ onBack }) {
  const [users, setUsers] = useState(DATA.users);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const allRoles = DATA.roles.map(r=>r.name);
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q))
        && (filterRole==="All" || u.role===filterRole) && (filterDept==="All" || u.dept===filterDept) && (filterStatus==="All" || u.status===filterStatus);
  });
  const hasFilters = search || filterRole!=="All" || filterDept!=="All" || filterStatus!=="All";
  return (
      <div>
        {editUser && <EditUserModal user={editUser} onClose={()=>setEditUser(null)} onSave={f=>{setUsers(us=>us.map(u=>u.id===f.id?{...u,...f}:u));setEditUser(null);}}/>}
        {deleteUser && <ConfirmDeleteModal title="Delete User?" desc={`${deleteUser.name} — ${deleteUser.role}`} onClose={()=>setDeleteUser(null)} onConfirm={()=>{setUsers(us=>us.filter(u=>u.id!==deleteUser.id));setDeleteUser(null);}}/>}
        {showAdd && <AddUserModal onClose={()=>setShowAdd(false)} onSave={f=>{setUsers(us=>[{...f,id:Math.max(...us.map(u=>u.id))+1,lastLogin:"Never"},...us]);}}/>}
        <PageHeader title="User Management" subtitle="Administration • Access Control" icon="👥" onBack={onBack} color="amber"
                    actions={<button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all" style={{ background:"linear-gradient(135deg,rgba(96,165,250,0.25),rgba(96,165,250,0.1))", border:"1px solid rgba(96,165,250,0.4)", color:"#60a5fa" }}>➕ Add User</button>}/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Users" value={users.length} icon="👤" color="amber"/>
          <StatCard label="Active" value={users.filter(u=>u.status==="Active").length} icon="✅" color="green"/>
          <StatCard label="Inactive" value={users.filter(u=>u.status==="Inactive").length} icon="🔒" color="rose"/>
          <StatCard label="Roles" value={DATA.roles.length} icon="🛡️" color="blue"/>
        </div>
        <div className="rounded-2xl p-4 mb-4 space-y-3" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, role, department…"/>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-white/25 uppercase tracking-widest shrink-0">Filter:</span>
            <FilterSelect value={filterRole} onChange={setFilterRole} options={allRoles} allLabel="All Roles"/>
            <FilterSelect value={filterDept} onChange={setFilterDept} options={ALL_DEPTS} allLabel="All Depts"/>
            <FilterPills options={[{label:"All",value:"All"},{label:"Active",value:"Active"},{label:"Inactive",value:"Inactive"}]} value={filterStatus} onChange={setFilterStatus}/>
            {hasFilters && <button onClick={()=>{setSearch("");setFilterRole("All");setFilterDept("All");setFilterStatus("All");}} className="px-2.5 py-1 rounded-lg text-[10px] text-white/30 hover:text-white/60 border border-white/8 hover:border-white/20 transition-all">✕ Clear</button>}
            <span className="ml-auto text-[10px] text-white/25"><span className="text-white/50 font-medium">{filtered.length}</span> of {users.length} users{hasFilters&&<span className="text-amber-400/50 ml-1">(filtered)</span>}</span>
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map(u=>{
            const ac = u.status==="Active" ? ACCENT.green : ACCENT.rose;
            const initials = u.name.split(" ").map(w=>w[0]).join("").slice(0,2);
            return (
                <div key={u.id} className="relative rounded-2xl overflow-hidden transition-all hover:-translate-y-px group" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))", border:`1px solid ${ac.border}` }}>
                  <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${ac.bar}`}/>
                  <div className="flex items-center gap-4 px-4 py-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0" style={{ background:ac.bg, border:`1px solid ${ac.border}`, color:ac.text }}>{initials}</div>
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-x-4 items-center">
                      <div><p className="text-xs font-semibold text-white/90 truncate">{u.name}</p><p className="text-[10px] text-white/40 truncate font-mono">{u.email}</p></div>
                      <div className="flex items-center gap-2 mt-1 md:mt-0"><Badge color="amber">{u.role}</Badge><Badge color="blue">{u.dept}</Badge></div>
                      <div className="hidden md:block"><p className="text-[10px] text-white/30">Last login</p><p className="text-[11px] text-white/55">{u.lastLogin}</p></div>
                      <div><StatusBadge status={u.status}/></div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>setEditUser(u)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all hover:-translate-y-px" style={{ background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24" }}>✏️ Edit</button>
                      <button onClick={()=>setDeleteUser(u)} className="px-2.5 py-1.5 rounded-lg text-[11px] border transition-all hover:-translate-y-px" style={{ background:"rgba(251,113,133,0.1)", border:"1px solid rgba(251,113,133,0.25)", color:"#fb7185" }}>🗑</button>
                    </div>
                  </div>
                </div>
            );
          })}
          {filtered.length===0 && (
              <div className="text-center py-14">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-sm text-white/30">No users match your search</p>
                {hasFilters && <button onClick={()=>{setSearch("");setFilterRole("All");setFilterDept("All");setFilterStatus("All");}} className="mt-3 text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors">Clear filters</button>}
              </div>
          )}
        </div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORK ORDERS PAGE
// ═══════════════════════════════════════════════════════════════
function AddWorkOrderModal({ onClose, onSave }) {
  const [form, setForm] = useState({ product:"", buyer:"", qty:"", due:"", line:"", status:"Pending", done:0, priority:"Medium" });
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.product && form.buyer && form.qty && form.due && form.line;
  const handleSave = () => { if(!valid) return; onSave(form); setSaved(true); setTimeout(()=>onClose(),1400); };
  return (
      <Modal title="New Work Order" subtitle="Production Planning" icon="📋" accentColor="green" onClose={onClose}>
        {saved ? <SavedState message="Work Order Created" accentColor="green"/> : (
            <div className="px-6 pb-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Product" required><div className="relative"><select className={selectCls} value={form.product} onChange={e=>set("product",e.target.value)}><option value="">Select product…</option>{DATA.products.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                <FormField label="Buyer" required><div className="relative"><select className={selectCls} value={form.buyer} onChange={e=>set("buyer",e.target.value)}><option value="">Select buyer…</option>{DATA.buyers.map(b=><option key={b.id} value={b.name}>{b.name}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Quantity" required><input type="number" className={inputCls} placeholder="e.g. 5000" value={form.qty} onChange={e=>set("qty",e.target.value)}/></FormField>
                <FormField label="Due Date" required><input type="date" className={inputCls} value={form.due} onChange={e=>set("due",e.target.value)} style={{ colorScheme:"dark" }}/></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Line" required><div className="relative"><select className={selectCls} value={form.line} onChange={e=>set("line",e.target.value)}><option value="">Select line…</option>{DATA.productionLines.map(l=><option key={l.id} value={l.name}>{l.name} ({l.dept})</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                <FormField label="Priority"><div className="relative"><select className={selectCls} value={form.priority} onChange={e=>set("priority",e.target.value)}><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
              </div>
              {!valid && <p className="text-[10px] text-white/20 text-center">Fill in all required fields</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={!valid} className="flex-grow-[2] py-2.5 rounded-xl text-xs font-semibold disabled:opacity-25" style={{ background:"linear-gradient(135deg,rgba(52,211,153,0.25),rgba(52,211,153,0.1))", border:"1px solid rgba(52,211,153,0.4)", color:"#34d399" }}>📋 Create Order</button>
              </div>
            </div>
        )}
      </Modal>
  );
}

function EditWorkOrderModal({ wo, onClose, onSave }) {
  const [form, setForm] = useState({ ...wo });
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleSave = () => { onSave(form); setSaved(true); setTimeout(()=>onClose(),1400); };
  return (
      <Modal title="Edit Work Order" subtitle={wo.id} icon="✏️" accentColor="green" onClose={onClose}>
        {saved ? <SavedState message="Work Order Updated" accentColor="green"/> : (
            <div className="px-6 pb-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Status"><div className="relative"><select className={selectCls} value={form.status} onChange={e=>set("status",e.target.value)}>{["Pending","In Progress","Delayed","Completed"].map(s=><option key={s} value={s}>{s}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                <FormField label="Priority"><div className="relative"><select className={selectCls} value={form.priority} onChange={e=>set("priority",e.target.value)}>{["Critical","High","Medium","Low"].map(p=><option key={p} value={p}>{p}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Done (pcs)"><input type="number" className={inputCls} value={form.done} onChange={e=>set("done",Number(e.target.value))}/></FormField>
                <FormField label="Due Date"><input type="date" className={inputCls} value={form.due} onChange={e=>set("due",e.target.value)} style={{ colorScheme:"dark" }}/></FormField>
              </div>
              <FormField label="Line"><div className="relative"><select className={selectCls} value={form.line} onChange={e=>set("line",e.target.value)}>{DATA.productionLines.map(l=><option key={l.id} value={l.name}>{l.name}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} className="flex-grow-[2] py-2.5 rounded-xl text-xs font-semibold" style={{ background:"linear-gradient(135deg,rgba(52,211,153,0.25),rgba(52,211,153,0.1))", border:"1px solid rgba(52,211,153,0.4)", color:"#34d399" }}>💾 Save Changes</button>
              </div>
            </div>
        )}
      </Modal>
  );
}

function WorkOrdersPage({ onBack }) {
  const [orders, setOrders] = useState(DATA.workOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [editWO, setEditWO] = useState(null);
  const [deleteWO, setDeleteWO] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState("cards");
  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || o.buyer.toLowerCase().includes(q) || o.line.toLowerCase().includes(q))
        && (filterStatus==="All" || o.status===filterStatus) && (filterPriority==="All" || o.priority===filterPriority);
  });
  const statusColor = { "In Progress":"blue", Pending:"amber", Delayed:"rose", Completed:"green" };
  const addOrder = (form) => { const newId = `WO-2026-00${orders.length+1}`; setOrders(os=>[{ ...form, id:newId, qty:Number(form.qty), done:0 }, ...os]); };
  return (
      <div>
        {editWO && <EditWorkOrderModal wo={editWO} onClose={()=>setEditWO(null)} onSave={f=>{setOrders(os=>os.map(o=>o.id===f.id?{...o,...f}:o));setEditWO(null);}}/>}
        {deleteWO && <ConfirmDeleteModal title="Delete Work Order?" desc={`${deleteWO.id} — ${deleteWO.product}`} onClose={()=>setDeleteWO(null)} onConfirm={()=>{setOrders(os=>os.filter(o=>o.id!==deleteWO.id));setDeleteWO(null);}}/>}
        {showAdd && <AddWorkOrderModal onClose={()=>setShowAdd(false)} onSave={addOrder}/>}
        <PageHeader title="Work Orders" subtitle="Production • Planning" icon="📋" onBack={onBack} color="green"
                    actions={<button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all" style={{ background:"linear-gradient(135deg,rgba(52,211,153,0.25),rgba(52,211,153,0.1))", border:"1px solid rgba(52,211,153,0.4)", color:"#34d399" }}>+ New Order</button>}/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="In Progress" value={orders.filter(w=>w.status==="In Progress").length} icon="⚙️" color="blue"/>
          <StatCard label="Pending" value={orders.filter(w=>w.status==="Pending").length} icon="⏳" color="amber"/>
          <StatCard label="Delayed" value={orders.filter(w=>w.status==="Delayed").length} icon="⚠️" color="rose"/>
          <StatCard label="Total Qty" value={orders.reduce((s,w)=>s+Number(w.qty),0).toLocaleString()} icon="👕" color="green"/>
        </div>
        <div className="rounded-2xl p-4 mb-4 space-y-3" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by order ID, product, buyer, line…"/>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect value={filterStatus} onChange={setFilterStatus} options={["In Progress","Pending","Delayed","Completed"]} allLabel="All Status"/>
            <FilterSelect value={filterPriority} onChange={setFilterPriority} options={["Critical","High","Medium","Low"]} allLabel="All Priority"/>
            {(search||filterStatus!=="All"||filterPriority!=="All") && <button onClick={()=>{setSearch("");setFilterStatus("All");setFilterPriority("All");}} className="px-2.5 py-1 rounded-lg text-[10px] text-white/30 hover:text-white/60 border border-white/8 transition-all">✕ Clear</button>}
            <div className="ml-auto flex items-center gap-1.5">
              {["cards","table"].map(v=>(
                  <button key={v} onClick={()=>setView(v)} className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${view===v?"bg-green-400/20 border-green-400/40 text-green-300":"bg-white/5 border-white/8 text-white/30 hover:bg-white/8"}`}>{v==="cards"?"⊞ Cards":"☰ Table"}</button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-white/25 block"><span className="text-white/50 font-medium">{filtered.length}</span> of {orders.length} orders</span>
        </div>
        {view==="cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(wo=>{
                const pct = wo.qty>0 ? Math.round(wo.done/wo.qty*100) : 0;
                const sc = statusColor[wo.status]||"gray"; const a = ACCENT[sc];
                return (
                    <div key={wo.id} className="relative rounded-2xl overflow-hidden group" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))", border:`1px solid ${a.border}`, transition:"transform 0.15s ease" }}
                         onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.bar}`}/>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div><div className="flex items-center gap-2 mb-1"><span className="font-mono text-[10px] text-white/30">{wo.id}</span><StatusBadge status={wo.priority}/></div><p className="text-sm font-bold text-white/90">{wo.product}</p><p className="text-[11px] text-white/45 mt-0.5">{wo.buyer} · {wo.line}</p></div>
                          <StatusBadge status={wo.status}/>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] text-white/40 mb-1.5"><span>Progress</span><span className="font-semibold" style={{ color:pct>=90?"#34d399":pct>=60?"#60a5fa":"#fbbf24" }}>{wo.done.toLocaleString()} / {Number(wo.qty).toLocaleString()} pcs</span></div>
                          <div className="w-full h-2 rounded-full bg-white/10"><div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background:pct>=90?"#34d399":pct>=60?"#60a5fa":pct>=30?"#fbbf24":"#fb7185" }}/></div>
                          <div className="text-right text-[10px] font-bold mt-1" style={{ color:pct>=90?"#34d399":pct>=60?"#60a5fa":"#fbbf24" }}>{pct}%</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] text-white/35"><span>📅</span><span>Due: <span className="text-white/60">{wo.due}</span></span></div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>setEditWO(wo)} className="px-2 py-1 rounded-lg text-[10px] border transition-all" style={{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.25)", color:"#fbbf24" }}>✏️ Edit</button>
                            <button onClick={()=>setDeleteWO(wo)} className="px-2 py-1 rounded-lg text-[10px] border transition-all" style={{ background:"rgba(251,113,133,0.08)", border:"1px solid rgba(251,113,133,0.2)", color:"#fb7185" }}>🗑</button>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
        {view==="table" && (
            <GlassCard color="green">
              <Table color="green" cols={["Order ID","Product","Buyer","Qty","Done","Progress","Line","Due","Priority","Status",""]}
                     rows={filtered.map(wo=>[
                       <span className="font-mono text-green-300 text-[10px]">{wo.id}</span>,
                       wo.product, wo.buyer, Number(wo.qty).toLocaleString(), wo.done.toLocaleString(),
                       <ProgressBar value={wo.qty>0?Math.round(wo.done/wo.qty*100):0}/>,
                       wo.line, wo.due, <StatusBadge status={wo.priority}/>, <StatusBadge status={wo.status}/>,
                       <div className="flex gap-1"><button onClick={()=>setEditWO(wo)} className="px-2 py-0.5 rounded text-[10px]" style={{ background:"rgba(251,191,36,0.1)", color:"#fbbf24" }}>✏️</button><button onClick={()=>setDeleteWO(wo)} className="px-2 py-0.5 rounded text-[10px]" style={{ background:"rgba(251,113,133,0.1)", color:"#fb7185" }}>🗑</button></div>
                     ])}/>
            </GlassCard>
        )}
        {filtered.length===0 && <div className="text-center py-14"><p className="text-3xl mb-3">📋</p><p className="text-sm text-white/30">No work orders match your filter</p></div>}
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHEDULE PAGE
// ═══════════════════════════════════════════════════════════════
function SchedulePage({ onBack }) {
  const [activeWO, setActiveWO] = useState(null);
  const weekDates = [
    { label:"Mon", date:"Mar 03", iso:"2026-03-03", past:true },
    { label:"Tue", date:"Mar 04", iso:"2026-03-04", past:true },
    { label:"Wed", date:"Mar 05", iso:"2026-03-05", today:true },
    { label:"Thu", date:"Mar 06", iso:"2026-03-06" },
    { label:"Fri", date:"Mar 07", iso:"2026-03-07" },
    { label:"Sat", date:"Mar 08", iso:"2026-03-08" },
  ];
  const lineToWO = {};
  DATA.workOrders.forEach(wo => { if (!lineToWO[wo.line]) lineToWO[wo.line] = []; lineToWO[wo.line].push(wo); });
  const getCellState = (line, day) => {
    const wos = lineToWO[line.name] || []; if (!wos.length) return { state:"idle", wo:null };
    const wo = wos[0];
    if (day.past) return { state:"done", wo }; if (day.today) return { state:"active", wo };
    if (wo.status==="Delayed") return { state:"delayed", wo }; return { state:"planned", wo };
  };
  const cellStyle = (state) => {
    switch(state) {
      case "done":    return { bg:"rgba(255,255,255,0.06)", text:"rgba(255,255,255,0.35)", label:"Done", dot:"#34d399" };
      case "active":  return { bg:"rgba(52,211,153,0.18)", text:"#34d399", label:"Today", dot:"#34d399" };
      case "delayed": return { bg:"rgba(251,113,133,0.15)", text:"#fb7185", label:"Delayed", dot:"#fb7185" };
      case "planned": return { bg:"rgba(96,165,250,0.12)", text:"#60a5fa", label:"Plan", dot:"#60a5fa" };
      default:        return { bg:"rgba(255,255,255,0.03)", text:"rgba(255,255,255,0.15)", label:"—", dot:"transparent" };
    }
  };
  const priorityGlyph = { Critical:"🔴", High:"🟠", Medium:"🟡", Low:"🟢" };
  return (
      <div>
        {activeWO && (
            <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)" }} onClick={()=>setActiveWO(null)}>
              <div className="relative w-full max-w-sm rounded-2xl p-5" style={{ background:"linear-gradient(145deg,rgba(22,24,18,0.98),rgba(14,16,12,0.99))", border:"1px solid rgba(52,211,153,0.3)" }} onClick={e=>e.stopPropagation()}>
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-green-400/60 to-green-300/20 rounded-b-full"/>
                <button onClick={()=>setActiveWO(null)} className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 text-xl">×</button>
                <p className="font-mono text-[10px] text-white/30 mb-1">{activeWO.id}</p>
                <p className="text-sm font-bold text-white/90 mb-0.5">{activeWO.product}</p>
                <p className="text-[11px] text-white/45 mb-3">{activeWO.buyer} · {activeWO.line}</p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs"><span className="text-white/40">Total Qty</span><span className="text-white/80">{activeWO.qty.toLocaleString()} pcs</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Completed</span><span className="text-green-400">{activeWO.done.toLocaleString()} pcs</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Due Date</span><span className="text-white/80">{activeWO.due}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Priority</span><StatusBadge status={activeWO.priority}/></div>
                </div>
                <ProgressBar value={Math.round(activeWO.done/activeWO.qty*100)}/>
              </div>
            </div>
        )}
        <PageHeader title="Production Schedule" subtitle="Production • Planning" icon="📅" onBack={onBack} color="green"/>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Week of Mar 3–8, 2026</span>
          <div className="flex items-center gap-3">
            {[{dot:"#34d399",label:"Done / Today"},{dot:"#60a5fa",label:"Planned"},{dot:"#fb7185",label:"Delayed"},{dot:"rgba(255,255,255,0.15)",label:"Idle"}].map(l=>(
                <div key={l.label} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background:l.dot }}/><span className="text-[10px] text-white/35">{l.label}</span></div>
            ))}
          </div>
        </div>
        <GlassCard color="green">
          <div className="mb-5 p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[9px] text-green-400/50 font-semibold uppercase tracking-widest mb-2">Active Work Orders This Week</p>
            <div className="flex flex-wrap gap-2">
              {DATA.workOrders.map(wo=>(
                  <button key={wo.id} onClick={()=>setActiveWO(wo)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] border transition-all hover:-translate-y-0.5" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                    <span>{priorityGlyph[wo.priority]}</span><span className="font-mono">{wo.id.split("-").pop()}</span><span className="text-white/40">{wo.product.split(" ").slice(0,2).join(" ")}</span><StatusBadge status={wo.status}/>
                  </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-separate" style={{ borderSpacing:"0 2px" }}>
              <thead>
              <tr>
                <th className="text-left px-3 py-2 text-white/40 font-semibold text-[11px] w-24 sticky left-0" style={{ background:"rgba(12,14,10,0.7)" }}>Line</th>
                {weekDates.map(d=>(
                    <th key={d.iso} className={`px-2 py-2 text-center text-[11px] font-semibold w-24 ${d.today?"text-green-400":"text-white/40"}`}>
                      <div>{d.label}</div><div className={`text-[9px] font-normal mt-0.5 ${d.today?"text-green-300/70":"text-white/20"}`}>{d.date}</div>
                      {d.today && <div className="mx-auto mt-1 w-1 h-1 rounded-full bg-green-400"/>}
                    </th>
                ))}
                <th className="text-left px-3 py-2 text-white/40 font-semibold text-[11px] min-w-[140px]">Work Order</th>
                <th className="text-left px-3 py-2 text-white/40 font-semibold text-[11px]">Progress</th>
              </tr>
              </thead>
              <tbody>
              {DATA.productionLines.map((line,i)=>{
                const wos = lineToWO[line.name] || []; const wo = wos[0] || null;
                return (
                    <tr key={i} className="group">
                      <td className="px-3 py-2 sticky left-0 rounded-l-xl" style={{ background:"rgba(12,14,10,0.5)" }}>
                        <p className="font-semibold text-green-300/80">{line.name}</p><p className="text-[9px] text-white/30">{line.dept}</p>
                      </td>
                      {weekDates.map(day=>{
                        const { state, wo:cellWO } = getCellState(line, day); const cs = cellStyle(state);
                        return (
                            <td key={day.iso} className="px-1.5 py-2 text-center">
                              <button onClick={()=>cellWO&&setActiveWO(cellWO)} className={`w-full h-10 rounded-xl text-[10px] font-medium flex items-center justify-center gap-1 transition-all ${cellWO?"hover:scale-105 cursor-pointer":"cursor-default"} ${day.today?"ring-1 ring-green-400/40":""}`} style={{ background:cs.bg, color:cs.text }}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:cs.dot }}/>{cs.label}
                              </button>
                            </td>
                        );
                      })}
                      <td className="px-3 py-2">
                        {wo ? (<button onClick={()=>setActiveWO(wo)} className="text-left hover:bg-white/5 rounded-lg p-1 transition-colors w-full"><p className="font-mono text-[9px] text-white/30">{wo.id}</p><p className="text-[11px] text-white/70 truncate max-w-[130px]">{wo.product}</p><p className="text-[9px] text-white/35">{wo.buyer}</p></button>) : <span className="text-white/15 text-[10px]">No order</span>}
                      </td>
                      <td className="px-3 py-2 rounded-r-xl min-w-[120px]">
                        {wo ? <ProgressBar value={wo.qty>0?Math.round(wo.done/wo.qty*100):0}/> : <span className="text-white/15 text-[10px]">—</span>}
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS PAGE
// ═══════════════════════════════════════════════════════════════
function HREntryModal({ onClose, onSave }) {
  const BLANK = { worker:"", dept:"", position:"", type:"", module:"", fromDate:"", toDate:"", reason:"", status:"Pending", note:"" };
  const [form, setForm] = useState(BLANK);
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const modules = ["Production","Quality","HR","Finance","Procurement","Maintenance","Administration","Reports","All Modules"];
  const valid = form.worker && form.dept && form.type && form.module && form.fromDate && form.toDate && form.reason;
  const daysDiff = (a,b)=>{ const d=new Date(b)-new Date(a); return isNaN(d)?0:Math.max(0,Math.round(d/86400000)+1); };
  const handleSave = () => { if(!valid) return; onSave(form); setSaved(true); setTimeout(()=>onClose(),1800); };
  return (
      <Modal title="Record Permission Request" subtitle="HR Entry • On Behalf of Worker" icon="🔐" accentColor="amber" onClose={onClose}>
        {saved ? <SavedState message="Record Saved" accentColor="green"/> : (
            <div className="px-6 pb-6 space-y-4">
              <div className="rounded-xl px-4 py-3" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[9px] text-amber-400/50 font-semibold uppercase tracking-widest mb-3">Worker Information</p>
                <FormField label="Worker Name" required>
                  <div className="relative">
                    <select className={selectCls} value={form.worker} onChange={e=>{ const emp=DATA.employees.find(em=>em.name===e.target.value); setForm(f=>({...f,worker:e.target.value,dept:emp?.dept||"",position:emp?.position||""})); }}>
                      <option value="">Select worker…</option>
                      {DATA.employees.map(e=><option key={e.id} value={e.name}>{e.name} — {e.position} ({e.dept})</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span>
                  </div>
                </FormField>
                {form.worker && (
                    <div className="flex items-center gap-3 rounded-xl p-3 mt-2" style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.15)" }}>
                      <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center text-sm shrink-0">👷</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white/80 truncate">{form.worker}</p><p className="text-[10px] text-white/35">{form.position} · {form.dept}</p></div>
                      <Badge color="amber">Selected</Badge>
                    </div>
                )}
              </div>
              <div className="rounded-xl px-4 py-3" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[9px] text-blue-400/50 font-semibold uppercase tracking-widest mb-3">Permission Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Permission Type" required><div className="relative"><select className={selectCls} value={form.type} onChange={e=>set("type",e.target.value)}><option value="">Select type…</option>{PERMISSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                  <FormField label="Module / Area" required><div className="relative"><select className={selectCls} value={form.module} onChange={e=>set("module",e.target.value)}><option value="">Select module…</option>{modules.map(m=><option key={m} value={m}>{m}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none text-[10px]">▼</span></div></FormField>
                </div>
              </div>
              <div className="rounded-xl px-4 py-3" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[9px] text-green-400/50 font-semibold uppercase tracking-widest mb-3">Access Period</p>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="From Date" required><input type="date" className={inputCls} value={form.fromDate} onChange={e=>set("fromDate",e.target.value)} style={{ colorScheme:"dark" }}/></FormField>
                  <FormField label="Until Date" required><input type="date" className={inputCls} value={form.toDate} onChange={e=>set("toDate",e.target.value)} style={{ colorScheme:"dark" }}/></FormField>
                </div>
                {form.fromDate&&form.toDate&&daysDiff(form.fromDate,form.toDate)>0&&(
                    <div className="mt-2 flex items-center gap-2"><span className="text-[10px] text-white/30">Duration:</span><span className="text-[10px] font-semibold text-green-400">{daysDiff(form.fromDate,form.toDate)} day(s)</span></div>
                )}
              </div>
              <div className="rounded-xl px-4 py-3" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[9px] text-violet-400/50 font-semibold uppercase tracking-widest mb-3">Reason & Notes</p>
                <div className="space-y-3">
                  <FormField label="Reason Given by Worker" required><textarea className={`${inputCls} resize-none`} rows={3} placeholder="What did the worker say they need this access for…" value={form.reason} onChange={e=>set("reason",e.target.value)}/></FormField>
                  <FormField label="HR Note (optional)"><input type="text" className={inputCls} placeholder="Internal note from HR…" value={form.note} onChange={e=>set("note",e.target.value)}/></FormField>
                </div>
              </div>
              <FormField label="Initial Status">
                <div className="flex gap-2">
                  {["Pending","Approved","Rejected"].map(s=>(
                      <button key={s} onClick={()=>set("status",s)} className={`flex-1 py-2 rounded-xl text-[11px] font-medium border transition-all ${form.status===s ? s==="Approved"?"bg-emerald-400/20 border-emerald-400/40 text-emerald-300":s==="Rejected"?"bg-rose-400/20 border-rose-400/40 text-rose-300":"bg-amber-400/20 border-amber-400/40 text-amber-300" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/8"}`}>
                        {s==="Approved"?"✓":s==="Rejected"?"✗":"⏳"} {s}
                      </button>
                  ))}
                </div>
              </FormField>
              {!valid && <p className="text-[10px] text-white/20 text-center">Fill in all required fields (*) to save</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs text-white/35 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={!valid} className="flex-grow-[2] py-2.5 rounded-xl text-xs font-semibold disabled:opacity-25 disabled:cursor-not-allowed" style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.28),rgba(251,191,36,0.12))", border:"1px solid rgba(251,191,36,0.4)", color:"#fbbf24" }}>💾 Save Record</button>
              </div>
            </div>
        )}
      </Modal>
  );
}

function PermissionsPage({ onBack }) {
  const [records, setRecords] = useState(INITIAL_PERMISSIONS);
  const [showEntry, setShowEntry] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const handleSave = (form) => { const id = `PR-${String(records.length+1).padStart(3,"0")}`; setRecords(r=>[{ ...form, id, enteredBy:"Sophea Keo", enteredAt:new Date().toISOString().slice(0,16).replace("T"," ") }, ...r]); };
  const changeStatus = (id,status) => setRecords(r=>r.map(x=>x.id===id?{...x,status}:x));
  const deleteRecord = (id) => setRecords(r=>r.filter(x=>x.id!==id));
  const daysDiff = (a,b)=>{ const d=new Date(b)-new Date(a); return isNaN(d)?0:Math.max(0,Math.round(d/86400000)+1); };
  const statusColor = { Approved:"green", Pending:"amber", Rejected:"rose" };
  const filtered = records.filter(r=>{ const q=search.toLowerCase(); return (filter==="All"||r.status===filter)&&(!q||r.worker.toLowerCase().includes(q)||r.type.toLowerCase().includes(q)||r.module.toLowerCase().includes(q)); });
  return (
      <div>
        {showEntry && <HREntryModal onClose={()=>setShowEntry(false)} onSave={handleSave}/>}
        <PageHeader title="Permission Records" subtitle="HR • Access Control Entry" icon="🔐" onBack={onBack} color="amber"
                    actions={<button onClick={()=>setShowEntry(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all" style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.25),rgba(251,191,36,0.1))", border:"1px solid rgba(251,191,36,0.4)", color:"#fbbf24" }}>+ New Entry</button>}/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total" value={records.length} icon="🔐" color="amber"/>
          <StatCard label="Pending" value={records.filter(r=>r.status==="Pending").length} icon="⏳" color="amber"/>
          <StatCard label="Approved" value={records.filter(r=>r.status==="Approved").length} icon="✅" color="green"/>
          <StatCard label="Rejected" value={records.filter(r=>r.status==="Rejected").length} icon="✗" color="rose"/>
        </div>
        <div className="rounded-2xl p-4 mb-4 space-y-3" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by worker, type, module…"/>
          <div className="flex items-center gap-2 flex-wrap">
            <FilterPills options={["All","Pending","Approved","Rejected"].map(f=>({label:f,value:f}))} value={filter} onChange={setFilter}/>
            <span className="ml-auto text-[10px] text-white/25"><span className="text-white/50 font-medium">{filtered.length}</span> records</span>
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map(rec=>{
            const sc = statusColor[rec.status]||"gray"; const a = ACCENT[sc];
            return (
                <div key={rec.id} className="relative rounded-2xl overflow-hidden hover:-translate-y-px transition-all" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))", border:`1px solid ${a.border}`, boxShadow:`0 4px 20px rgba(0,0,0,0.3)` }}>
                  <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${a.bar}`}/>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold" style={{ background:a.bg, border:`1px solid ${a.border}`, color:a.text }}>{rec.worker.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5"><span className="font-mono text-[10px] text-white/30">{rec.id}</span><StatusBadge status={rec.status}/></div>
                          <p className="text-xs font-semibold text-white/85 truncate">{rec.worker}</p>
                          <p className="text-[10px] text-white/35">{rec.position} · {rec.dept}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0"><p className="text-[11px] font-semibold text-white/65 mb-1">{rec.type}</p><Badge color="blue">{rec.module}</Badge></div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-amber-400/60">📅</span><span className="text-white/55">{rec.fromDate}</span><span className="text-white/20 mx-0.5">→</span><span className="text-white/55">{rec.toDate}</span>
                        <span className="ml-1 px-1.5 py-0.5 rounded-md text-[9px]" style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.4)" }}>{daysDiff(rec.fromDate,rec.toDate)}d</span>
                      </div>
                      <span className="text-[10px] text-white/25">by {rec.enteredBy} · {rec.enteredAt}</span>
                    </div>
                    <div className="mt-2.5 rounded-lg px-3 py-2 text-[11px] text-white/50 leading-relaxed" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-white/25 text-[9px] uppercase tracking-widest mr-2">Reason</span>{rec.reason}
                    </div>
                    {rec.note && <div className="mt-2 rounded-lg px-3 py-1.5 text-[10px] text-white/40 italic" style={{ background:"rgba(251,191,36,0.05)", border:"1px solid rgba(251,191,36,0.12)" }}>💬 {rec.note}</div>}
                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-white/25 uppercase tracking-widest mr-1">Status:</span>
                        {["Pending","Approved","Rejected"].map(s=>(
                            <button key={s} onClick={()=>changeStatus(rec.id,s)} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${rec.status===s ? s==="Approved"?"bg-emerald-400/25 border-emerald-400/40 text-emerald-300":s==="Rejected"?"bg-rose-400/25 border-rose-400/40 text-rose-300":"bg-amber-400/25 border-amber-400/40 text-amber-300" : "bg-white/5 border-white/8 text-white/25 hover:text-white/50 hover:bg-white/8"}`}>
                              {s==="Approved"?"✓":s==="Rejected"?"✗":"⏳"} {s}
                            </button>
                        ))}
                      </div>
                      <button onClick={()=>deleteRecord(rec.id)} className="px-2.5 py-1 rounded-lg text-[10px] text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-400/20 transition-all">🗑 Delete</button>
                    </div>
                  </div>
                </div>
            );
          })}
          {filtered.length===0 && <div className="text-center py-14 text-white/20 text-sm">No records found</div>}
        </div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ALL OTHER SIMPLE PAGES
// ═══════════════════════════════════════════════════════════════
function RolesPage({onBack}){return(<div><PageHeader title="Roles & Permissions" subtitle="Administration • Access Control" icon="🛡️" onBack={onBack} color="amber"/><GlassCard color="amber"><Table color="amber" cols={["#","Role","Description","Users","Permissions"]} rows={DATA.roles.map(r=>[r.id,<span className="font-semibold text-amber-300">{r.name}</span>,r.desc,r.users,<Badge color="blue">{r.permissions} perms</Badge>])}/></GlassCard></div>);}
function AuditLogPage({onBack}){return(<div><PageHeader title="Audit Log" subtitle="Administration • System" icon="📜" onBack={onBack} color="amber"/><GlassCard color="amber"><div className="space-y-2">{DATA.auditLog.map((log,i)=>(<div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"><div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 bg-amber-400/15 border border-amber-400/25">📝</div><div className="flex-1 min-w-0"><p className="text-xs text-white/80">{log.action}</p><p className="text-[10px] text-white/35 mt-0.5">{log.user} • {log.time}</p></div><Badge color="amber">{log.module}</Badge></div>))}</div></GlassCard></div>);}
function SettingsPage({onBack}){const settings=[{group:"Factory",items:[{label:"Factory Name",value:"SEC Mega Factory"},{label:"Location",value:"Phnom Penh, Cambodia"},{label:"Timezone",value:"UTC+7"}]},{group:"Production",items:[{label:"Working Days",value:"Mon – Sat"},{label:"Shifts/Day",value:"3"},{label:"OT Policy",value:"Max 2 hrs/day"}]},{group:"Notifications",items:[{label:"Defect Alert",value:"qc@sec-factory.com"},{label:"Low Stock Alert",value:"Enabled"},{label:"Delay Warning",value:"Enabled"}]},{group:"Integration",items:[{label:"ERP System",value:"SAP B1"},{label:"API Version",value:"v2.4.1"},{label:"Backup",value:"Daily 02:00"}]}];return(<div><PageHeader title="System Settings" subtitle="Administration • System" icon="⚙️" onBack={onBack} color="amber"/><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{settings.map((s,i)=>(<GlassCard key={i} color="amber"><p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-widest mb-3">{s.group}</p><div className="space-y-3">{s.items.map((item,j)=>(<div key={j} className="flex flex-col gap-0.5"><span className="text-[10px] text-white/35 uppercase tracking-wide">{item.label}</span><span className="text-xs text-white/75">{item.value}</span></div>))}</div></GlassCard>))}</div></div>);}
function DepartmentsPage({onBack}){return(<div><PageHeader title="Departments" subtitle="Data Setup • Factory Structure" icon="🏢" onBack={onBack} color="blue"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Departments" value={DATA.departments.length} icon="🏢" color="blue"/><StatCard label="Total Workers" value={STATS.totalWorkers} icon="👷" color="green"/><StatCard label="Total Lines" value={DATA.productionLines.length} icon="⚡" color="amber"/><StatCard label="Floors" value={6} icon="🏗️" color="violet"/></div><GlassCard color="blue"><Table color="blue" cols={["#","Department","Head","Floor","Lines","Workers","Status"]} rows={DATA.departments.map(d=>[d.id,<span className="font-semibold text-blue-300">{d.name}</span>,d.head,<Badge color="violet">Floor {d.floor}</Badge>,d.lines,d.workers,<StatusBadge status={d.status}/>])}/></GlassCard></div>);}
function ProductionLinesPage({onBack}){return(<div><PageHeader title="Production Lines" subtitle="Data Setup • Factory Structure" icon="🏗️" onBack={onBack} color="blue"/><GlassCard color="blue"><Table color="blue" cols={["Line","Dept","Supervisor","Workers","Target","Actual","Efficiency"]} rows={DATA.productionLines.map(l=>[<span className="font-semibold text-blue-300">{l.name}</span>,l.dept,l.supervisor,l.workers,l.target.toLocaleString(),l.actual.toLocaleString(),<ProgressBar value={l.eff}/>])}/></GlassCard></div>);}
function ProductsPage({onBack}){return(<div><PageHeader title="Products / Style" subtitle="Data Setup • Products" icon="👕" onBack={onBack} color="blue"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total Styles" value={DATA.products.length} icon="👕" color="blue"/><StatCard label="Active" value={DATA.products.filter(p=>p.status==="Active").length} icon="✅" color="green"/><StatCard label="Draft" value={DATA.products.filter(p=>p.status==="Draft").length} icon="📝" color="amber"/></div><GlassCard color="blue"><Table color="blue" cols={["Code","Style Name","Category","Buyer","SMV","Color","Status"]} rows={DATA.products.map(p=>[<span className="font-mono text-blue-300">{p.code}</span>,p.name,<Badge color="blue">{p.category}</Badge>,p.buyer,`${p.smv} min`,p.color,<StatusBadge status={p.status}/>])}/></GlassCard></div>);}
function MaterialsPage({onBack}){return(<div><PageHeader title="Materials / BOM" subtitle="Data Setup • Materials" icon="🧵" onBack={onBack} color="blue"/><div className="grid grid-cols-3 gap-3 mb-5"><StatCard label="Total Items" value={DATA.materials.length} icon="🧵" color="blue"/><StatCard label="Low Stock" value={DATA.materials.filter(m=>m.stock<m.reorder).length} icon="⚠️" color="rose"/><StatCard label="OK Stock" value={DATA.materials.filter(m=>m.stock>=m.reorder).length} icon="✅" color="green"/></div><GlassCard color="blue"><Table color="blue" cols={["Code","Material","Unit","Stock","Reorder","Cost/Unit","Supplier","Status"]} rows={DATA.materials.map(m=>[<span className="font-mono text-blue-300">{m.code}</span>,m.name,m.unit,m.stock.toLocaleString(),m.reorder.toLocaleString(),`$${m.cost}`,m.supplier,m.stock<m.reorder?<Badge color="rose">Low Stock</Badge>:<Badge color="green">OK</Badge>])}/></GlassCard></div>);}
function ShiftsPage({onBack}){return(<div><PageHeader title="Shift Management" subtitle="Data Setup • Factory Structure" icon="🕐" onBack={onBack} color="blue"/><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{DATA.shifts.map((s,i)=>(<GlassCard key={i} color="blue"><div className="text-2xl mb-2">🕐</div><h3 className="font-bold text-white/90 text-sm mb-1">{s.name}</h3><p className="text-xs text-white/40 mb-3">{s.start} – {s.end}</p><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-white/40">Days</span><span className="text-blue-300">{s.days}</span></div><div className="flex justify-between text-xs"><span className="text-white/40">Supervisor</span><span className="text-white/75">{s.supervisor}</span></div><div className="flex justify-between text-xs"><span className="text-white/40">Workers</span><span className="text-white/75">{s.workers}</span></div></div></GlassCard>))}</div></div>);}
function StandardsPage({onBack}){return(<div><PageHeader title="Operation Standards (SMV)" subtitle="Data Setup • Standards" icon="📐" onBack={onBack} color="blue"/><GlassCard color="blue"><Table color="blue" cols={["#","Product","Operation","SMV (min)","Machine","Skill Level"]} rows={DATA.standards.map((s,i)=>[i+1,s.product,s.operation,<span className="font-semibold text-blue-300">{s.smv}</span>,s.machine,<StatusBadge status={s.skill}/>])}/></GlassCard></div>);}
function RealtimePage({onBack}){return(<div><PageHeader title="Real-time Monitor" subtitle="Production • Monitoring" icon="📡" onBack={onBack} color="green"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"><StatCard label="Active Lines" value={STATS.activeLines} icon="⚡" color="green"/><StatCard label="Today Output" value={STATS.todayOutput.toLocaleString()} icon="👕" color="blue"/><StatCard label="Avg Efficiency" value={`${STATS.efficiency}%`} icon="📈" color="amber"/><StatCard label="Open Defects" value={STATS.openDefects} icon="⚠️" color="rose"/></div><GlassCard color="green"><p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Live Line Performance</p><div className="space-y-3">{DATA.productionLines.map((l,i)=>(<div key={i} className="flex items-center gap-3"><span className="w-16 text-xs text-white/60 shrink-0">{l.name}</span><div className="flex-1"><ProgressBar value={l.eff}/></div><span className="text-xs text-white/50 shrink-0 w-24 text-right">{l.actual}/{l.target} pcs</span><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:l.eff>=90?"#34d399":l.eff>=75?"#60a5fa":"#fb7185" }}/></div>))}</div></GlassCard></div>);}
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

// ═══════════════════════════════════════════════════════════════
// REPORT HELPERS + REPORT PAGES
// ═══════════════════════════════════════════════════════════════
function ReportMeta({ generated="2026-03-05 09:30", period="March 2026", preparedBy="Sophea Keo" }) {
  return (
      <div className="flex flex-wrap items-center gap-4 mb-5 px-4 py-2.5 rounded-xl text-[10px] text-white/30" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
        <span>📅 Period: <span className="text-white/55">{period}</span></span>
        <span>🕐 Generated: <span className="text-white/55">{generated}</span></span>
        <span>👤 Prepared by: <span className="text-white/55">{preparedBy}</span></span>
        <button className="ml-auto px-3 py-1 rounded-lg text-[10px] font-medium border transition-all hover:-translate-y-px" style={{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.25)", color:"#fbbf24" }}>⬇ Export PDF</button>
        <button className="px-3 py-1 rounded-lg text-[10px] font-medium border transition-all hover:-translate-y-px" style={{ background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)", color:"#34d399" }}>⬇ Export CSV</button>
      </div>
  );
}

function ReportSection({ title, color="amber", children }) {
  const a = ACCENT[color];
  return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1" style={{ background:`linear-gradient(to right, ${a.border}, transparent)` }}/>
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2" style={{ color:a.text }}>{title}</span>
          <div className="h-px flex-1" style={{ background:`linear-gradient(to left, ${a.border}, transparent)` }}/>
        </div>
        {children}
      </div>
  );
}

function MiniBar({ label, value, max, color="green" }) {
  const pct = max > 0 ? Math.round(value / max * 100) : 0;
  const col = ACCENT[color]?.text || "#34d399";
  return (
      <div className="flex items-center gap-3 py-1.5">
        <span className="text-[11px] text-white/50 w-24 shrink-0 truncate">{label}</span>
        <div className="flex-1 h-2 rounded-full bg-white/8"><div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:col }}/></div>
        <span className="text-[11px] font-semibold w-16 text-right" style={{ color:col }}>{value.toLocaleString()}</span>
        <span className="text-[9px] text-white/25 w-8 text-right">{pct}%</span>
      </div>
  );
}

function DonutChart({ segments, size=80 }) {
  const total = segments.reduce((s,x)=>s+x.value,0);
  let offset = 0;
  const r = 28, cx = 40, cy = 40, circ = 2*Math.PI*r;
  return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
        {segments.map((seg,i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dash = pct * circ; const gap = circ - dash;
          const el = (<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="10" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset * circ} strokeLinecap="butt" style={{ transform:"rotate(-90deg)", transformOrigin:"40px 40px" }}/>);
          offset += pct; return el;
        })}
      </svg>
  );
}

function SummaryRow({ label, value, sub, highlight }) {
  return (
      <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <span className="text-[11px] text-white/50">{label}</span>
        <div className="text-right"><span className={`text-xs font-semibold ${highlight||"text-white/80"}`}>{value}</span>{sub && <span className="text-[9px] text-white/30 ml-2">{sub}</span>}</div>
      </div>
  );
}

function ProductionReportPage({ onBack }) {
  const totalTarget = DATA.productionLines.reduce((s,l)=>s+l.target,0);
  const totalActual = DATA.productionLines.reduce((s,l)=>s+l.actual,0);
  const overallEff = Math.round(totalActual/totalTarget*100);
  const topLine = [...DATA.productionLines].sort((a,b)=>b.eff-a.eff)[0];
  const lowLine = [...DATA.productionLines].sort((a,b)=>a.eff-b.eff)[0];
  const woByStatus = ["In Progress","Pending","Delayed"].map(s=>({ label:s, count:DATA.workOrders.filter(w=>w.status===s).length }));
  return (
      <div>
        <PageHeader title="Production Report" subtitle="Reports • Production" icon="📊" onBack={onBack} color="green"/>
        <ReportMeta period="March 2026 — Week 10" preparedBy="Dara Pich"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Output" value={totalActual.toLocaleString()} icon="👕" color="green" sub="pcs today"/>
          <StatCard label="Overall Efficiency" value={`${overallEff}%`} icon="📈" color={overallEff>=90?"green":overallEff>=75?"blue":"amber"}/>
          <StatCard label="Active Lines" value={DATA.productionLines.length} icon="⚡" color="blue"/>
          <StatCard label="Total Target" value={totalTarget.toLocaleString()} icon="🎯" color="amber" sub="pcs"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2"><GlassCard color="green"><ReportSection title="Line Efficiency Breakdown" color="green">{DATA.productionLines.map((l,i)=>(<MiniBar key={i} label={l.name} value={l.actual} max={l.target} color={l.eff>=90?"green":l.eff>=75?"blue":"amber"}/>))}</ReportSection></GlassCard></div>
          <GlassCard color="green">
            <ReportSection title="KPI Summary" color="green">
              <SummaryRow label="Best Line" value={topLine.name} sub={`${topLine.eff}%`} highlight="text-green-400"/>
              <SummaryRow label="Lowest Line" value={lowLine.name} sub={`${lowLine.eff}%`} highlight="text-rose-400"/>
              <SummaryRow label="Gap to Target" value={`${(totalTarget-totalActual).toLocaleString()} pcs`} highlight="text-amber-400"/>
              <SummaryRow label="Shortfall %" value={`${(100-overallEff)}%`}/>
              <SummaryRow label="Total Workers" value={DATA.productionLines.reduce((s,l)=>s+l.workers,0)} sub="across all lines"/>
            </ReportSection>
            <ReportSection title="Work Order Status" color="green">
              {woByStatus.map(w=>(<SummaryRow key={w.label} label={w.label} value={`${w.count} orders`} highlight={w.label==="Delayed"?"text-rose-400":w.label==="In Progress"?"text-blue-400":"text-amber-400"}/>))}
            </ReportSection>
          </GlassCard>
        </div>
        <GlassCard color="green">
          <ReportSection title="Work Order Progress" color="green">
            <Table color="green" cols={["Order ID","Product","Buyer","Qty","Done","Progress","Line","Due","Status"]}
                   rows={DATA.workOrders.map(wo=>[<span className="font-mono text-green-300 text-[10px]">{wo.id}</span>,wo.product,wo.buyer,wo.qty.toLocaleString(),wo.done.toLocaleString(),<ProgressBar value={wo.qty>0?Math.round(wo.done/wo.qty*100):0}/>,wo.line,wo.due,<StatusBadge status={wo.status}/>])}/>
          </ReportSection>
        </GlassCard>
      </div>
  );
}

function QualityReportPage({ onBack }) {
  const totalChecked = DATA.inspections.reduce((s,i)=>s+i.checked,0);
  const totalPassed = DATA.inspections.reduce((s,i)=>s+i.passed,0);
  const totalFailed = DATA.inspections.reduce((s,i)=>s+i.failed,0);
  const passRate = Math.round(totalPassed/totalChecked*100);
  const openDefects = DATA.defects.filter(d=>d.status==="Open");
  const totalDefectQty = DATA.defects.reduce((s,d)=>s+d.qty,0);
  const bySeverity = ["Critical","Major","Minor"].map(s=>({ label:s, count:DATA.defects.filter(d=>d.severity===s).length, qty:DATA.defects.filter(d=>d.severity===s).reduce((t,d)=>t+d.qty,0) }));
  const byLine = [...new Set(DATA.defects.map(d=>d.line))].map(l=>({ line:l, count:DATA.defects.filter(d=>d.line===l).length }));
  return (
      <div>
        <PageHeader title="Quality Report" subtitle="Reports • Quality Control" icon="🔍" onBack={onBack} color="rose"/>
        <ReportMeta period="March 2026" preparedBy="Sreymom Chan"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Pass Rate" value={`${passRate}%`} icon="✅" color={passRate>=95?"green":passRate>=85?"amber":"rose"}/>
          <StatCard label="Total Checked" value={totalChecked} icon="🔬" color="blue"/>
          <StatCard label="Total Failed" value={totalFailed} icon="❌" color="rose"/>
          <StatCard label="Open Defects" value={openDefects.length} icon="🚨" color="rose"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2"><GlassCard color="rose"><ReportSection title="Inspection Results by Work Order" color="rose"><Table color="rose" cols={["Work Order","Stage","Inspector","Checked","Passed","Failed","Pass Rate","Result"]} rows={DATA.inspections.map(i=>[<span className="font-mono text-rose-300 text-[10px]">{i.wo}</span>,<Badge color="blue">{i.stage}</Badge>,i.inspector,i.checked,i.passed,<span className="text-rose-300 font-semibold">{i.failed}</span>,<ProgressBar value={Math.round(i.passed/i.checked*100)}/>,<StatusBadge status={i.result}/>])}/></ReportSection></GlassCard></div>
          <GlassCard color="rose">
            <ReportSection title="Defect Severity" color="rose">
              <div className="flex items-center gap-4 mb-3">
                <DonutChart segments={[{value:bySeverity[0].count,color:"#fb7185"},{value:bySeverity[1].count,color:"#fbbf24"},{value:bySeverity[2].count,color:"#60a5fa"}]}/>
                <div className="space-y-1.5">{bySeverity.map((s,i)=>(<div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background:i===0?"#fb7185":i===1?"#fbbf24":"#60a5fa" }}/><span className="text-[10px] text-white/50">{s.label}</span><span className="text-[10px] font-semibold text-white/80 ml-auto">{s.count}</span></div>))}</div>
              </div>
              <SummaryRow label="Total Defect Qty" value={totalDefectQty} highlight="text-rose-400"/>
              <SummaryRow label="Defect Rate" value={`${((totalFailed/totalChecked)*100).toFixed(2)}%`}/>
            </ReportSection>
            <ReportSection title="Defects by Line" color="rose">{byLine.map((b,i)=><SummaryRow key={i} label={b.line} value={`${b.count} reports`}/>)}</ReportSection>
          </GlassCard>
        </div>
        <GlassCard color="rose"><ReportSection title="Open Defect Details" color="rose"><Table color="rose" cols={["#","Line","Product","Type","Qty","Severity","Inspector","Date","Status"]} rows={DATA.defects.map(d=>[d.id,d.line,d.product,d.type,<span className="font-semibold text-rose-300">{d.qty}</span>,<StatusBadge status={d.severity}/>,d.inspector,d.date,<StatusBadge status={d.status}/>])}/></ReportSection></GlassCard>
      </div>
  );
}

function HRReportPage({ onBack }) {
  const presentCount = DATA.attendance.filter(a=>a.status==="Present"||a.status==="OT").length;
  const absentCount = DATA.attendance.filter(a=>a.status==="Absent").length;
  const totalOTHrs = DATA.attendance.reduce((s,a)=>s+a.ot,0);
  const totalPayroll = DATA.payroll.reduce((s,p)=>s+p.net,0);
  const totalBonus = DATA.payroll.reduce((s,p)=>s+p.bonus,0);
  const totalOTPay = DATA.payroll.reduce((s,p)=>s+p.ot,0);
  const pendingLeaves = DATA.leaves.filter(l=>l.status==="Pending").length;
  const byDept = [...new Set(DATA.employees.map(e=>e.dept))].map(d=>({ dept:d, count:DATA.employees.filter(e=>e.dept===d).length, active:DATA.employees.filter(e=>e.dept===d&&e.status==="Active").length }));
  return (
      <div>
        <PageHeader title="HR Report" subtitle="Reports • Human Resources" icon="👷" onBack={onBack} color="violet"/>
        <ReportMeta period="March 2026" preparedBy="Sophea Keo"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Present Today" value={`${presentCount}/${DATA.attendance.length}`} icon="✅" color="green"/>
          <StatCard label="Absent" value={absentCount} icon="❌" color="rose"/>
          <StatCard label="OT Hours" value={`${totalOTHrs}h`} icon="⏰" color="amber"/>
          <StatCard label="Leave Pending" value={pendingLeaves} icon="🌴" color="violet"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2 space-y-4">
            <GlassCard color="violet"><ReportSection title="Attendance Summary — Mar 5, 2026" color="violet"><Table color="violet" cols={["Employee","Dept","In","Out","OT","Status"]} rows={DATA.attendance.map(a=>[a.employee,a.dept,a.in,a.out,a.ot?<span className="text-amber-400 font-semibold">{a.ot}h</span>:"–",<StatusBadge status={a.status}/>])}/></ReportSection></GlassCard>
            <GlassCard color="violet"><ReportSection title="Payroll Summary — Feb 2026" color="violet"><Table color="violet" cols={["Employee","Dept","Base","OT Pay","Bonus","Deduction","Net Pay","Status"]} rows={DATA.payroll.map(p=>[p.employee,p.dept,`$${p.base}`,<span className="text-amber-400">${p.ot}</span>,<span className="text-green-400">${p.bonus}</span>,<span className="text-rose-400">-${p.deduction}</span>,<span className="font-bold text-violet-300">${p.net}</span>,<StatusBadge status={p.status}/>])}/></ReportSection></GlassCard>
          </div>
          <div className="space-y-4">
            <GlassCard color="violet"><ReportSection title="Payroll KPIs" color="violet"><SummaryRow label="Total Payroll" value={`$${totalPayroll.toLocaleString()}`} highlight="text-violet-300"/><SummaryRow label="Total OT Pay" value={`$${totalOTPay}`} highlight="text-amber-400"/><SummaryRow label="Total Bonus" value={`$${totalBonus}`} highlight="text-green-400"/></ReportSection><ReportSection title="Workforce Breakdown" color="violet"><SummaryRow label="Total Employees" value={DATA.employees.length}/><SummaryRow label="Permanent" value={DATA.employees.filter(e=>e.type==="Permanent").length}/><SummaryRow label="Contract" value={DATA.employees.filter(e=>e.type==="Contract").length}/><SummaryRow label="Active" value={DATA.employees.filter(e=>e.status==="Active").length} highlight="text-green-400"/><SummaryRow label="Inactive" value={DATA.employees.filter(e=>e.status==="Inactive").length} highlight="text-rose-400"/></ReportSection></GlassCard>
            <GlassCard color="violet"><ReportSection title="Staff by Department" color="violet">{byDept.map((d,i)=>(<MiniBar key={i} label={d.dept} value={d.active} max={d.count} color="violet"/>))}</ReportSection></GlassCard>
            <GlassCard color="violet"><ReportSection title="Leave Requests" color="violet"><Table color="violet" cols={["Employee","Type","Days","Status"]} rows={DATA.leaves.map(l=>[l.employee,<Badge color="violet">{l.type}</Badge>,l.days,<StatusBadge status={l.status}/>])}/></ReportSection></GlassCard>
          </div>
        </div>
      </div>
  );
}

function InventoryReportPage({ onBack }) {
  const lowStock = DATA.materials.filter(m=>m.stock<m.reorder);
  const okStock = DATA.materials.filter(m=>m.stock>=m.reorder);
  const totalValue = DATA.materials.reduce((s,m)=>s+(m.stock*m.cost),0);
  const lowValue = lowStock.reduce((s,m)=>s+(m.stock*m.cost),0);
  return (
      <div>
        <PageHeader title="Inventory Report" subtitle="Reports • Materials & Stock" icon="📦" onBack={onBack} color="teal"/>
        <ReportMeta period="March 2026" preparedBy="Sophea Keo"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Items" value={DATA.materials.length} icon="🧵" color="teal"/>
          <StatCard label="Low Stock" value={lowStock.length} icon="⚠️" color="rose"/>
          <StatCard label="Stock OK" value={okStock.length} icon="✅" color="green"/>
          <StatCard label="Total Value" value={`$${totalValue.toLocaleString()}`} icon="💰" color="amber"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2"><GlassCard color="teal"><ReportSection title="Stock Level Analysis" color="teal">{DATA.materials.map((m,i)=>(<MiniBar key={i} label={m.name.split(" ").slice(0,2).join(" ")} value={m.stock} max={Math.max(m.reorder*2,m.stock)} color={m.stock<m.reorder?"rose":m.stock<m.reorder*1.5?"amber":"teal"}/>))}</ReportSection></GlassCard></div>
          <div className="space-y-4">
            <GlassCard color="rose"><ReportSection title="⚠ Low Stock Alerts" color="rose">{lowStock.length===0?<p className="text-[11px] text-white/30 text-center py-3">All items OK</p>:lowStock.map((m,i)=>(<div key={i} className="py-2 border-b border-white/5 last:border-0"><p className="text-[11px] text-white/75 font-medium">{m.name}</p><div className="flex justify-between text-[10px] text-white/40 mt-0.5"><span>Stock: <span className="text-rose-400 font-semibold">{m.stock.toLocaleString()} {m.unit}</span></span><span>Reorder: {m.reorder.toLocaleString()}</span></div></div>))}</ReportSection></GlassCard>
            <GlassCard color="teal"><ReportSection title="Value Summary" color="teal"><SummaryRow label="Total Inventory Value" value={`$${totalValue.toLocaleString()}`} highlight="text-teal-300"/><SummaryRow label="Low Stock Value" value={`$${lowValue.toLocaleString()}`} highlight="text-rose-400"/><SummaryRow label="Healthy Stock Value" value={`$${(totalValue-lowValue).toLocaleString()}`} highlight="text-green-400"/></ReportSection></GlassCard>
          </div>
        </div>
        <GlassCard color="teal"><ReportSection title="Full Stock Listing" color="teal"><Table color="teal" cols={["Code","Material","Unit","Current Stock","Reorder Point","Cost/Unit","Total Value","Supplier","Status"]} rows={DATA.materials.map(m=>[<span className="font-mono text-teal-300 text-[10px]">{m.code}</span>,m.name,m.unit,<span className={m.stock<m.reorder?"text-rose-300 font-bold":"text-white/80"}>{m.stock.toLocaleString()}</span>,m.reorder.toLocaleString(),`$${m.cost}`,<span className="text-teal-300">${(m.stock*m.cost).toLocaleString()}</span>,m.supplier,m.stock<m.reorder?<Badge color="rose">Low Stock</Badge>:<Badge color="green">OK</Badge>])}/></ReportSection></GlassCard>
      </div>
  );
}

function ProcurementReportPage({ onBack }) {
  const totalPOValue = DATA.purchaseOrders.reduce((s,p)=>s+p.amount,0);
  const delivered = DATA.purchaseOrders.filter(p=>p.status==="Delivered");
  const inTransit = DATA.purchaseOrders.filter(p=>p.status==="In Transit");
  const pending = DATA.purchaseOrders.filter(p=>p.status==="Pending"||p.status==="Confirmed");
  const avgRating = (DATA.suppliers.reduce((s,x)=>s+x.rating,0)/DATA.suppliers.length).toFixed(1);
  const totalBuyerPcs = DATA.buyers.reduce((s,b)=>s+b.totalPcs,0);
  return (
      <div>
        <PageHeader title="Procurement Report" subtitle="Reports • Procurement & Logistics" icon="📦" onBack={onBack} color="teal"/>
        <ReportMeta period="March 2026" preparedBy="Kosal Vong"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total PO Value" value={`$${totalPOValue.toLocaleString()}`} icon="💵" color="teal"/>
          <StatCard label="Delivered" value={delivered.length} icon="✅" color="green"/>
          <StatCard label="In Transit" value={inTransit.length} icon="🚢" color="blue"/>
          <StatCard label="Pending/Confirmed" value={pending.length} icon="⏳" color="amber"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <GlassCard color="teal"><ReportSection title="Purchase Orders Summary" color="teal"><Table color="teal" cols={["PO ID","Supplier","Material","Amount","Delivery","Status"]} rows={DATA.purchaseOrders.map(p=>[<span className="font-mono text-teal-300 text-[10px]">{p.id}</span>,p.supplier,p.material,<span className="font-semibold text-white/90">${p.amount.toLocaleString()}</span>,p.delivery,<StatusBadge status={p.status}/>])}/></ReportSection></GlassCard>
          <GlassCard color="teal"><ReportSection title="Supplier Performance" color="teal"><Table color="teal" cols={["Supplier","Material","Rating","Lead Days","Status"]} rows={DATA.suppliers.map(s=>[<span className="font-semibold text-teal-300">{s.name}</span>,s.material,<Stars rating={s.rating}/>,`${s.leadDays}d`,<StatusBadge status={s.status}/>])}/><div className="mt-3 pt-3 border-t border-white/8"><SummaryRow label="Avg Supplier Rating" value={`${avgRating} / 5.0`} highlight="text-amber-400"/><SummaryRow label="Best Supplier" value="YKK Cambodia" sub="5.0 ★" highlight="text-green-400"/></div></ReportSection></GlassCard>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard color="cyan"><ReportSection title="Shipments Status" color="cyan"><Table color="cyan" cols={["SH ID","Buyer","Qty","Method","ETD","ETA","Status"]} rows={DATA.shipments.map(s=>[<span className="font-mono text-cyan-300 text-[10px]">{s.id}</span>,s.buyer,s.qty.toLocaleString(),<Badge color="blue">{s.method}</Badge>,s.etd,s.eta,<StatusBadge status={s.status}/>])}/></ReportSection></GlassCard>
          <GlassCard color="cyan"><ReportSection title="Buyer Order Summary" color="cyan"><Table color="cyan" cols={["Buyer","Country","Orders","Total Pcs","Status"]} rows={DATA.buyers.map(b=>[<span className="font-semibold text-cyan-300">{b.name}</span>,b.country,b.activeOrders,<span className="font-semibold text-white/80">{b.totalPcs.toLocaleString()}</span>,<StatusBadge status={b.status}/>])}/><div className="mt-3 pt-3 border-t border-white/8"><SummaryRow label="Total Buyers" value={DATA.buyers.length}/><SummaryRow label="Total Ordered Pcs" value={totalBuyerPcs.toLocaleString()} highlight="text-cyan-300"/></div></ReportSection></GlassCard>
        </div>
      </div>
  );
}

function FinanceReportPage({ onBack }) {
  const avgMargin = (DATA.costings.reduce((s,c)=>s+c.margin,0)/DATA.costings.length).toFixed(1);
  const avgFOB = (DATA.costings.reduce((s,c)=>s+c.fob,0)/DATA.costings.length).toFixed(2);
  const totalPayroll = DATA.payroll.reduce((s,p)=>s+p.net,0);
  const highMargin = [...DATA.costings].sort((a,b)=>b.margin-a.margin)[0];
  const lowMargin = [...DATA.costings].sort((a,b)=>a.margin-b.margin)[0];
  return (
      <div>
        <PageHeader title="Finance Report" subtitle="Reports • Finance & Costing" icon="💰" onBack={onBack} color="violet"/>
        <ReportMeta period="March 2026" preparedBy="Sophea Keo"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Avg Margin" value={`${avgMargin}%`} icon="📈" color="green"/>
          <StatCard label="Avg FOB" value={`$${avgFOB}`} icon="💵" color="violet"/>
          <StatCard label="Total Payroll" value={`$${totalPayroll.toLocaleString()}`} icon="👷" color="blue"/>
          <StatCard label="Styles Costed" value={DATA.costings.length} icon="👕" color="amber"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2"><GlassCard color="violet"><ReportSection title="Cost Sheet Breakdown" color="violet"><Table color="violet" cols={["Product","Fabric","Trim","Labor","Overhead","Total Cost","FOB","Margin","Profit/pc"]} rows={DATA.costings.map(c=>[c.product,`$${c.fabric}`,`$${c.trim}`,`$${c.labor}`,`$${c.overhead}`,<span className="font-semibold text-white/90">${c.total}</span>,<span className="font-semibold text-violet-300">${c.fob}</span>,<span className={`font-bold ${c.margin>=30?"text-green-400":"text-amber-400"}`}>{c.margin}%</span>,<span className="text-green-400">${(c.fob-c.total).toFixed(2)}</span>])}/></ReportSection><ReportSection title="Cost Structure per Style (avg)" color="violet">{[{label:"Fabric",value:DATA.costings.reduce((s,c)=>s+c.fabric,0)/DATA.costings.length,color:"teal"},{label:"Trim",value:DATA.costings.reduce((s,c)=>s+c.trim,0)/DATA.costings.length,color:"blue"},{label:"Labor",value:DATA.costings.reduce((s,c)=>s+c.labor,0)/DATA.costings.length,color:"amber"},{label:"Overhead",value:DATA.costings.reduce((s,c)=>s+c.overhead,0)/DATA.costings.length,color:"orange"}].map((x,i)=><MiniBar key={i} label={x.label} value={parseFloat(x.value.toFixed(2))} max={10} color={x.color}/>)}</ReportSection></GlassCard></div>
          <div className="space-y-4">
            <GlassCard color="violet"><ReportSection title="Margin Analysis" color="violet"><SummaryRow label="Highest Margin" value={highMargin.product.split(" ").slice(0,2).join(" ")} sub={`${highMargin.margin}%`} highlight="text-green-400"/><SummaryRow label="Lowest Margin" value={lowMargin.product.split(" ").slice(0,2).join(" ")} sub={`${lowMargin.margin}%`} highlight="text-rose-400"/><SummaryRow label="Avg Margin" value={`${avgMargin}%`} highlight="text-violet-300"/><SummaryRow label="Avg FOB" value={`$${avgFOB}`}/></ReportSection></GlassCard>
            <GlassCard color="violet"><ReportSection title="Payroll by Dept" color="violet">{DATA.payroll.map((p,i)=>(<SummaryRow key={i} label={p.employee.split(" ")[0]} value={`$${p.net}`} sub={p.dept} highlight="text-violet-300"/>))}<div className="mt-2 pt-2 border-t border-white/8"><SummaryRow label="Total" value={`$${totalPayroll.toLocaleString()}`} highlight="text-green-400"/></div></ReportSection></GlassCard>
          </div>
        </div>
      </div>
  );
}

function MaintenanceReportPage({ onBack }) {
  const running = DATA.machines.filter(m=>m.status==="Running");
  const maintenance = DATA.machines.filter(m=>m.status==="Maintenance");
  const idle = DATA.machines.filter(m=>m.status==="Idle");
  const utilRate = Math.round(running.length/DATA.machines.length*100);
  const byDept = [...new Set(DATA.machines.map(m=>m.dept))].map(d=>({ dept:d, total:DATA.machines.filter(m=>m.dept===d).length, running:DATA.machines.filter(m=>m.dept===d&&m.status==="Running").length }));
  return (
      <div>
        <PageHeader title="Maintenance Report" subtitle="Reports • Machines & Assets" icon="🔧" onBack={onBack} color="orange"/>
        <ReportMeta period="March 2026" preparedBy="Panha Rin"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Utilization" value={`${utilRate}%`} icon="⚙️" color={utilRate>=80?"green":"amber"}/>
          <StatCard label="Running" value={running.length} icon="✅" color="green"/>
          <StatCard label="In Maintenance" value={maintenance.length} icon="🔧" color="amber"/>
          <StatCard label="Idle" value={idle.length} icon="💤" color="rose"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2"><GlassCard color="orange"><ReportSection title="Machine Status Register" color="orange"><Table color="orange" cols={["ID","Machine","Type","Dept","Line","Last Service","Next Service","Status"]} rows={DATA.machines.map(m=>[<span className="font-mono text-orange-300 text-[10px]">{m.id}</span>,m.name,m.type,m.dept,m.line,m.lastService,m.nextService,<StatusBadge status={m.status}/>])}/></ReportSection></GlassCard></div>
          <div className="space-y-4">
            <GlassCard color="orange"><ReportSection title="Utilization by Dept" color="orange">{byDept.map((d,i)=><MiniBar key={i} label={d.dept} value={d.running} max={d.total} color="orange"/>)}</ReportSection></GlassCard>
            <GlassCard color="orange"><ReportSection title="Status Summary" color="orange"><div className="flex items-center gap-4 justify-center py-2"><DonutChart size={90} segments={[{value:running.length,color:"#34d399"},{value:maintenance.length,color:"#fbbf24"},{value:idle.length,color:"#fb7185"}]}/><div className="space-y-2">{[{label:"Running",count:running.length,color:"#34d399"},{label:"Maintenance",count:maintenance.length,color:"#fbbf24"},{label:"Idle",count:idle.length,color:"#fb7185"}].map((s,i)=>(<div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background:s.color }}/><span className="text-[10px] text-white/50">{s.label}</span><span className="text-[10px] font-semibold text-white/80 ml-2">{s.count}</span></div>))}</div></div><SummaryRow label="Total Machines" value={DATA.machines.length}/><SummaryRow label="Utilization Rate" value={`${utilRate}%`} highlight={utilRate>=80?"text-green-400":"text-amber-400"}/></ReportSection></GlassCard>
          </div>
        </div>
      </div>
  );
}

function KPIReportPage({ onBack }) {
  const totalTarget = DATA.productionLines.reduce((s,l)=>s+l.target,0);
  const totalActual = DATA.productionLines.reduce((s,l)=>s+l.actual,0);
  const overallEff = Math.round(totalActual/totalTarget*100);
  const passRate = Math.round(DATA.inspections.reduce((s,i)=>s+(i.passed/i.checked*100),0)/DATA.inspections.length);
  const utilRate = Math.round(DATA.machines.filter(m=>m.status==="Running").length/DATA.machines.length*100);
  const attendRate = Math.round((DATA.attendance.filter(a=>a.status!=="Absent").length/DATA.attendance.length)*100);
  const totalPayroll = DATA.payroll.reduce((s,p)=>s+p.net,0);
  const avgMargin = (DATA.costings.reduce((s,c)=>s+c.margin,0)/DATA.costings.length).toFixed(1);
  const kpis = [
    { label:"Production Efficiency", value:`${overallEff}%`, target:"≥ 90%", status:overallEff>=90?"✅":"⚠️", color:overallEff>=90?"green":"amber" },
    { label:"Quality Pass Rate", value:`${passRate}%`, target:"≥ 95%", status:passRate>=95?"✅":"⚠️", color:passRate>=95?"green":"amber" },
    { label:"Machine Utilization", value:`${utilRate}%`, target:"≥ 85%", status:utilRate>=85?"✅":"⚠️", color:utilRate>=85?"green":"amber" },
    { label:"Attendance Rate", value:`${attendRate}%`, target:"≥ 95%", status:attendRate>=95?"✅":"⚠️", color:attendRate>=95?"green":"amber" },
    { label:"Avg Product Margin", value:`${avgMargin}%`, target:"≥ 28%", status:parseFloat(avgMargin)>=28?"✅":"⚠️", color:parseFloat(avgMargin)>=28?"green":"amber" },
    { label:"Open Defects", value:DATA.defects.filter(d=>d.status==="Open").length, target:"≤ 5", status:DATA.defects.filter(d=>d.status==="Open").length<=5?"✅":"❌", color:DATA.defects.filter(d=>d.status==="Open").length<=5?"green":"rose" },
    { label:"Delayed Orders", value:DATA.workOrders.filter(w=>w.status==="Delayed").length, target:"0", status:DATA.workOrders.filter(w=>w.status==="Delayed").length===0?"✅":"❌", color:DATA.workOrders.filter(w=>w.status==="Delayed").length===0?"green":"rose" },
    { label:"Low Stock Items", value:DATA.materials.filter(m=>m.stock<m.reorder).length, target:"0", status:DATA.materials.filter(m=>m.stock<m.reorder).length===0?"✅":"⚠️", color:DATA.materials.filter(m=>m.stock<m.reorder).length===0?"green":"amber" },
  ];
  return (
      <div>
        <PageHeader title="KPI Executive Summary" subtitle="Reports • Factory Performance" icon="📈" onBack={onBack} color="amber"/>
        <ReportMeta period="March 2026 — Week 10" preparedBy="Sophea Keo"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Production Eff." value={`${overallEff}%`} icon="⚙️" color={overallEff>=90?"green":"amber"}/>
          <StatCard label="Quality Pass" value={`${passRate}%`} icon="✅" color={passRate>=95?"green":"amber"}/>
          <StatCard label="Machine Util." value={`${utilRate}%`} icon="🔧" color={utilRate>=85?"green":"amber"}/>
          <StatCard label="Avg Margin" value={`${avgMargin}%`} icon="💰" color="violet"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-2"><GlassCard color="amber"><ReportSection title="Factory KPI Scorecard" color="amber"><div className="space-y-2">{kpis.map((kpi,i)=>{ const a=ACCENT[kpi.color]; return(<div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${a.border}` }}><span className="text-base w-6 shrink-0">{kpi.status}</span><span className="text-xs text-white/70 flex-1">{kpi.label}</span><span className="text-[10px] text-white/30 hidden md:block">Target: {kpi.target}</span><span className="text-sm font-bold" style={{ color:a.text }}>{kpi.value}</span></div>);})}</div></ReportSection></GlassCard></div>
          <div className="space-y-4">
            <GlassCard color="amber"><ReportSection title="Overall Health" color="amber"><div className="text-center py-3"><div className="text-4xl font-bold mb-1" style={{ color:kpis.filter(k=>k.status==="✅").length>=6?"#34d399":"#fbbf24" }}>{kpis.filter(k=>k.status==="✅").length}/{kpis.length}</div><p className="text-[11px] text-white/40">KPIs on target</p><div className="mt-3 w-full h-2.5 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width:`${Math.round(kpis.filter(k=>k.status==="✅").length/kpis.length*100)}%`, background:kpis.filter(k=>k.status==="✅").length>=6?"#34d399":"#fbbf24" }}/></div></div></ReportSection></GlassCard>
            <GlassCard color="amber"><ReportSection title="Action Items" color="amber">{kpis.filter(k=>k.status!=="✅").map((kpi,i)=>(<div key={i} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0"><span className="text-xs mt-0.5">{kpi.status}</span><div><p className="text-[11px] text-white/70">{kpi.label}</p><p className="text-[10px] text-white/35">Current: {kpi.value} · Target: {kpi.target}</p></div></div>))}{kpis.filter(k=>k.status!=="✅").length===0&&<p className="text-[11px] text-green-400 text-center py-2">All KPIs on target! 🎉</p>}</ReportSection></GlassCard>
          </div>
        </div>
        <GlassCard color="amber"><ReportSection title="Line Performance Summary" color="amber"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">{DATA.productionLines.map((l,i)=>(<div key={i} className="flex items-center gap-3 py-1.5"><span className="text-[11px] text-white/50 w-16 shrink-0">{l.name}</span><div className="flex-1 h-2 rounded-full bg-white/8"><div className="h-full rounded-full" style={{ width:`${l.eff}%`, background:l.eff>=90?"#34d399":l.eff>=75?"#60a5fa":"#fbbf24" }}/></div><span className="text-[11px] font-semibold w-10 text-right" style={{ color:l.eff>=90?"#34d399":l.eff>=75?"#60a5fa":"#fbbf24" }}>{l.eff}%</span><span className="text-[10px] text-white/25 w-20 text-right">{l.actual}/{l.target}</span></div>))}</div></ReportSection></GlassCard>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REPORTS HUB
// ═══════════════════════════════════════════════════════════════
function ReportsPage({ onBack }) {
  const [activeReport, setActiveReport] = useState(null);
  const REPORT_PAGES = {
    production: <ProductionReportPage onBack={()=>setActiveReport(null)}/>,
    quality:    <QualityReportPage    onBack={()=>setActiveReport(null)}/>,
    hr:         <HRReportPage         onBack={()=>setActiveReport(null)}/>,
    inventory:  <InventoryReportPage  onBack={()=>setActiveReport(null)}/>,
    procurement:<ProcurementReportPage onBack={()=>setActiveReport(null)}/>,
    finance:    <FinanceReportPage    onBack={()=>setActiveReport(null)}/>,
    maintenance:<MaintenanceReportPage onBack={()=>setActiveReport(null)}/>,
    kpi:        <KPIReportPage        onBack={()=>setActiveReport(null)}/>,
  };
  if (activeReport && REPORT_PAGES[activeReport]) return REPORT_PAGES[activeReport];
  const reports = [
    { id:"kpi",         icon:"📈", title:"KPI Executive Summary",    desc:"Factory-wide KPI scorecard, action items, health overview",   color:"amber", freq:"Real-time", badge:"New" },
    { id:"production",  icon:"🏗️", title:"Production Report",        desc:"Line efficiency, output vs target, work order progress",       color:"green",  freq:"Daily" },
    { id:"quality",     icon:"🔍", title:"Quality Report",           desc:"Inspection results, defect severity, pass rate by WO",         color:"rose",   freq:"Daily" },
    { id:"hr",          icon:"👷", title:"HR Report",                desc:"Attendance, payroll summary, leave requests, headcount",       color:"violet", freq:"Daily" },
    { id:"inventory",   icon:"🧵", title:"Inventory Report",         desc:"Stock levels, low stock alerts, total inventory value",        color:"teal",   freq:"Weekly" },
    { id:"procurement", icon:"📦", title:"Procurement Report",       desc:"Purchase orders, supplier ratings, shipment tracking",         color:"teal",   freq:"Weekly" },
    { id:"finance",     icon:"💰", title:"Finance / Costing Report", desc:"Cost sheet, margins, FOB prices, payroll breakdown",           color:"violet", freq:"Monthly" },
    { id:"maintenance", icon:"🔧", title:"Maintenance Report",       desc:"Machine status, utilization rate, service schedules",          color:"orange", freq:"Weekly" },
  ];
  const statusCounts = {
    production: `${Math.round(DATA.productionLines.reduce((s,l)=>s+l.actual,0)/DATA.productionLines.reduce((s,l)=>s+l.target,0)*100)}% eff`,
    quality: `${Math.round(DATA.inspections.reduce((s,i)=>s+(i.passed/i.checked*100),0)/DATA.inspections.length)}% pass`,
    hr: `${DATA.attendance.filter(a=>a.status!=="Absent").length}/${DATA.attendance.length} present`,
    inventory: `${DATA.materials.filter(m=>m.stock<m.reorder).length} low stock`,
    procurement: `${DATA.purchaseOrders.filter(p=>p.status==="In Transit").length} in transit`,
    finance: `${(DATA.costings.reduce((s,c)=>s+c.margin,0)/DATA.costings.length).toFixed(1)}% avg margin`,
    maintenance: `${DATA.machines.filter(m=>m.status==="Running").length}/${DATA.machines.length} running`,
    kpi: `${[DATA.productionLines.reduce((s,l)=>s+l.actual,0)/DATA.productionLines.reduce((s,l)=>s+l.target,0)>=0.9,DATA.inspections.reduce((s,i)=>s+(i.passed/i.checked*100),0)/DATA.inspections.length>=95,DATA.machines.filter(m=>m.status==="Running").length/DATA.machines.length>=0.85].filter(Boolean).length}/8 KPIs met`,
  };
  return (
      <div>
        <PageHeader title="Reports Center" subtitle="Analytics & Reporting Hub" icon="📊" onBack={onBack} color="amber"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Report Types" value={reports.length} icon="📋" color="amber"/>
          <StatCard label="Daily Reports" value={reports.filter(r=>r.freq==="Daily").length} icon="📅" color="green"/>
          <StatCard label="Weekly Reports" value={reports.filter(r=>r.freq==="Weekly").length} icon="📆" color="blue"/>
          <StatCard label="Live Reports" value={reports.filter(r=>r.freq==="Real-time").length} icon="⚡" color="rose"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {reports.map((r) => {
            const a = ACCENT[r.color];
            return (
                <button key={r.id} onClick={()=>setActiveReport(r.id)} className="relative text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:scale-[1.01] group active:scale-95"
                        style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))", border:`1px solid ${a.border}`, boxShadow:`0 8px 32px rgba(0,0,0,0.4),0 0 40px ${a.bg}` }}>
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.bar}`}/>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background:a.bg, border:`1px solid ${a.border}` }}>{r.icon}</div>
                      <div className="flex flex-col items-end gap-1"><Badge color={r.color}>{r.freq}</Badge>{r.badge && <Badge color="rose">{r.badge}</Badge>}</div>
                    </div>
                    <h3 className="text-sm font-bold text-white/90 mb-1 leading-snug">{r.title}</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed mb-3">{r.desc}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/8">
                      <span className="text-[10px] font-semibold" style={{ color:a.text }}>{statusCounts[r.id]}</span>
                      <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors flex items-center gap-1">View Report <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span></span>
                    </div>
                  </div>
                </button>
            );
          })}
        </div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCTION FLOW PAGE (NEW)
// ═══════════════════════════════════════════════════════════════
function ProductionFlowPage({ onBack }) {
  const [activeStage, setActiveStage] = useState(null);

  const whInput = DATA.materials.reduce((s, m) => s + m.stock, 0).toLocaleString();
  const whLowStock = DATA.materials.filter(m => m.stock < m.reorder).length;
  const cuttingLines  = DATA.productionLines.filter(l => l.dept === "Cutting");
  const cuttingActual = cuttingLines.reduce((s, l) => s + l.actual, 0);
  const cuttingTarget = cuttingLines.reduce((s, l) => s + l.target, 0);
  const cuttingEff    = cuttingTarget > 0 ? Math.round(cuttingActual / cuttingTarget * 100) : 0;
  const sewingLines  = DATA.productionLines.filter(l => l.dept === "Sewing");
  const sewingActual = sewingLines.reduce((s, l) => s + l.actual, 0);
  const sewingTarget = sewingLines.reduce((s, l) => s + l.target, 0);
  const sewingEff    = sewingTarget > 0 ? Math.round(sewingActual / sewingTarget * 100) : 0;
  const embDept = DATA.departments.find(d => d.name === "Embroidery");
  const finishLines  = DATA.productionLines.filter(l => l.dept === "Finishing");
  const finishActual = finishLines.reduce((s, l) => s + l.actual, 0);
  const finishTarget = finishLines.reduce((s, l) => s + l.target, 0);
  const finishEff    = finishTarget > 0 ? Math.round(finishActual / finishTarget * 100) : 0;
  const openDefects   = DATA.defects.filter(d => d.status === "Open").length;
  const critDefects   = DATA.defects.filter(d => d.severity === "Critical").length;
  const totalChecked  = DATA.inspections.reduce((s, i) => s + i.checked, 0);
  const totalPassed   = DATA.inspections.reduce((s, i) => s + i.passed, 0);
  const qcPassRate    = totalChecked > 0 ? Math.round(totalPassed / totalChecked * 100) : 0;
  const packLines  = DATA.productionLines.filter(l => l.dept === "Packing");
  const packActual = packLines.reduce((s, l) => s + l.actual, 0);
  const whOutQty    = DATA.shipments.reduce((s, sh) => s + sh.qty, 0).toLocaleString();
  const confirmedSh = DATA.shipments.filter(s => s.status === "Confirmed").length;
  const totalWOQty  = DATA.workOrders.reduce((s, w) => s + Number(w.qty), 0);
  const totalWODone = DATA.workOrders.reduce((s, w) => s + Number(w.done), 0);
  const overallPct  = totalWOQty > 0 ? Math.round(totalWODone / totalWOQty * 100) : 0;

  const STAGES = [
    {
      id:"wh-in", icon:"📦", label:"WH Input", sublabel:"Raw materials received", color:"blue",
      kpi:`${whInput} units stock`, alert:whLowStock>0?`⚠ ${whLowStock} low stock`:null,
      detail:{
        title:"Warehouse — Raw Material Input",
        desc:"Fabric rolls, trims, threads, zippers, labels and accessories are received from suppliers, inspected (GRN), and stored. Materials are issued to cutting against approved work orders.",
        stats:[{label:"Materials tracked",value:DATA.materials.length},{label:"Total stock units",value:DATA.materials.reduce((s,m)=>s+m.stock,0).toLocaleString()},{label:"Low stock alerts",value:whLowStock,danger:whLowStock>0},{label:"Active suppliers",value:DATA.suppliers.filter(s=>s.status==="Active").length},{label:"POs in transit",value:DATA.purchaseOrders.filter(p=>p.status==="In Transit").length}],
        rows:DATA.materials.map(m=>({cells:[m.code,m.name,`${m.stock.toLocaleString()} ${m.unit}`,m.stock<m.reorder?"Low":"OK",m.supplier],alert:m.stock<m.reorder})),
        cols:["Code","Material","Stock","Status","Supplier"],
      },
    },
    {
      id:"cutting", icon:"✂️", label:"Cutting", sublabel:"Lay · Marker · Cut", color:"amber",
      kpi:`${cuttingEff}% efficiency`, alert:cuttingEff<85?`Below target`:null,
      detail:{
        title:"Cutting Department",
        desc:"Fabric is laid in multiple plies. A CAD marker minimises wastage. Straight-knife or band-knife machines cut panels per size ratio. Cut bundles are numbered and sent to sewing.",
        stats:[{label:"Cutting lines",value:cuttingLines.length},{label:"Today output",value:`${cuttingActual.toLocaleString()} pcs`},{label:"Target",value:`${cuttingTarget.toLocaleString()} pcs`},{label:"Efficiency",value:`${cuttingEff}%`,danger:cuttingEff<85},{label:"Machines running",value:DATA.machines.filter(m=>m.dept==="Cutting"&&m.status==="Running").length}],
        rows:cuttingLines.map(l=>({cells:[l.name,l.supervisor,`${l.workers} workers`,`${l.actual.toLocaleString()} / ${l.target.toLocaleString()}`,`${l.eff}%`],alert:l.eff<80})),
        cols:["Line","Supervisor","Workers","Output / Target","Efficiency"],
      },
    },
    {
      id:"sewing", icon:"🧵", label:"Sewing", sublabel:"Sub-assembly · Main · Closing", color:"green",
      kpi:`${sewingActual.toLocaleString()} pcs today`, alert:sewingEff<85?`${sewingEff}% eff`:null,
      detail:{
        title:"Sewing / Assembly Lines",
        desc:"Cut bundles enter the sewing floor. Sub-assembly prepares collars, cuffs, pockets. Main assembly joins panels and sets sleeves. Closing ops add zippers, buttons, and final stitching.",
        stats:[{label:"Sewing lines",value:sewingLines.length},{label:"Today output",value:`${sewingActual.toLocaleString()} pcs`},{label:"Target",value:`${sewingTarget.toLocaleString()} pcs`},{label:"Avg efficiency",value:`${sewingEff}%`,danger:sewingEff<85},{label:"Total workers",value:sewingLines.reduce((s,l)=>s+l.workers,0)}],
        rows:sewingLines.map(l=>({cells:[l.name,l.supervisor,`${l.workers}`,`${l.actual} / ${l.target}`,`${l.eff}%`],alert:l.eff<80})),
        cols:["Line","Supervisor","Workers","Output / Target","Eff %"],
      },
    },
    {
      id:"embroidery", icon:"🪡", label:"Embroidery", sublabel:"Print · Logo · Badge (if reqd)", color:"violet",
      kpi:embDept?`${embDept.workers} workers`:"Optional", optional:true,
      detail:{
        title:"Embroidery / Printing (Optional)",
        desc:"Garments requiring logos, numbering, embroidery motifs, or heat-transfer prints are routed here before finishing. Multi-head machines run digitised designs. Once done, pieces re-join finishing.",
        stats:[{label:"Dept head",value:embDept?.head||"Sina Kem"},{label:"Lines",value:embDept?.lines||3},{label:"Workers",value:embDept?.workers||36},{label:"Emb. machines",value:DATA.machines.filter(m=>m.type==="Embroidery").length},{label:"Floor",value:`Floor ${embDept?.floor||"A"}`}],
        rows:DATA.machines.filter(m=>m.dept==="Embroidery").map(m=>({cells:[m.id,m.name,m.type,m.status,m.nextService],alert:m.status==="Maintenance"})),
        cols:["ID","Machine","Type","Status","Next Service"],
      },
    },
    {
      id:"qc-inprocess", icon:"🔍", label:"In-process QC", sublabel:"Defect check · Rework gate", color:"rose",
      kpi:`${qcPassRate}% pass rate`, alert:openDefects>0?`${openDefects} open defects`:null,
      detail:{
        title:"In-Process Quality Control",
        desc:"QC inspectors check garments at key sewing operations. Defects are tagged and returned for rework. Critical defects stop the line. Pass rate is tracked per line and per work order.",
        stats:[{label:"Pass rate",value:`${qcPassRate}%`,danger:qcPassRate<90},{label:"Total checked",value:totalChecked.toLocaleString()},{label:"Open defects",value:openDefects,danger:openDefects>0},{label:"Critical",value:critDefects,danger:critDefects>0},{label:"Rework items",value:DATA.defects.filter(d=>d.status==="Rework").length}],
        rows:DATA.defects.map(d=>({cells:[d.line,d.type,`${d.qty} pcs`,d.severity,d.status,d.inspector],alert:d.severity==="Critical"||d.status==="Open"})),
        cols:["Line","Defect type","Qty","Severity","Status","Inspector"],
      },
    },
    {
      id:"finishing", icon:"👔", label:"Finishing", sublabel:"Trim · Press · Label · Tag", color:"amber",
      kpi:`${finishActual.toLocaleString()} pcs today`, alert:null,
      detail:{
        title:"Finishing Department",
        desc:"Sewn garments go through thread trimming, spot cleaning, and pressing. Care labels and hang tags are attached. Any buyer-specific finishing requirements are applied. Sorted by size and colour before QC.",
        stats:[{label:"Finishing lines",value:finishLines.length},{label:"Today output",value:`${finishActual.toLocaleString()} pcs`},{label:"Target",value:`${finishTarget.toLocaleString()} pcs`},{label:"Efficiency",value:`${finishEff}%`},{label:"Dept head",value:DATA.departments.find(d=>d.name==="Finishing")?.head||"Panha Rin"}],
        rows:finishLines.map(l=>({cells:[l.name,l.supervisor,`${l.workers}`,`${l.actual} / ${l.target}`,`${l.eff}%`],alert:l.eff<80})),
        cols:["Line","Supervisor","Workers","Output / Target","Eff %"],
      },
    },
    {
      id:"qc-final", icon:"✅", label:"Final QC", sublabel:"AQL inspection · Buyer standard", color:"rose",
      kpi:`AQL 2.5 sampling`, alert:DATA.inspections.some(i=>i.result==="Fail")?"Fail found":null,
      detail:{
        title:"Final QC / AQL Inspection",
        desc:"Finished garments are sampled under AQL 2.5. Buyer's quality standards and measurement specs are applied. Rejected lots are sent back for 100% check and rework.",
        stats:[{label:"Inspections done",value:DATA.inspections.length},{label:"Total checked",value:DATA.inspections.reduce((s,i)=>s+i.checked,0).toLocaleString()},{label:"Pass",value:DATA.inspections.filter(i=>i.result==="Pass").length},{label:"Fail / returned",value:DATA.inspections.filter(i=>i.result==="Fail").length,danger:true},{label:"Avg pass rate",value:`${qcPassRate}%`}],
        rows:DATA.inspections.map(i=>({cells:[i.wo,i.stage,i.inspector,i.date,`${i.passed}/${i.checked}`,i.result],alert:i.result==="Fail"})),
        cols:["Work Order","Stage","Inspector","Date","Passed/Checked","Result"],
      },
    },
    {
      id:"packing", icon:"📫", label:"Packing", sublabel:"Fold · Poly-bag · Carton · Label", color:"gray",
      kpi:`${packActual.toLocaleString()} pcs packed`, alert:null,
      detail:{
        title:"Packing Department",
        desc:"Approved garments are folded, poly-bagged, and tagged per buyer specs. Assorted or solid packs are made per the packing instruction sheet. Cartons are labelled with buyer PO, style, size, colour, quantity.",
        stats:[{label:"Packing lines",value:packLines.length},{label:"Today output",value:`${packActual.toLocaleString()} pcs`},{label:"Target",value:`${packLines.reduce((s,l)=>s+l.target,0).toLocaleString()} pcs`},{label:"Dept head",value:DATA.departments.find(d=>d.name==="Packing")?.head||"Kosal Vong"},{label:"Workers",value:DATA.departments.find(d=>d.name==="Packing")?.workers||60}],
        rows:packLines.map(l=>({cells:[l.name,l.supervisor,`${l.workers}`,`${l.actual} / ${l.target}`,`${l.eff}%`],alert:l.eff<80})),
        cols:["Line","Supervisor","Workers","Output / Target","Eff %"],
      },
    },
    {
      id:"wh-out", icon:"🚢", label:"WH Output", sublabel:"Finished goods → Shipment", color:"blue",
      kpi:`${whOutQty} pcs ready`, alert:null,
      detail:{
        title:"Warehouse — Finished Goods Output & Shipment",
        desc:"Packed cartons are received into the finished goods warehouse, allocated to shipment plans, and loaded onto trucks. Packing lists and commercial invoices are prepared for customs clearance.",
        stats:[{label:"Shipments",value:DATA.shipments.length},{label:"Total pcs ready",value:whOutQty},{label:"Confirmed",value:confirmedSh},{label:"Scheduled",value:DATA.shipments.filter(s=>s.status==="Scheduled").length},{label:"Sea freight",value:DATA.shipments.filter(s=>s.method==="Sea Freight").length}],
        rows:DATA.shipments.map(sh=>({cells:[sh.id,sh.buyer,sh.qty.toLocaleString(),sh.method,sh.etd,sh.eta,sh.status],alert:false})),
        cols:["Shipment","Buyer","Qty","Method","ETD","ETA","Status"],
      },
    },
  ];

  const effColor = (v) => v>=90?"#34d399":v>=75?"#60a5fa":v>=50?"#fbbf24":"#fb7185";

  const colorMap = {
    blue:   { text:"#60a5fa", border:"rgba(96,165,250,0.35)",  bg:"rgba(96,165,250,0.12)",  bar:"from-blue-400/70 to-blue-300/30" },
    amber:  { text:"#fbbf24", border:"rgba(251,191,36,0.35)",  bg:"rgba(251,191,36,0.12)",  bar:"from-amber-400/70 to-amber-300/30" },
    green:  { text:"#34d399", border:"rgba(52,211,153,0.35)",  bg:"rgba(52,211,153,0.12)",  bar:"from-emerald-400/70 to-emerald-300/30" },
    rose:   { text:"#fb7185", border:"rgba(251,113,133,0.35)", bg:"rgba(251,113,133,0.12)", bar:"from-rose-400/70 to-rose-300/30" },
    violet: { text:"#a78bfa", border:"rgba(167,139,250,0.35)", bg:"rgba(167,139,250,0.12)", bar:"from-violet-400/70 to-violet-300/30" },
    gray:   { text:"#94a3b8", border:"rgba(148,163,184,0.3)",  bg:"rgba(148,163,184,0.08)", bar:"from-slate-400/50 to-slate-300/20" },
  };

  const active = activeStage ? STAGES.find(s => s.id === activeStage) : null;

  return (
      <div>
        {active && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(10px)" }}>
              <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl"
                   style={{ background:"linear-gradient(145deg,rgba(22,24,18,0.99),rgba(14,16,12,0.99))", border:`1px solid ${colorMap[active.color].border}`, boxShadow:"0 40px 100px rgba(0,0,0,0.8)" }}>
                <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${colorMap[active.color].bar} rounded-b-full`}/>
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background:colorMap[active.color].bg, border:`1px solid ${colorMap[active.color].border}` }}>{active.icon}</div>
                    <div><h3 className="text-sm font-bold text-white/90">{active.detail.title}</h3><p className="text-[10px] text-white/30 uppercase tracking-widest">Production Flow · {active.label}</p></div>
                  </div>
                  <button onClick={()=>setActiveStage(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 text-xl">×</button>
                </div>
                <div className="mx-6 mb-4 px-4 py-3 rounded-xl text-[11px] text-white/55 leading-relaxed" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>{active.detail.desc}</div>
                <div className="grid grid-cols-5 gap-2 px-6 mb-4">
                  {active.detail.stats.map((s,i)=>(
                      <div key={i} className="rounded-xl px-3 py-2.5 text-center" style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${s.danger?"rgba(251,113,133,0.3)":colorMap[active.color].border}` }}>
                        <p className="text-xs font-bold leading-none mb-1" style={{ color:s.danger?"#fb7185":colorMap[active.color].text }}>{s.value}</p>
                        <p className="text-[9px] text-white/30 leading-tight">{s.label}</p>
                      </div>
                  ))}
                </div>
                {active.detail.rows.length > 0 && (
                    <div className="mx-6 mb-6 overflow-x-auto rounded-xl" style={{ border:`1px solid ${colorMap[active.color].border}` }}>
                      <table className="w-full text-xs">
                        <thead><tr style={{ background:colorMap[active.color].bg, borderBottom:`1px solid ${colorMap[active.color].border}` }}>{active.detail.cols.map(c=>(<th key={c} className="text-left px-3 py-2 font-semibold text-white/50 uppercase tracking-wider text-[10px] whitespace-nowrap">{c}</th>))}</tr></thead>
                        <tbody>{active.detail.rows.map((row,i)=>(<tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors" style={row.alert?{background:"rgba(251,113,133,0.06)"}:{}}>{row.cells.map((cell,j)=>(<td key={j} className="px-3 py-2 text-white/70 whitespace-nowrap">{cell}</td>))}</tr>))}</tbody>
                      </table>
                    </div>
                )}
              </div>
            </div>
        )}

        <PageHeader title="Production Flow" subtitle="WH Input → Cut → Sew → Finish → WH Output" icon="🏭" onBack={onBack} color="green"/>

        <div className="rounded-2xl p-4 mb-5" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Overall production progress — all active work orders</span>
            <span className="text-xs font-bold text-green-400">{overallPct}% complete</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10"><div className="h-full rounded-full transition-all duration-700" style={{ width:`${overallPct}%`, background:effColor(overallPct) }}/></div>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-white/30">
            <span>Total ordered: <span className="text-white/60 font-semibold">{totalWOQty.toLocaleString()} pcs</span></span>
            <span>Completed: <span className="text-green-400 font-semibold">{totalWODone.toLocaleString()} pcs</span></span>
            <span>Remaining: <span className="text-amber-400 font-semibold">{(totalWOQty-totalWODone).toLocaleString()} pcs</span></span>
            <span className="ml-auto">Active WOs: <span className="text-white/60 font-semibold">{DATA.workOrders.length}</span></span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[34px] top-10 bottom-10 w-px bg-gradient-to-b from-blue-400/20 via-green-400/20 to-blue-400/20 pointer-events-none"/>
          <div className="space-y-2">
            {STAGES.map((stage, idx) => {
              const a = colorMap[stage.color];
              return (
                  <div key={stage.id}>
                    {idx > 0 && (
                        <div className="flex items-center ml-7 my-0.5">
                          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v8M5 8l3 4 3-4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {stage.optional && <span className="ml-2 text-[9px] text-violet-400/60 uppercase tracking-widest font-semibold">optional route</span>}
                        </div>
                    )}
                    <button onClick={()=>setActiveStage(stage.id)} className="w-full text-left relative rounded-2xl overflow-hidden group transition-all hover:-translate-y-0.5"
                            style={{ background:stage.optional?"linear-gradient(135deg,rgba(167,139,250,0.07),rgba(255,255,255,0.02))":"linear-gradient(135deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))", border:`1px solid ${a.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
                      <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${a.bar}`}/>
                      <div className="flex items-center gap-4 px-4 py-3">
                        <div className="flex flex-col items-center shrink-0 w-14">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background:a.bg, border:`1px solid ${a.border}` }}>{stage.icon}</div>
                          {!stage.optional?<span className="text-[9px] text-white/20 mt-1">Step {idx+1}</span>:<span className="text-[9px] text-violet-400/50 mt-1">Optional</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-bold text-white/90">{stage.label}</span>
                            {stage.alert && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background:"rgba(251,113,133,0.2)", color:"#fb7185", border:"1px solid rgba(251,113,133,0.3)" }}>{stage.alert}</span>}
                          </div>
                          <p className="text-[11px] text-white/40">{stage.sublabel}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold" style={{ color:a.text }}>{stage.kpi}</p>
                          <p className="text-[10px] text-white/30 mt-0.5 group-hover:text-white/50 transition-colors">Tap for details →</p>
                        </div>
                        {(stage.id==="sewing"||stage.id==="cutting") && (
                            <div className="hidden lg:flex flex-col gap-1 shrink-0 w-40">
                              {(stage.id==="sewing"?sewingLines:cuttingLines).slice(0,3).map((l,i)=>(
                                  <div key={i} className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-white/30 w-12 shrink-0">{l.name}</span>
                                    <div className="flex-1 h-1 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width:`${l.eff}%`, background:effColor(l.eff) }}/></div>
                                    <span className="text-[9px] w-8 text-right font-semibold" style={{ color:effColor(l.eff) }}>{l.eff}%</span>
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>
                    </button>
                  </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <GlassCard color="green">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 font-semibold">Live work order flow — progress through production</p>
            <div className="space-y-4">
              {DATA.workOrders.map(wo => {
                const pct = wo.qty>0?Math.round(wo.done/wo.qty*100):0;
                const stageNow = pct===0?"Cutting":pct<30?"Sewing":pct<60?"In-process QC":pct<80?"Finishing":pct<100?"Packing":"Shipped";
                const stageColor = pct===0?"#fbbf24":pct<60?"#34d399":pct<80?"#fb7185":"#60a5fa";
                const stages = ["WH In","Cutting","Sewing","QC","Finishing","Packing","WH Out"];
                const stageIdx = Math.min(Math.floor(pct/(100/(stages.length-1))),stages.length-1);
                return (
                    <div key={wo.id} className="rounded-xl p-3" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-white/30">{wo.id}</span>
                          <span className="text-xs font-semibold text-white/85">{wo.product}</span>
                          <span className="text-[10px] text-white/40">{wo.buyer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background:`${stageColor}22`, color:stageColor, border:`1px solid ${stageColor}44` }}>▶ {stageNow}</span>
                          <StatusBadge status={wo.status}/><StatusBadge status={wo.priority}/>
                        </div>
                      </div>
                      <div className="flex items-center gap-0 mb-2">
                        {stages.map((s,i)=>(
                            <div key={i} className="flex items-center flex-1">
                              <div className="flex flex-col items-center w-full">
                                <div className="w-2.5 h-2.5 rounded-full transition-all" style={{ background:i<=stageIdx?stageColor:"rgba(255,255,255,0.12)", boxShadow:i===stageIdx?`0 0 6px ${stageColor}88`:"none" }}/>
                                <span className="text-[8px] text-white/25 mt-0.5 text-center leading-tight hidden md:block">{s}</span>
                              </div>
                              {i<stages.length-1&&<div className="flex-1 h-[1px] mb-3" style={{ background:i<stageIdx?stageColor:"rgba(255,255,255,0.08)" }}/>}
                            </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background:effColor(pct) }}/></div>
                        <span className="text-[10px] font-bold w-10 text-right" style={{ color:effColor(pct) }}>{pct}%</span>
                        <span className="text-[10px] text-white/30 w-32 text-right">{wo.done.toLocaleString()} / {Number(wo.qty).toLocaleString()} pcs · Due {wo.due}</span>
                      </div>
                    </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU COMPONENTS
// ═══════════════════════════════════════════════════════════════
function MenuButton({ title, iconPath, onClick, badge, color="white" }) {
  return (
      <button onClick={onClick}
              className="relative flex flex-col items-center justify-center gap-2 w-20 h-20 rounded-2xl cursor-pointer select-none overflow-hidden border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-150 hover:bg-white/18 hover:border-amber-400/40 hover:-translate-y-1 active:scale-95">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"/>
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 via-transparent to-transparent"/>
        {badge && <span className="absolute -top-1 -right-1 z-20 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[9px] font-bold text-gray-900 flex items-center justify-center shadow">{badge}</span>}
        <img src={iconPath} alt={title} className="relative w-8 h-8 object-contain drop-shadow-md flex-shrink-0"
             onError={e=>{ e.target.src="https://api.iconify.design/mdi:dots-grid.svg?color=white"; }}/>
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
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color:a.text }}>{title}</span>
        </div>
        {children}
      </div>
  );
}

function Group({ label, color="amber", children }) {
  const c = { amber:"text-amber-300/60 border-amber-400/20", blue:"text-blue-300/60 border-blue-400/20", green:"text-emerald-300/60 border-emerald-400/20", rose:"text-rose-300/60 border-rose-400/20", violet:"text-violet-300/60 border-violet-400/20", cyan:"text-cyan-300/60 border-cyan-400/20", orange:"text-orange-300/60 border-orange-400/20", teal:"text-teal-300/60 border-teal-400/20" }[color];
  return (
      <div className="mb-4 last:mb-0">
        <p className={`text-[9px] font-semibold tracking-[0.18em] uppercase mb-3 pb-1 border-b ${c}`}>{label}</p>
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
  );
}

function QuickAlerts({ onNav }) {
  const alerts = [
    { icon:"⚠️", text:"WO-2026-004 Sports Jersey is delayed", color:"rose", page:"work-orders" },
    { icon:"📦", text:"Elastic Band 2cm stock below reorder point", color:"amber", page:"materials" },
    { icon:"🔴", text:"2 Critical defects open on Line B2", color:"rose", page:"defects" },
    { icon:"⏳", text:"2 permission requests pending review", color:"amber", page:"permissions" },
    { icon:"📈", text:"View full KPI executive summary report", color:"green", page:"report-kpi" },
  ];
  return (
      <GlassCard color="rose">
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold">⚡ Alerts & Actions</p>
        <div className="space-y-2">
          {alerts.map((a,i)=>(
              <button key={i} onClick={()=>onNav(a.page)} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:bg-white/8 group" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-sm shrink-0">{a.icon}</span>
                <span className="text-[11px] text-white/60 flex-1 group-hover:text-white/80 transition-colors">{a.text}</span>
                <span className="text-[10px] text-white/25 group-hover:text-white/50 shrink-0">→</span>
              </button>
          ))}
        </div>
      </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SECFactory() {
  const [page, setPage] = useState(null);
  const [permBadge] = useState(2);
  const nav = (p) => setPage(p);
  const back = () => setPage(null);

  const PAGES = {
    users:               <UsersPage onBack={back}/>,
    roles:               <RolesPage onBack={back}/>,
    "audit-log":         <AuditLogPage onBack={back}/>,
    settings:            <SettingsPage onBack={back}/>,
    departments:         <DepartmentsPage onBack={back}/>,
    "production-lines":  <ProductionLinesPage onBack={back}/>,
    products:            <ProductsPage onBack={back}/>,
    materials:           <MaterialsPage onBack={back}/>,
    shifts:              <ShiftsPage onBack={back}/>,
    standards:           <StandardsPage onBack={back}/>,
    "work-orders":       <WorkOrdersPage onBack={back}/>,
    schedule:            <SchedulePage onBack={back}/>,
    realtime:            <RealtimePage onBack={back}/>,
    tv:                  <TVDisplayPage onBack={back}/>,
    machines:            <MachinesPage onBack={back}/>,
    defects:             <DefectsPage onBack={back}/>,
    inspections:         <InspectionsPage onBack={back}/>,
    dashboard:           <DashboardPage onBack={back}/>,
    costing:             <CostingPage onBack={back}/>,
    buyers:              <BuyersPage onBack={back}/>,
    suppliers:           <SuppliersPage onBack={back}/>,
    "purchase-orders":   <PurchaseOrdersPage onBack={back}/>,
    shipments:           <ShipmentsPage onBack={back}/>,
    employees:           <EmployeesPage onBack={back}/>,
    attendance:          <AttendancePage onBack={back}/>,
    leave:               <LeavePage onBack={back}/>,
    payroll:             <PayrollPage onBack={back}/>,
    reports:             <ReportsPage onBack={back}/>,
    "production-flow":   <ProductionFlowPage onBack={back}/>,
    "report-production": <ProductionReportPage onBack={back}/>,
    "report-quality":    <QualityReportPage onBack={back}/>,
    "report-hr":         <HRReportPage onBack={back}/>,
    "report-inventory":  <InventoryReportPage onBack={back}/>,
    "report-procurement":<ProcurementReportPage onBack={back}/>,
    "report-finance":    <FinanceReportPage onBack={back}/>,
    "report-maintenance":<MaintenanceReportPage onBack={back}/>,
    "report-kpi":        <KPIReportPage onBack={back}/>,
    permissions:         <PermissionsPage onBack={back}/>,
  };

  const I = (name) => `https://api.iconify.design/mdi:${name}.svg?color=white`;

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .sec-root { font-family: 'Sora', sans-serif; }
        @keyframes fadein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fadein { animation: fadein 0.4s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideup { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .stagger > * { animation: slideup 0.4s cubic-bezier(.22,1,.36,1) both; }
        .stagger > *:nth-child(1){animation-delay:0ms}
        .stagger > *:nth-child(2){animation-delay:40ms}
        .stagger > *:nth-child(3){animation-delay:80ms}
        .stagger > *:nth-child(4){animation-delay:120ms}
        .stagger > *:nth-child(5){animation-delay:160ms}
        .stagger > *:nth-child(6){animation-delay:200ms}
        .stagger > *:nth-child(7){animation-delay:240ms}
        .stagger > *:nth-child(8){animation-delay:280ms}
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

        <div className="sec-root min-h-screen"
             style={{ background:"radial-gradient(ellipse at 10% 10%,#1c2d1a 0%,transparent 50%),radial-gradient(ellipse at 90% 90%,#1a1f2e 0%,transparent 50%),radial-gradient(ellipse at 55% 45%,#1e1a10 0%,transparent 60%),#0c0e0b" }}>

          {/* Background grid */}
          <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>
          <div className="fixed w-96 h-96 rounded-full opacity-[0.08] blur-[100px] pointer-events-none -top-24 -left-24 animate-pulse" style={{ background:"#854d0e" }}/>
          <div className="fixed w-72 h-72 rounded-full opacity-[0.08] blur-[80px] pointer-events-none bottom-0 right-0 animate-pulse" style={{ background:"#1d4ed8", animationDelay:"2s" }}/>

          {/* TOPBAR */}
          <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/[0.06]" style={{ background:"rgba(12,14,11,0.85)" }}>
            <div className="px-5 lg:px-8 py-3 flex items-center gap-4">
              {page && (
                  <button onClick={back} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white/80 transition-all border border-white/10 hover:border-white/20 bg-white/5 shrink-0 hover:-translate-y-px active:translate-y-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Menu
                  </button>
              )}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)" }}>🏭</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-bold text-white/90 tracking-tight leading-tight">SEC Mega Factory</h1>
                <p className="text-[9px] text-white/30 tracking-widest uppercase hidden sm:block">Garment ERP System · Phnom Penh</p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                {!page && (
                    <button onClick={()=>nav("permissions")} className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border hover:-translate-y-px" style={{ background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24" }}>
                      🔐 Permissions
                      {permBadge > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-bold text-gray-900 flex items-center justify-center">{permBadge}</span>}
                    </button>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.25)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                  <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase hidden sm:inline">Live</span>
                </div>
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/25 flex items-center justify-center text-xs font-bold text-amber-300">SK</div>
                  <div className="hidden lg:block">
                    <p className="text-[11px] text-white/70 font-medium leading-none">Sophea Keo</p>
                    <p className="text-[9px] text-white/30 mt-0.5">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="relative z-10 px-5 lg:px-8 py-6" key={page}>
            {page && PAGES[page] ? (
                <div className="fadein max-w-7xl mx-auto">{PAGES[page]}</div>
            ) : (
                <div className="max-w-7xl mx-auto">

                  {/* KPI Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6 fadein">
                    {[
                      {l:"Active Lines",v:"12",i:"⚡",c:"amber"},
                      {l:"Today Output",v:"4,820",i:"👕",c:"green"},
                      {l:"Efficiency",v:"91%",i:"📈",c:"blue"},
                      {l:"Open Defects",v:"7",i:"⚠️",c:"rose"},
                      {l:"Work Orders",v:"5",i:"📋",c:"violet"},
                      {l:"Workers",v:"476",i:"👷",c:"cyan"},
                    ].map(s=><StatCard key={s.l} label={s.l} value={s.v} icon={s.i} color={s.c}/>)}
                  </div>

                  {/* Quick Alerts */}
                  <div className="mb-6 fadein" style={{ animationDelay:"60ms" }}>
                    <QuickAlerts onNav={nav}/>
                  </div>

                  {/* Menu Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 stagger">

                    {/* Administration */}
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

                    {/* Data Setup */}
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

                    {/* Production */}
                    <Section title="Production" icon="🏗️" color="green">
                      <Group label="Planning" color="green">
                        <MenuButton title="Work Orders" iconPath={I("clipboard-list")} onClick={()=>nav("work-orders")} badge="3"/>
                        <MenuButton title="Schedule" iconPath={I("calendar-month")} onClick={()=>nav("schedule")}/>
                        <MenuButton title="Flow" iconPath={I("sitemap")} onClick={()=>nav("production-flow")}/>
                      </Group>
                      <Group label="Monitoring" color="green">
                        <MenuButton title="Real-time" iconPath={I("monitor-eye")} onClick={()=>nav("realtime")}/>
                        <MenuButton title="TV Display" iconPath={I("television-play")} onClick={()=>nav("tv")}/>
                      </Group>
                      <Group label="Reports" color="green">
                        <MenuButton title="Prod. Report" iconPath={I("chart-bar")} onClick={()=>nav("report-production")}/>
                      </Group>
                    </Section>

                    {/* Quality */}
                    <Section title="Quality Control" icon="🔬" color="rose">
                      <Group label="Inspection" color="rose">
                        <MenuButton title="Inspections" iconPath={I("magnify-scan")} onClick={()=>nav("inspections")}/>
                        <MenuButton title="Defects" iconPath={I("alert-circle")} onClick={()=>nav("defects")} badge="2"/>
                      </Group>
                      <Group label="Reports" color="rose">
                        <MenuButton title="Dashboard" iconPath={I("view-dashboard")} onClick={()=>nav("dashboard")}/>
                        <MenuButton title="Quality Rpt" iconPath={I("chart-bar")} onClick={()=>nav("report-quality")}/>
                        <MenuButton title="All Reports" iconPath={I("file-chart")} onClick={()=>nav("reports")}/>
                      </Group>
                    </Section>

                    {/* HR */}
                    <Section title="Human Resources" icon="👷" color="violet">
                      <Group label="Workforce" color="violet">
                        <MenuButton title="Employees" iconPath={I("account-hard-hat")} onClick={()=>nav("employees")}/>
                        <MenuButton title="Attendance" iconPath={I("calendar-check")} onClick={()=>nav("attendance")}/>
                      </Group>
                      <Group label="Compensation" color="violet">
                        <MenuButton title="Leave" iconPath={I("beach")} onClick={()=>nav("leave")}/>
                        <MenuButton title="Payroll" iconPath={I("cash-multiple")} onClick={()=>nav("payroll")}/>
                      </Group>
                      <Group label="Reports" color="violet">
                        <MenuButton title="HR Report" iconPath={I("chart-bar")} onClick={()=>nav("report-hr")}/>
                      </Group>
                    </Section>

                    {/* Procurement */}
                    <Section title="Procurement" icon="📦" color="teal">
                      <Group label="Partners" color="teal">
                        <MenuButton title="Suppliers" iconPath={I("factory")} onClick={()=>nav("suppliers")}/>
                        <MenuButton title="Buyers" iconPath={I("handshake")} onClick={()=>nav("buyers")}/>
                      </Group>
                      <Group label="Orders" color="teal">
                        <MenuButton title="Purchase PO" iconPath={I("package-variant")} onClick={()=>nav("purchase-orders")}/>
                        <MenuButton title="Shipments" iconPath={I("ferry")} onClick={()=>nav("shipments")}/>
                      </Group>
                      <Group label="Reports" color="teal">
                        <MenuButton title="Inventory Rpt" iconPath={I("chart-bar")} onClick={()=>nav("report-inventory")}/>
                        <MenuButton title="Procure Rpt" iconPath={I("chart-bar")} onClick={()=>nav("report-procurement")}/>
                      </Group>
                    </Section>

                    {/* Finance */}
                    <Section title="Finance" icon="💰" color="violet">
                      <Group label="Costing" color="violet">
                        <MenuButton title="Cost Sheet" iconPath={I("calculator")} onClick={()=>nav("costing")}/>
                      </Group>
                      <Group label="Reports" color="violet">
                        <MenuButton title="Finance Rpt" iconPath={I("chart-bar")} onClick={()=>nav("report-finance")}/>
                        <MenuButton title="KPI Report" iconPath={I("finance")} onClick={()=>nav("report-kpi")}/>
                      </Group>
                    </Section>

                    {/* Maintenance */}
                    <Section title="Maintenance" icon="🔧" color="orange">
                      <Group label="Assets" color="orange">
                        <MenuButton title="Machines" iconPath={I("tools")} onClick={()=>nav("machines")}/>
                      </Group>
                      <Group label="Reports" color="orange">
                        <MenuButton title="Maint. Rpt" iconPath={I("chart-bar")} onClick={()=>nav("report-maintenance")}/>
                      </Group>
                    </Section>

                  </div>
                </div>
            )}
          </div>
        </div>
      </>
  );
}