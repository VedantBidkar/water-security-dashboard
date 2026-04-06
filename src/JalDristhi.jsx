import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";

// ── DATA LAYER ──────────────────────────────────────────────────────────────
const STATES_DATA = {
  "Rajasthan": { reservoir: 23, rainfall: 18, groundwater: 12, wqi: "Hazardous", lpcd: 54, stress: 0.92 },
  "Maharashtra": { reservoir: 61, rainfall: 72, groundwater: 41, wqi: "Moderate", lpcd: 112, stress: 0.68 },
  "Tamil Nadu": { reservoir: 44, rainfall: 58, groundwater: 28, wqi: "Moderate", lpcd: 89, stress: 0.74 },
  "Uttar Pradesh": { reservoir: 55, rainfall: 81, groundwater: 31, wqi: "Moderate", lpcd: 78, stress: 0.61 },
  "Punjab": { reservoir: 72, rainfall: 62, groundwater: 19, wqi: "Moderate", lpcd: 134, stress: 0.55 },
  "West Bengal": { reservoir: 83, rainfall: 145, groundwater: 67, wqi: "Safe", lpcd: 98, stress: 0.32 },
  "Gujarat": { reservoir: 38, rainfall: 42, groundwater: 22, wqi: "Hazardous", lpcd: 96, stress: 0.81 },
  "Madhya Pradesh": { reservoir: 67, rainfall: 93, groundwater: 45, wqi: "Safe", lpcd: 71, stress: 0.44 },
  "Karnataka": { reservoir: 52, rainfall: 88, groundwater: 38, wqi: "Moderate", lpcd: 103, stress: 0.58 },
  "Bihar": { reservoir: 48, rainfall: 112, groundwater: 58, wqi: "Moderate", lpcd: 62, stress: 0.49 },
  "Andhra Pradesh": { reservoir: 41, rainfall: 67, groundwater: 33, wqi: "Moderate", lpcd: 85, stress: 0.67 },
  "Odisha": { reservoir: 78, rainfall: 138, groundwater: 72, wqi: "Safe", lpcd: 76, stress: 0.28 },
  "Kerala": { reservoir: 91, rainfall: 298, groundwater: 88, wqi: "Safe", lpcd: 118, stress: 0.15 },
  "Himachal Pradesh": { reservoir: 87, rainfall: 224, groundwater: 81, wqi: "Safe", lpcd: 142, stress: 0.18 },
  "Jharkhand": { reservoir: 69, rainfall: 126, groundwater: 61, wqi: "Moderate", lpcd: 68, stress: 0.38 },
};

const BASINS = [
  { name: "Ganga Basin", storage: 67, capacity: 128, unit: "TMC", status: "Normal" },
  { name: "Brahmaputra", storage: 89, capacity: 104, unit: "TMC", status: "High" },
  { name: "Cauvery", storage: 31, capacity: 51, unit: "TMC", status: "Low" },
  { name: "Krishna", storage: 44, capacity: 78, unit: "TMC", status: "Normal" },
  { name: "Godavari", storage: 58, capacity: 91, unit: "TMC", status: "Normal" },
  { name: "Narmada", storage: 72, capacity: 98, unit: "TMC", status: "Normal" },
];

const RAINFALL_MONTHLY = [
  { month: "Jan", actual: 8, normal: 11, deviation: -27 },
  { month: "Feb", actual: 12, normal: 14, deviation: -14 },
  { month: "Mar", actual: 6, normal: 9, deviation: -33 },
  { month: "Apr", actual: 14, normal: 17, deviation: -18 },
  { month: "May", actual: 31, normal: 36, deviation: -14 },
  { month: "Jun", actual: 142, normal: 155, deviation: -8 },
  { month: "Jul", actual: 287, normal: 263, deviation: +9 },
  { month: "Aug", actual: 241, normal: 244, deviation: -1 },
  { month: "Sep", actual: 178, normal: 164, deviation: +9 },
  { month: "Oct", actual: 61, normal: 72, deviation: -15 },
  { month: "Nov", actual: 22, normal: 28, deviation: -21 },
  { month: "Dec", actual: 9, normal: 12, deviation: -25 },
];

const SECTOR_USAGE = [
  { name: "Agriculture", value: 78, color: "#22c55e" },
  { name: "Domestic", value: 14, color: "#3b82f6" },
  { name: "Industrial", value: 8, color: "#f97316" },
];

const GROUNDWATER_TREND = [
  { year: "2018", depth: 8.2 }, { year: "2019", depth: 9.1 }, { year: "2020", depth: 9.8 },
  { year: "2021", depth: 11.2 }, { year: "2022", depth: 12.4 }, { year: "2023", depth: 13.1 }, { year: "2024", depth: 14.3 },
];

const ALERTS = [
  { id: 1, type: "FLOOD", severity: "HIGH", region: "Assam – Brahmaputra floodplain", time: "14 mins ago", desc: "River level 3.2m above danger mark. 4 districts on orange alert." },
  { id: 2, type: "DROUGHT", severity: "CRITICAL", region: "Vidarbha, Maharashtra", time: "1 hr ago", desc: "Kharif crop irrigation deficit >40%. Emergency water supply initiated." },
  { id: 3, type: "QUALITY", severity: "MEDIUM", region: "Unnao, Uttar Pradesh", time: "3 hrs ago", desc: "Fluoride levels 2.8× above BIS norm in 12 borewells." },
  { id: 4, type: "SCARCITY", severity: "HIGH", region: "Chennai Metropolitan Area", time: "6 hrs ago", desc: "Poondi & Chembarambakkam reservoirs at 24% combined capacity." },
  { id: 5, type: "FLOOD", severity: "MEDIUM", region: "Kerala – Periyar Basin", time: "8 hrs ago", desc: "IMD forecast: 180mm rainfall next 48hrs. SDRF pre-positioned." },
];

const STATE_CONSUMPTION = [
  { state: "Punjab", lpcd: 134 }, { state: "HP", lpcd: 142 }, { state: "Kerala", lpcd: 118 },
  { state: "MH", lpcd: 112 }, { state: "Karnataka", lpcd: 103 }, { state: "WB", lpcd: 98 },
  { state: "Gujarat", lpcd: 96 }, { state: "AP", lpcd: 85 }, { state: "TN", lpcd: 89 },
  { state: "MP", lpcd: 71 }, { state: "Bihar", lpcd: 62 }, { state: "Rajasthan", lpcd: 54 },
];

const AI_INSIGHTS = [
  { region: "Chennai", risk: 87, forecast: "Critical shortage in 45 days", action: "Activate desalination plants; mandatory 20% demand reduction" },
  { region: "Vidarbha", risk: 79, forecast: "Rabi season water deficit 38%", action: "Switch to drip irrigation; restrict sugarcane cultivation" },
  { region: "Rajasthan", risk: 74, forecast: "Groundwater depletion by 2026", action: "Rejuvenate 340 traditional stepwells; ban new borewell drilling" },
  { region: "Ganga Plain", risk: 61, forecast: "Moderate stress by Jul 2025", action: "Enforce riparian buffer zones; upgrade sewage treatment" },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────
function useInterval(cb, delay) {
  const ref = useRef(cb);
  useEffect(() => { ref.current = cb; }, [cb]);
  useEffect(() => {
    const id = setInterval(() => ref.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function wqiColor(wqi) {
  if (wqi === "Safe") return "#22c55e";
  if (wqi === "Moderate") return "#f59e0b";
  return "#ef4444";
}

function stressColor(v) {
  if (v < 0.4) return "#22c55e";
  if (v < 0.7) return "#f59e0b";
  return "#ef4444";
}

function reservoirColor(pct) {
  if (pct >= 60) return "#22c55e";
  if (pct >= 35) return "#f59e0b";
  return "#ef4444";
}

function sevColor(s) {
  if (s === "CRITICAL") return "#ef4444";
  if (s === "HIGH") return "#f97316";
  return "#f59e0b";
}

function alertIcon(type) {
  if (type === "FLOOD") return "🌊";
  if (type === "DROUGHT") return "☀️";
  if (type === "QUALITY") return "⚗️";
  return "💧";
}

// ── MINI SPARKLINE ─────────────────────────────────────────────────────────
function Spark({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── GAUGE BAR ─────────────────────────────────────────────────────────────
function GaugeBar({ value, max = 100, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
    </div>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────────────
function TopBar({ dark, setDark, state, setState, city, setCity }) {
  const [time, setTime] = useState(new Date());
  useInterval(() => setTime(new Date()), 1000);
  const [updated, setUpdated] = useState(0);
  useInterval(() => setUpdated(p => p + 1), 30000);

  const cities = { "Maharashtra": ["Mumbai", "Pune", "Nagpur"], "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"], "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"], "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"], "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"] };

  return (
    <div style={{ background: dark ? "#0a1628" : "#0d2137", borderBottom: "1px solid rgba(255,165,0,0.25)", padding: "0 16px", height: 52, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1d6fa4,#0f4c75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💧</div>
        <div>
          <div style={{ color: "#fff", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", lineHeight: 1 }}>JALDRISTHI</div>
          <div style={{ color: "rgba(255,165,0,0.8)", fontSize: 9, letterSpacing: "0.12em", lineHeight: 1 }}>NATIONAL WATER MONITOR</div>
        </div>
      </div>

      <div style={{ height: 24, width: 1, background: "rgba(255,255,255,0.1)" }} />

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>📍</span>
        <select value={state} onChange={e => { setState(e.target.value); setCity(""); }} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, padding: "3px 6px", borderRadius: 4, cursor: "pointer" }}>
          <option value="All India">All India</option>
          {Object.keys(STATES_DATA).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {cities[state] && (
          <select value={city} onChange={e => setCity(e.target.value)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, padding: "3px 6px", borderRadius: 4 }}>
            <option value="">All Cities</option>
            {cities[state].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 13, fontWeight: 600 }}>{time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>Updated {updated === 0 ? "just now" : `${updated * 30}s ago`}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontSize: 10, letterSpacing: "0.08em" }}>LIVE</span>
        </div>

        <button onClick={() => setDark(!dark)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}

// ── SIDE NAV ──────────────────────────────────────────────────────────────
function SideNav({ page, setPage }) {
  const [hovered, setHovered] = useState(null);
  const items = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "analytics", icon: "◈", label: "Analytics" },
    { id: "region", icon: "⊕", label: "Region Monitor" },
    { id: "alerts", icon: "⚠", label: "Alerts" },
    { id: "ai", icon: "◉", label: "AI Insights" },
    { id: "admin", icon: "⚙", label: "Admin" },
  ];

  return (
    <div style={{ width: 48, background: "#071221", borderRight: "1px solid rgba(255,165,0,0.12)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 4, flexShrink: 0 }}>
      {items.map(item => (
        <div key={item.id} style={{ position: "relative", width: "100%" }}
          onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}>
          <button onClick={() => setPage(item.id)} style={{
            width: "100%", height: 40, background: page === item.id ? "rgba(255,165,0,0.12)" : "transparent",
            border: "none", borderLeft: page === item.id ? "2px solid #f97316" : "2px solid transparent",
            color: page === item.id ? "#f97316" : "rgba(255,255,255,0.35)", cursor: "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
          }}>
            {item.icon}
          </button>
          {hovered === item.id && (
            <div style={{ position: "absolute", left: 52, top: "50%", transform: "translateY(-50%)", background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", color: "#fff", padding: "4px 10px", borderRadius: 4, fontSize: 11, whiteSpace: "nowrap", zIndex: 200, pointerEvents: "none", letterSpacing: "0.06em" }}>
              {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, sub, color = "#3b82f6", icon, trend }) {
  const spark = Array.from({ length: 8 }, (_, i) => ({ v: value * (0.85 + Math.random() * 0.3) }));
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 14 }}>{icon}</span>
      </div>
      <div style={{ color: "#fff", fontFamily: "'Rajdhani',sans-serif", fontSize: 24, fontWeight: 700, lineHeight: 1, marginBottom: 2 }}>
        {value}<span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>{unit}</span>
      </div>
      {sub && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginBottom: 6 }}>{sub}</div>}
      {trend && <Spark data={spark} color={color} />}
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────
function DashboardPage({ state, dark }) {
  const [tick, setTick] = useState(0);
  useInterval(() => setTick(t => t + 1), 5000);
  const sd = state !== "All India" ? STATES_DATA[state] : null;
  const nationalReservoir = 58;
  const nationalLPCD = 91;

  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ROW 1 – KPI STRIP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 10 }}>
        <StatCard label="Reservoir Fill" value={sd ? sd.reservoir : nationalReservoir} unit="%" icon="🏞" color={reservoirColor(sd ? sd.reservoir : nationalReservoir)} trend />
        <StatCard label="Today's Rainfall" value={sd ? Math.round(sd.rainfall * 0.04) : 6} unit="mm" icon="🌧" color="#60a5fa" trend />
        <StatCard label="LPCD Urban" value={sd ? sd.lpcd : nationalLPCD} unit="L" sub="Bureau standard: 135L" icon="🚰" color="#a78bfa" trend />
        <StatCard label="Groundwater" value={sd ? sd.groundwater : 38} unit="m" sub="Avg borewell depth" icon="⬇" color="#f59e0b" trend />
        <StatCard label="Active Alerts" value={ALERTS.length} unit="" sub="2 critical, 3 high" icon="⚠️" color="#ef4444" />
        <StatCard label="IoT Sensors" value={1847} unit="" sub="Online / 2104 total" icon="📡" color="#22d3ee" />
      </div>

      {/* ROW 2 – MAIN CONTENT */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", gap: 12 }}>

        {/* RAINFALL CHART */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>MONSOON RAINFALL TRACKER 2024 (mm)</span>
            <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 10, padding: "2px 8px", borderRadius: 10, border: "1px solid rgba(34,197,94,0.3)" }}>SW Monsoon Active</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={RAINFALL_MONTHLY}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", borderRadius: 6, fontSize: 11, color: "#fff" }} />
              <Area type="monotone" dataKey="normal" stroke="#f97316" strokeWidth={1} fill="none" strokeDasharray="3 3" name="Normal" />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fill="url(#rg)" name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,0.4)" }}><span style={{ width: 20, height: 2, background: "#3b82f6", display: "inline-block" }} />Actual</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,0.4)" }}><span style={{ width: 20, height: 2, background: "#f97316", display: "inline-block", borderTop: "2px dashed #f97316" }} />Normal</div>
          </div>
        </div>

        {/* SECTOR PIE */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>SECTORAL WATER USE</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={SECTOR_USAGE} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270}>
                {SECTOR_USAGE.map((d, i) => <Cell key={i} fill={d.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 11, color: "#fff" }} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {SECTOR_USAGE.map(d => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUPPLY vs DEMAND */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>SUPPLY vs DEMAND</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Available Supply", value: 71, color: "#22c55e" },
              { label: "Current Demand", value: 89, color: "#ef4444" },
              { label: "Deficit", value: 18, color: "#f97316" },
            ].map(d => (
              <div key={d.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{d.label}</span>
                  <span style={{ fontSize: 11, color: d.color, fontWeight: 700 }}>{d.value} BCM</span>
                </div>
                <GaugeBar value={d.value} max={100} color={d.color} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10 }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: "0.06em" }}>GROUNDWATER DEPLETION TREND</div>
            <ResponsiveContainer width="100%" height={70}>
              <LineChart data={GROUNDWATER_TREND}>
                <Line type="monotone" dataKey="depth" stroke="#f97316" strokeWidth={2} dot={{ r: 2, fill: "#f97316" }} />
                <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", borderRadius: 6, fontSize: 10, color: "#fff" }} formatter={(v) => [`${v}m`, "Depth"]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 12 }}>

        {/* BASIN STATUS */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>MAJOR RIVER BASINS (TMC)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BASINS.map(b => {
              const pct = Math.round((b.storage / b.capacity) * 100);
              const col = reservoirColor(pct);
              return (
                <div key={b.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{b.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{b.storage}/{b.capacity}</span>
                      <span style={{ fontSize: 10, color: col, fontWeight: 700 }}>{pct}%</span>
                    </div>
                  </div>
                  <GaugeBar value={pct} max={100} color={col} />
                </div>
              );
            })}
          </div>
        </div>

        {/* STATE CONSUMPTION BAR */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>STATE CONSUMPTION LPCD vs BIS NORM (135L)</div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={STATE_CONSUMPTION} layout="vertical" margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" domain={[0, 160]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="state" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", borderRadius: 6, fontSize: 11, color: "#fff" }} />
              <Bar dataKey="lpcd" radius={2}>
                {STATE_CONSUMPTION.map((d, i) => <Cell key={i} fill={d.lpcd >= 135 ? "#22c55e" : d.lpcd >= 70 ? "#f59e0b" : "#ef4444"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* WQI TABLE */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>WATER QUALITY INDEX</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(STATES_DATA).slice(0, 8).map(([name, d]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px", borderRadius: 4, background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{name}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>pH {(6.8 + Math.random() * 1.2).toFixed(1)}</span>
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: `${wqiColor(d.wqi)}22`, color: wqiColor(d.wqi), border: `1px solid ${wqiColor(d.wqi)}44` }}>
                    {d.wqi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4 – ALERTS STRIP */}
      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>⚠ ACTIVE ALERTS</span>
          <span style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 9, padding: "1px 8px", borderRadius: 10 }}>{ALERTS.length} ACTIVE</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {ALERTS.map(a => (
            <div key={a.id} style={{ padding: "8px 10px", borderRadius: 6, background: `${sevColor(a.severity)}11`, border: `1px solid ${sevColor(a.severity)}33` }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12 }}>{alertIcon(a.type)}</span>
                <span style={{ fontSize: 9, color: sevColor(a.severity), fontWeight: 700, letterSpacing: "0.06em" }}>{a.type}</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, marginBottom: 3 }}>{a.region}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── ANALYTICS PAGE ────────────────────────────────────────────────────────
function AnalyticsPage() {
  const heatData = Object.entries(STATES_DATA).map(([s, d]) => ({ state: s, stress: d.stress, lpcd: d.lpcd, reservoir: d.reservoir }));

  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>DEEP ANALYTICS – HISTORICAL & COMPARATIVE</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>ANNUAL RAINFALL TREND (mm)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { year: "2018", rain: 891 }, { year: "2019", rain: 976 }, { year: "2020", rain: 1091 },
              { year: "2021", rain: 1023 }, { year: "2022", rain: 882 }, { year: "2023", rain: 941 }, { year: "2024", rain: 998 },
            ]}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", borderRadius: 6, fontSize: 11, color: "#fff" }} />
              <Bar dataKey="rain" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>STATE WATER STRESS INDEX</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={heatData.sort((a, b) => b.stress - a.stress)} layout="vertical">
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} />
              <YAxis type="category" dataKey="state" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", borderRadius: 6, fontSize: 11, color: "#fff" }} formatter={v => [`${(v * 100).toFixed(0)}%`, "Stress"]} />
              <Bar dataKey="stress" radius={2}>
                {heatData.sort((a, b) => b.stress - a.stress).map((d, i) => <Cell key={i} fill={stressColor(d.stress)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }}>
        <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>DROUGHT PATTERN – HISTORICAL COMPARISON</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {["2018", "2019", "2020", "2021", "2022", "2023", "2024"].map(yr => (
            <div key={yr}>
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 9, marginBottom: 4 }}>{yr}</div>
              {Object.entries(STATES_DATA).map(([s, d]) => (
                <div key={s} title={`${s}: ${Math.round(d.stress * 100)}%`} style={{
                  height: 14, marginBottom: 2, borderRadius: 2,
                  background: `hsl(${120 - d.stress * 120},70%,${20 + (1 - d.stress) * 25}%)`,
                  opacity: 0.7 + Math.random() * 0.3
                }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
          {[["Low stress", "#22c55e"], ["Moderate", "#f59e0b"], ["High stress", "#ef4444"]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
              <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />{l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── REGION MONITOR PAGE ────────────────────────────────────────────────────
function RegionPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>REGION MONITOR – STATE DRILL-DOWN</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {Object.entries(STATES_DATA).map(([name, d]) => (
          <div key={name} onClick={() => setSelected(selected === name ? null : name)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
            background: selected === name ? "rgba(255,165,0,0.08)" : "rgba(255,255,255,0.03)",
            border: selected === name ? "1px solid rgba(255,165,0,0.4)" : "1px solid rgba(255,255,255,0.07)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>{name}</span>
              <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 8, background: `${wqiColor(d.wqi)}22`, color: wqiColor(d.wqi), border: `1px solid ${wqiColor(d.wqi)}44` }}>{d.wqi}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
              {[["Reservoir", `${d.reservoir}%`, reservoirColor(d.reservoir)], ["LPCD", `${d.lpcd}L`, "#a78bfa"], ["GW", `${d.groundwater}m`, "#f59e0b"]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>{l}</div>
                  <div style={{ color: c, fontSize: 12, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 6 }}>
              <GaugeBar value={d.stress * 100} max={100} color={stressColor(d.stress)} />
              <div style={{ textAlign: "right", fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Stress: {Math.round(d.stress * 100)}%</div>
            </div>
            {selected === name && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                <div>Rainfall deviation: {d.rainfall > 80 ? "+" : ""}{Math.round((d.rainfall / 90 - 1) * 100)}% from normal</div>
                <div>Annual abstraction: {Math.round(d.lpcd * 3.65 / 10)} BCM/year</div>
                <div>Seasonal crop type: {d.rainfall > 100 ? "Kharif dominant" : "Rabi dependent"}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ALERTS PAGE ────────────────────────────────────────────────────────────
function AlertsPage() {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? ALERTS : ALERTS.filter(a => a.type === filter);
  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "rgba(255,165,0,0.9)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>ALERT MANAGEMENT CENTRE</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["ALL", "FLOOD", "DROUGHT", "QUALITY", "SCARCITY"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "3px 10px", borderRadius: 10, fontSize: 10, cursor: "pointer", transition: "all 0.2s",
              background: filter === f ? "rgba(255,165,0,0.15)" : "transparent",
              border: filter === f ? "1px solid rgba(255,165,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
              color: filter === f ? "#f97316" : "rgba(255,255,255,0.4)"
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(a => (
          <div key={a.id} style={{ padding: "12px 14px", borderRadius: 8, background: `${sevColor(a.severity)}08`, border: `1px solid ${sevColor(a.severity)}30`, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 24 }}>{alertIcon(a.type)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: sevColor(a.severity), letterSpacing: "0.06em" }}>{a.severity}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", padding: "1px 7px", borderRadius: 8 }}>{a.type}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginLeft: "auto" }}>{a.time}</span>
              </div>
              <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 4 }}>{a.region}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{a.desc}</div>
            </div>
            <button style={{ padding: "5px 14px", borderRadius: 6, background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.3)", color: "#f97316", fontSize: 10, cursor: "pointer" }}>RESPOND</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI INSIGHTS PAGE ──────────────────────────────────────────────────────
function AIPage() {
  const [loading, setLoading] = useState(false);
  const [analysed, setAnalysed] = useState(false);

  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "rgba(255,165,0,0.9)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>AI-POWERED WATER INTELLIGENCE ENGINE</span>
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setAnalysed(true); }, 1800); }} style={{
          padding: "6px 18px", borderRadius: 6, background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(168,85,247,0.2))",
          border: "1px solid rgba(59,130,246,0.4)", color: "#60a5fa", fontSize: 11, cursor: "pointer", letterSpacing: "0.06em"
        }}>
          {loading ? "⏳ Analysing..." : "◉ RUN ANALYSIS"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {AI_INSIGHTS.map((ins, i) => (
          <div key={ins.region} style={{ padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderTop: `2px solid ${ins.risk > 80 ? "#ef4444" : ins.risk > 70 ? "#f97316" : "#f59e0b"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{ins.region}</span>
              <div style={{ position: "relative", width: 44, height: 44 }}>
                <svg viewBox="0 0 44 44" width="44" height="44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke={ins.risk > 80 ? "#ef4444" : ins.risk > 70 ? "#f97316" : "#f59e0b"} strokeWidth="4"
                    strokeDasharray={`${ins.risk * 1.13} 113`} strokeLinecap="round" transform="rotate(-90 22 22)" />
                  <text x="22" y="26" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{ins.risk}</text>
                </svg>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginBottom: 3 }}>FORECAST</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{ins.forecast}</div>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div style={{ fontSize: 9, color: "#22c55e", letterSpacing: "0.06em", marginBottom: 3 }}>RECOMMENDED ACTION</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{ins.action}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }}>
        <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>DEMAND FORECAST – NEXT 12 MONTHS (BCM)</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={[
            { m: "Apr", demand: 81, supply: 76 }, { m: "May", demand: 84, supply: 72 }, { m: "Jun", demand: 79, supply: 78 },
            { m: "Jul", demand: 74, supply: 91 }, { m: "Aug", demand: 72, supply: 88 }, { m: "Sep", demand: 76, supply: 82 },
            { m: "Oct", demand: 78, supply: 79 }, { m: "Nov", demand: 82, supply: 74 }, { m: "Dec", demand: 85, supply: 70 },
            { m: "Jan", demand: 83, supply: 68 }, { m: "Feb", demand: 86, supply: 65 }, { m: "Mar", demand: 89, supply: 63 },
          ]}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="m" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} domain={[55, 100]} />
            <Tooltip contentStyle={{ background: "#0d2137", border: "1px solid rgba(255,165,0,0.2)", borderRadius: 6, fontSize: 11, color: "#fff" }} />
            <Line type="monotone" dataKey="demand" stroke="#ef4444" strokeWidth={2} dot={false} name="Demand" />
            <Line type="monotone" dataKey="supply" stroke="#22c55e" strokeWidth={2} dot={false} name="Supply" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────────
function AdminPage() {
  const [refresh, setRefresh] = useState(30);
  const sensors = [
    { id: "IOT-MH-001", loc: "Pune Reservoir", status: "Online", battery: 87, last: "2s ago" },
    { id: "IOT-TN-034", loc: "Mettur Dam", status: "Online", battery: 62, last: "4s ago" },
    { id: "IOT-RJ-012", loc: "Bisalpur Dam", status: "Warning", battery: 23, last: "18s ago" },
    { id: "IOT-KA-078", loc: "Kabini Reservoir", status: "Online", battery: 91, last: "1s ago" },
    { id: "IOT-GJ-003", loc: "Sardar Sarovar", status: "Offline", battery: 0, last: "4m ago" },
    { id: "IOT-WB-021", loc: "DVC Maithon", status: "Online", battery: 74, last: "3s ago" },
  ];
  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>ADMIN & CONFIGURATION</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>IoT SENSOR STATUS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sensors.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.status === "Online" ? "#22c55e" : s.status === "Warning" ? "#f59e0b" : "#ef4444", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>{s.id}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{s.last}</span>
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{s.loc}</div>
                </div>
                <div style={{ fontSize: 9, color: s.battery > 30 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{s.battery}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "rgba(255,165,0,0.9)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>SYSTEM SETTINGS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>AUTO-REFRESH INTERVAL</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[15, 30, 60, 120].map(v => (
                  <button key={v} onClick={() => setRefresh(v)} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", background: refresh === v ? "rgba(255,165,0,0.15)" : "transparent", border: refresh === v ? "1px solid rgba(255,165,0,0.4)" : "1px solid rgba(255,255,255,0.1)", color: refresh === v ? "#f97316" : "rgba(255,255,255,0.4)" }}>{v}s</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>API ENDPOINTS STATUS</label>
              {["/india/water-levels", "/india/rainfall", "/india/groundwater", "/india/consumption", "/india/alerts"].map(ep => (
                <div key={ep} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{ep}</span>
                  <span style={{ fontSize: 9, color: "#22c55e" }}>● 200 OK</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button style={{ flex: 1, padding: "8px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", fontSize: 11, cursor: "pointer" }}>📄 Export CSV</button>
              <button style={{ flex: 1, padding: "8px", borderRadius: 6, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", fontSize: 11, cursor: "pointer" }}>📋 Export PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────
export default function JalDristhi() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [state, setState] = useState("All India");
  const [city, setCity] = useState("");

  const pages = { dashboard: DashboardPage, analytics: AnalyticsPage, region: RegionPage, alerts: AlertsPage, ai: AIPage, admin: AdminPage };
  const PageComponent = pages[page];

  return (
    <div style={{ fontFamily: "'Rajdhani', 'IBM Plex Sans', 'Noto Sans', sans-serif", background: dark ? "#060f1c" : "#0a1a2e", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        select option { background: #0d2137; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,165,0,0.2); border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>

      <TopBar dark={dark} setDark={setDark} state={state} setState={setState} city={city} setCity={setCity} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SideNav page={page} setPage={setPage} />
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <PageComponent state={state} dark={dark} />
        </div>
      </div>
    </div>
  );
}
