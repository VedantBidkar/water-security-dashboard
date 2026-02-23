/* ═══════════════════════════════════════════════════════════════
   script.js — Water Security & Drought Management Dashboard
   India | JalDrishti
   
   Sections:
   1. Configuration & Constants
   2. Simulated Data
   3. Utility Functions
   4. Navbar & Scroll Behavior
   5. Hero Counter Animation
   6. Metric Cards
   7. Weather API Integration
   8. Leaflet Map (Choropleth + Heatmap)
   9. Chart.js Analytics
   10. Alert System
   11. Policy & SDG Section
   12. Intersection Observer (fade-in)
   13. Init
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────────────
   1. CONFIGURATION & CONSTANTS
──────────────────────────────────────────────────────────────── */

// ⚠️ Replace with your OpenWeatherMap API key
// Get a free key at: https://openweathermap.org/api
const CONFIG = {
  OWM_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY',
  OWM_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  // Drought thresholds (based on IMD guidelines)
  RAINFALL_EXTREME_THRESHOLD:  20,  // mm/month
  RAINFALL_SEVERE_THRESHOLD:   40,  // mm/month
  TEMP_EXTREME_THRESHOLD:      40,  // °C
  TEMP_SEVERE_THRESHOLD:       36,  // °C
  // India GeoJSON — public domain India states boundary
  INDIA_GEOJSON_URL: 'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson',
};

// Drought severity levels
const SEVERITY = {
  NORMAL:   { label: 'Normal',   color: '#22c55e', fillOpacity: 0.35 },
  MODERATE: { label: 'Moderate', color: '#facc15', fillOpacity: 0.50 },
  SEVERE:   { label: 'Severe',   color: '#f97316', fillOpacity: 0.60 },
  EXTREME:  { label: 'Extreme',  color: '#ef4444', fillOpacity: 0.70 },
};

/* ────────────────────────────────────────────────────────────────
   2. SIMULATED DATA
   (Historical and current data for all major Indian states)
──────────────────────────────────────────────────────────────── */

// Per-state simulated data for three years
const STATE_DATA = {
  2025: {
    'Rajasthan':       { rainfall: 15, temp: 42, reservoir: 28, groundwater: 45 },
    'Gujarat':         { rainfall: 22, temp: 38, reservoir: 40, groundwater: 52 },
    'Haryana':         { rainfall: 30, temp: 37, reservoir: 55, groundwater: 38 },
    'Punjab':          { rainfall: 45, temp: 34, reservoir: 62, groundwater: 41 },
    'Uttar Pradesh':   { rainfall: 50, temp: 36, reservoir: 58, groundwater: 35 },
    'Madhya Pradesh':  { rainfall: 32, temp: 39, reservoir: 48, groundwater: 42 },
    'Maharashtra':     { rainfall: 28, temp: 37, reservoir: 45, groundwater: 48 },
    'Karnataka':       { rainfall: 60, temp: 33, reservoir: 72, groundwater: 28 },
    'Andhra Pradesh':  { rainfall: 35, temp: 38, reservoir: 50, groundwater: 40 },
    'Tamil Nadu':      { rainfall: 55, temp: 34, reservoir: 68, groundwater: 30 },
    'Kerala':          { rainfall: 180, temp: 30, reservoir: 90, groundwater: 12 },
    'Telangana':       { rainfall: 40, temp: 37, reservoir: 55, groundwater: 38 },
    'Odisha':          { rainfall: 75, temp: 33, reservoir: 78, groundwater: 22 },
    'West Bengal':     { rainfall: 90, temp: 32, reservoir: 80, groundwater: 20 },
    'Bihar':           { rainfall: 65, temp: 35, reservoir: 70, groundwater: 28 },
    'Jharkhand':       { rainfall: 70, temp: 33, reservoir: 74, groundwater: 25 },
    'Chhattisgarh':    { rainfall: 68, temp: 34, reservoir: 72, groundwater: 26 },
    'Uttarakhand':     { rainfall: 95, temp: 28, reservoir: 85, groundwater: 18 },
    'Himachal Pradesh':{ rainfall: 100, temp: 22, reservoir: 88, groundwater: 16 },
    'Assam':           { rainfall: 120, temp: 29, reservoir: 92, groundwater: 14 },
    'Manipur':         { rainfall: 110, temp: 27, reservoir: 88, groundwater: 16 },
    'Meghalaya':       { rainfall: 200, temp: 24, reservoir: 95, groundwater: 10 },
    'Mizoram':         { rainfall: 160, temp: 25, reservoir: 93, groundwater: 12 },
    'Nagaland':        { rainfall: 130, temp: 26, reservoir: 90, groundwater: 14 },
    'Tripura':         { rainfall: 140, temp: 27, reservoir: 91, groundwater: 13 },
    'Arunachal Pradesh':{ rainfall: 180, temp: 23, reservoir: 95, groundwater: 10 },
    'Sikkim':          { rainfall: 150, temp: 20, reservoir: 92, groundwater: 12 },
    'Goa':             { rainfall: 190, temp: 29, reservoir: 94, groundwater: 11 },
    'Delhi':           { rainfall: 25, temp: 38, reservoir: 38, groundwater: 48 },
    'Jammu and Kashmir':{ rainfall: 80, temp: 18, reservoir: 82, groundwater: 20 },
    'Ladakh':          { rainfall: 12, temp: 10, reservoir: 40, groundwater: 55 },
  },
  2024: {
    'Rajasthan':       { rainfall: 12, temp: 43, reservoir: 22, groundwater: 50 },
    'Gujarat':         { rainfall: 18, temp: 39, reservoir: 35, groundwater: 55 },
    'Haryana':         { rainfall: 25, temp: 38, reservoir: 50, groundwater: 42 },
    'Punjab':          { rainfall: 38, temp: 35, reservoir: 58, groundwater: 44 },
    'Uttar Pradesh':   { rainfall: 44, temp: 37, reservoir: 52, groundwater: 38 },
    'Madhya Pradesh':  { rainfall: 28, temp: 40, reservoir: 42, groundwater: 45 },
    'Maharashtra':     { rainfall: 24, temp: 38, reservoir: 40, groundwater: 52 },
    'Karnataka':       { rainfall: 52, temp: 34, reservoir: 66, groundwater: 32 },
    'Andhra Pradesh':  { rainfall: 30, temp: 39, reservoir: 44, groundwater: 44 },
    'Tamil Nadu':      { rainfall: 48, temp: 35, reservoir: 62, groundwater: 34 },
    'Kerala':          { rainfall: 160, temp: 31, reservoir: 87, groundwater: 15 },
    'Telangana':       { rainfall: 35, temp: 38, reservoir: 50, groundwater: 42 },
    'Odisha':          { rainfall: 68, temp: 34, reservoir: 74, groundwater: 26 },
    'West Bengal':     { rainfall: 82, temp: 33, reservoir: 76, groundwater: 24 },
    'Bihar':           { rainfall: 58, temp: 36, reservoir: 65, groundwater: 32 },
    'Jharkhand':       { rainfall: 62, temp: 34, reservoir: 68, groundwater: 28 },
    'Chhattisgarh':    { rainfall: 60, temp: 35, reservoir: 68, groundwater: 30 },
    'Uttarakhand':     { rainfall: 88, temp: 29, reservoir: 80, groundwater: 22 },
    'Himachal Pradesh':{ rainfall: 92, temp: 23, reservoir: 84, groundwater: 19 },
    'Assam':           { rainfall: 110, temp: 30, reservoir: 88, groundwater: 18 },
    'Manipur':         { rainfall: 100, temp: 28, reservoir: 84, groundwater: 20 },
    'Meghalaya':       { rainfall: 185, temp: 25, reservoir: 93, groundwater: 12 },
    'Mizoram':         { rainfall: 148, temp: 26, reservoir: 91, groundwater: 14 },
    'Nagaland':        { rainfall: 120, temp: 27, reservoir: 87, groundwater: 16 },
    'Tripura':         { rainfall: 130, temp: 28, reservoir: 89, groundwater: 15 },
    'Arunachal Pradesh':{ rainfall: 170, temp: 24, reservoir: 93, groundwater: 12 },
    'Sikkim':          { rainfall: 140, temp: 21, reservoir: 90, groundwater: 14 },
    'Goa':             { rainfall: 180, temp: 30, reservoir: 92, groundwater: 13 },
    'Delhi':           { rainfall: 20, temp: 39, reservoir: 32, groundwater: 52 },
    'Jammu and Kashmir':{ rainfall: 72, temp: 19, reservoir: 78, groundwater: 24 },
    'Ladakh':          { rainfall: 10, temp: 11, reservoir: 35, groundwater: 58 },
  },
  2023: {
    'Rajasthan':       { rainfall: 18, temp: 41, reservoir: 32, groundwater: 42 },
    'Gujarat':         { rainfall: 26, temp: 37, reservoir: 46, groundwater: 49 },
    'Haryana':         { rainfall: 34, temp: 36, reservoir: 60, groundwater: 36 },
    'Punjab':          { rainfall: 50, temp: 33, reservoir: 66, groundwater: 38 },
    'Uttar Pradesh':   { rainfall: 55, temp: 35, reservoir: 62, groundwater: 32 },
    'Madhya Pradesh':  { rainfall: 36, temp: 38, reservoir: 52, groundwater: 40 },
    'Maharashtra':     { rainfall: 32, temp: 36, reservoir: 50, groundwater: 44 },
    'Karnataka':       { rainfall: 65, temp: 32, reservoir: 76, groundwater: 25 },
    'Andhra Pradesh':  { rainfall: 40, temp: 37, reservoir: 54, groundwater: 36 },
    'Tamil Nadu':      { rainfall: 60, temp: 33, reservoir: 70, groundwater: 27 },
    'Kerala':          { rainfall: 190, temp: 29, reservoir: 92, groundwater: 10 },
    'Telangana':       { rainfall: 44, temp: 36, reservoir: 58, groundwater: 35 },
    'Odisha':          { rainfall: 80, temp: 32, reservoir: 80, groundwater: 20 },
    'West Bengal':     { rainfall: 96, temp: 31, reservoir: 82, groundwater: 18 },
    'Bihar':           { rainfall: 70, temp: 34, reservoir: 74, groundwater: 26 },
    'Jharkhand':       { rainfall: 75, temp: 32, reservoir: 78, groundwater: 22 },
    'Chhattisgarh':    { rainfall: 72, temp: 33, reservoir: 76, groundwater: 24 },
    'Uttarakhand':     { rainfall: 100, temp: 27, reservoir: 87, groundwater: 16 },
    'Himachal Pradesh':{ rainfall: 105, temp: 21, reservoir: 90, groundwater: 15 },
    'Assam':           { rainfall: 125, temp: 28, reservoir: 93, groundwater: 13 },
    'Manipur':         { rainfall: 115, temp: 26, reservoir: 90, groundwater: 15 },
    'Meghalaya':       { rainfall: 205, temp: 23, reservoir: 96, groundwater: 9  },
    'Mizoram':         { rainfall: 165, temp: 24, reservoir: 94, groundwater: 11 },
    'Nagaland':        { rainfall: 135, temp: 25, reservoir: 91, groundwater: 13 },
    'Tripura':         { rainfall: 145, temp: 26, reservoir: 92, groundwater: 12 },
    'Arunachal Pradesh':{ rainfall: 185, temp: 22, reservoir: 96, groundwater: 9 },
    'Sikkim':          { rainfall: 155, temp: 19, reservoir: 93, groundwater: 11 },
    'Goa':             { rainfall: 195, temp: 28, reservoir: 95, groundwater: 10 },
    'Delhi':           { rainfall: 28, temp: 37, reservoir: 42, groundwater: 44 },
    'Jammu and Kashmir':{ rainfall: 85, temp: 17, reservoir: 84, groundwater: 18 },
    'Ladakh':          { rainfall: 14, temp: 9,  reservoir: 44, groundwater: 52 },
  }
};

// Monthly rainfall data for chart (simulated for All India, per year)
const MONTHLY_RAINFALL = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  'All India': {
    actual:  [12, 10, 14, 18, 30, 110, 285, 265, 190, 80, 32, 16],
    normal:  [15, 13, 12, 15, 28, 120, 280, 270, 195, 85, 30, 18],
  },
  'Rajasthan': {
    actual:  [4, 3, 4, 5, 10, 30, 85, 90, 50, 15, 6, 3],
    normal:  [5, 4, 4, 5, 12, 35, 95, 100, 55, 18, 7, 4],
  },
  'Maharashtra': {
    actual:  [5, 4, 8, 15, 25, 130, 310, 290, 185, 80, 25, 8],
    normal:  [6, 5, 9, 16, 28, 140, 320, 295, 195, 90, 28, 10],
  },
  'Kerala': {
    actual:  [35, 28, 48, 95, 210, 450, 560, 430, 295, 260, 160, 65],
    normal:  [32, 26, 44, 90, 205, 440, 550, 420, 285, 255, 155, 60],
  },
  'Punjab': {
    actual:  [30, 28, 22, 15, 20, 55, 175, 190, 95, 22, 12, 24],
    normal:  [35, 30, 25, 17, 22, 60, 185, 200, 100, 25, 14, 28],
  },
};

// Reservoir data (BCM — billion cubic meters) for top 10 reservoirs
const RESERVOIR_DATA = {
  labels: ['Indirasagar','Nagarjunasagar','Bhakra','Hirakud','Srisailam','Koyna','Ukai','Tungabhadra','Bansagar','Rana Pratap'],
  current: [7.4, 5.9, 7.0, 3.9, 8.6, 2.8, 4.5, 2.1, 3.6, 1.2],
  capacity:[12.2, 11.5, 9.9, 8.1, 11.1, 2.8, 8.5, 3.6, 5.4, 2.9],
};

// Groundwater depth trend (meters below surface, 12 months)
const GROUNDWATER_DATA = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  depth:  [18, 19, 20, 22, 24, 25, 21, 18, 16, 15, 16, 17],
};

// Water usage by sector
const WATER_USAGE = {
  labels: ['Agriculture', 'Domestic', 'Industrial', 'Energy', 'Environment'],
  data:   [78, 8, 7, 4, 3],
  colors: ['#0ea5e9','#22c55e','#f97316','#facc15','#8b5cf6'],
};

// Heatmap points [lat, lng, intensity] — water stress hotspots across India
const HEATMAP_POINTS = [
  // Rajasthan (high stress)
  [26.91, 70.90, 0.9],[25.33, 74.63, 0.85],[27.02, 74.22, 0.88],
  [28.01, 73.31, 0.92],[26.45, 73.10, 0.87],
  // Gujarat
  [23.22, 72.65, 0.7],[22.30, 70.78, 0.75],[23.85, 72.10, 0.68],
  // Haryana
  [29.05, 76.08, 0.65],[28.45, 77.00, 0.60],
  // Delhi
  [28.65, 77.22, 0.72],
  // Maharashtra (Vidarbha)
  [20.93, 77.75, 0.70],[20.00, 76.83, 0.65],[21.15, 79.09, 0.68],
  // Andhra / Telangana
  [15.82, 78.33, 0.60],[17.38, 78.49, 0.55],[16.50, 80.63, 0.58],
  // Karnataka
  [14.46, 77.31, 0.55],[15.35, 75.14, 0.52],
  // Tamil Nadu
  [11.12, 78.65, 0.50],[10.79, 79.13, 0.48],
  // UP
  [26.85, 80.91, 0.55],[27.57, 80.08, 0.52],
  // Normal regions (low stress)
  [15.33, 74.99, 0.1],[8.51, 76.96, 0.05],[11.59, 76.27, 0.1],
  [25.47, 90.36, 0.05],[27.10, 93.62, 0.04],[22.98, 88.45, 0.08],
];

// Alert feed seed data
const SEED_ALERTS = [
  { severity: 'extreme',  state: 'Rajasthan',  message: 'Extreme drought conditions — rainfall 15mm (deficit 70%)',  time: '2 hours ago' },
  { severity: 'severe',   state: 'Gujarat',    message: 'Severe water stress — reservoir at 40% capacity',           time: '5 hours ago' },
  { severity: 'moderate', state: 'Maharashtra', message: 'Moderate drought — groundwater depth +18% above normal',  time: '12 hours ago' },
  { severity: 'severe',   state: 'Haryana',    message: 'Severe heat wave — temperature 39°C (3°C above normal)',   time: '1 day ago' },
  { severity: 'normal',   state: 'Kerala',     message: 'Normal conditions — above-average rainfall recorded',       time: '1 day ago' },
];

// Policy data
const POLICY_DATA = [
  {
    icon: 'fas fa-hand-holding-water',
    title: 'National Drought Mitigation Scheme (NDMS)',
    desc: 'Centrally-sponsored scheme for drought relief, crop insurance, and water harvesting in drought-prone districts.',
    items: ['₹2,250 crore annual outlay', 'Covers 250+ drought-prone districts', 'Integrated with MGNREGS'],
  },
  {
    icon: 'fas fa-tint',
    title: 'Jal Jeevan Mission (JJM)',
    desc: 'Flagship program to provide functional household tap connections (FHTC) to every rural household by 2024.',
    items: ['19+ crore connections delivered', 'Safe drinking water focus', '₹3.6 lakh crore investment'],
  },
  {
    icon: 'fas fa-water',
    title: 'Atal Bhujal Yojana (ABY)',
    desc: 'Groundwater management in water-stressed states through community-led conservation and demand-side management.',
    items: ['7 states covered', 'Community-driven approach', 'Focus on over-exploited aquifers'],
  },
  {
    icon: 'fas fa-seedling',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    desc: 'Comprehensive crop insurance scheme protecting farmers against crop loss due to drought, flood, and other perils.',
    items: ['5.5 crore farmers covered', 'Subsidized premium rates', '₹1.4 lakh crore claims settled'],
  },
  {
    icon: 'fas fa-chart-pie',
    title: 'Water Allocation Policy (WAP 2022)',
    desc: 'Inter-state and intra-state water sharing framework under the National Water Framework Law principles.',
    items: ['Basin-level water budgeting', 'Priority: drinking > irrigation', 'Groundwater regulation boards'],
  },
  {
    icon: 'fas fa-dam',
    title: 'Reservoir Management Guidelines',
    desc: 'CWC-mandated guidelines for real-time flood forecasting, storage optimization, and drought contingency protocols.',
    items: ['Real-time telemetry at 143 reservoirs', 'Dynamic rule curves', 'Integrated flood–drought management'],
  },
];

// SDG 6 indicators
const SDG_INDICATORS = [
  { label: 'Safe drinking water access (rural)', value: 76, target: 100 },
  { label: 'Sanitation & open defecation free', value: 89, target: 100 },
  { label: 'Water-use efficiency improvement', value: 42, target: 100 },
  { label: 'Integrated water resources management', value: 55, target: 100 },
  { label: 'Transboundary water cooperation', value: 38, target: 100 },
];

/* ────────────────────────────────────────────────────────────────
   3. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Compute drought severity from rainfall and temperature
 * @param {number} rainfall - mm
 * @param {number} temp - °C
 * @returns {string} 'NORMAL' | 'MODERATE' | 'SEVERE' | 'EXTREME'
 */
function getDroughtSeverity(rainfall, temp) {
  if (rainfall < CONFIG.RAINFALL_EXTREME_THRESHOLD && temp > CONFIG.TEMP_EXTREME_THRESHOLD) {
    return 'EXTREME';
  }
  if (rainfall < CONFIG.RAINFALL_EXTREME_THRESHOLD || temp > CONFIG.TEMP_EXTREME_THRESHOLD) {
    return 'SEVERE';
  }
  if (rainfall < CONFIG.RAINFALL_SEVERE_THRESHOLD || temp > CONFIG.TEMP_SEVERE_THRESHOLD) {
    return 'MODERATE';
  }
  return 'NORMAL';
}

/**
 * Get severity CSS badge class
 */
function getSeverityBadgeClass(sev) {
  const map = { NORMAL:'badge-normal', MODERATE:'badge-moderate', SEVERE:'badge-severe', EXTREME:'badge-extreme' };
  return map[sev] || 'badge-normal';
}

/**
 * Get color for severity
 */
function getSeverityColor(sev) {
  const map = { NORMAL:'#22c55e', MODERATE:'#facc15', SEVERE:'#f97316', EXTREME:'#ef4444' };
  return map[sev] || '#22c55e';
}

/**
 * Animate a numeric counter from 0 to target
 */
function animateCounter(el, target, duration = 1500, suffix = '') {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

/**
 * Show a toast notification
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/**
 * Format a date as human-readable
 */
function formatTime(offset = 0) {
  const d = new Date(Date.now() - offset);
  return d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

/* ────────────────────────────────────────────────────────────────
   4. NAVBAR & SCROLL BEHAVIOR
──────────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  // Compact navbar on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Smooth scroll for all .smooth-scroll links
  document.querySelectorAll('.smooth-scroll, .nav-links a, .footer-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // View Dashboard CTA
  document.querySelector('.hero-actions a')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('metrics').scrollIntoView({ behavior:'smooth' });
  });
})();

/* ────────────────────────────────────────────────────────────────
   5. HERO COUNTER ANIMATION
──────────────────────────────────────────────────────────────── */
(function initHeroCounters() {
  const counters = document.querySelectorAll('.h-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 2000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ────────────────────────────────────────────────────────────────
   6. METRIC CARDS
──────────────────────────────────────────────────────────────── */
// Default metric values (overridden by API data)
let currentMetrics = {
  rainfall:    45,
  temperature: 36,
  reservoir:   52,
  drought:     null,  // computed
  population:  34,    // millions affected
  agri:        28,    // % area affected
};

const METRIC_CONFIGS = [
  {
    id: 'rainfall',
    icon: 'fas fa-cloud-rain',
    label: 'Monthly Rainfall',
    unit: 'mm',
    sub: 'vs. 70mm normal',
    accent: '#0ea5e9',
    maxBar: 200,
    getVal: m => m.rainfall,
  },
  {
    id: 'temperature',
    icon: 'fas fa-thermometer-half',
    label: 'Temperature',
    unit: '°C',
    sub: 'Current ambient temperature',
    accent: '#f97316',
    maxBar: 50,
    getVal: m => m.temperature,
  },
  {
    id: 'reservoir',
    icon: 'fas fa-water',
    label: 'Reservoir Level',
    unit: '%',
    sub: 'Average national storage',
    accent: '#22c55e',
    maxBar: 100,
    getVal: m => m.reservoir,
  },
  {
    id: 'drought',
    icon: 'fas fa-exclamation-triangle',
    label: 'Drought Severity',
    unit: '',
    sub: 'Based on IMD thresholds',
    accent: '#ef4444',
    maxBar: 100,
    getVal: m => ({ NORMAL:20, MODERATE:50, SEVERE:75, EXTREME:100 }[getDroughtSeverity(m.rainfall, m.temperature)]),
  },
  {
    id: 'population',
    icon: 'fas fa-users',
    label: 'Population Affected',
    unit: 'M',
    sub: 'Estimated millions at risk',
    accent: '#facc15',
    maxBar: 500,
    getVal: m => m.population,
  },
  {
    id: 'agri',
    icon: 'fas fa-wheat-awn',
    label: 'Agricultural Impact',
    unit: '%',
    sub: 'Crop area under water stress',
    accent: '#8b5cf6',
    maxBar: 100,
    getVal: m => m.agri,
  },
];

/**
 * Render all metric cards into #metricsGrid
 */
function renderMetricCards(metrics) {
  const grid = document.getElementById('metricsGrid');
  grid.innerHTML = '';

  const sev = getDroughtSeverity(metrics.rainfall, metrics.temperature);
  const sevColor = getSeverityColor(sev);

  METRIC_CONFIGS.forEach(cfg => {
    const val = cfg.getVal(metrics);
    let displayVal, badge;

    if (cfg.id === 'drought') {
      displayVal = SEVERITY[sev].label;
      badge = `<span class="metric-badge ${getSeverityBadgeClass(sev)}">${sev}</span>`;
    } else {
      displayVal = typeof val === 'number' ? val.toFixed(val % 1 !== 0 ? 1 : 0) : val;
      badge = `<span class="metric-badge badge-normal">LIVE</span>`;
    }

    const fillPct = cfg.id === 'drought' ? val : Math.min((val / cfg.maxBar) * 100, 100);
    const fillColor = cfg.id === 'drought' ? sevColor : cfg.accent;

    const card = document.createElement('div');
    card.className = 'metric-card fade-in';
    card.style.setProperty('--accent', fillColor);
    card.innerHTML = `
      <div class="metric-card-top">
        <div class="metric-icon"><i class="${cfg.icon}"></i></div>
        ${badge}
      </div>
      <div class="metric-label">${cfg.label}</div>
      <div class="metric-value" data-target="${typeof val === 'number' ? val : ''}" id="metric-${cfg.id}">
        ${cfg.id === 'drought' ? displayVal : '0'}${cfg.unit}
      </div>
      <div class="metric-sub">${cfg.sub}</div>
      <div class="metric-bar">
        <div class="metric-bar-fill" style="width:0%;background:${fillColor}" data-fill="${fillPct}"></div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Animate values and bars
  requestAnimationFrame(() => {
    grid.querySelectorAll('.metric-card').forEach((card, i) => {
      const cfg = METRIC_CONFIGS[i];
      const val = cfg.getVal(metrics);

      // Numeric counter
      if (cfg.id !== 'drought' && typeof val === 'number') {
        const el = card.querySelector('.metric-value');
        const target = val;
        animateCounter({ set textContent(v) { el.textContent = v + cfg.unit; } }, Math.round(target), 1200);
      }

      // Bar fill animation
      setTimeout(() => {
        const fill = card.querySelector('.metric-bar-fill');
        if (fill) fill.style.width = fill.dataset.fill + '%';
      }, 100 + i * 80);

      // Fade-in stagger
      setTimeout(() => card.classList.add('visible'), 50 + i * 80);
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   7. WEATHER API INTEGRATION (OpenWeatherMap)
──────────────────────────────────────────────────────────────── */

/**
 * Fetch live weather data for a city from OpenWeatherMap
 * Updates metric cards with real rainfall + temperature
 */
async function fetchWeatherData(city) {
  const statusEl = document.getElementById('apiStatus');
  const btn = document.getElementById('fetchWeatherBtn');

  btn.classList.add('loading');
  statusEl.textContent = `Fetching data for ${city}...`;
  statusEl.className = 'api-status';

  const url = `${CONFIG.OWM_BASE_URL}?q=${encodeURIComponent(city)},IN&appid=${CONFIG.OWM_API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    // Handle 401 (invalid key) gracefully
    if (response.status === 401) {
      throw new Error('Invalid API key. Using simulated data.');
    }
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();

    // OWM: rain.1h in mm (last hour). Multiply to approximate monthly.
    const rain1h   = (data.rain && data.rain['1h']) ? data.rain['1h'] : 0;
    const rainEstimate = Math.round(rain1h * 720); // rough monthly proxy
    const temp     = Math.round(data.main.temp);
    const humidity = data.main.humidity;

    // Update currentMetrics
    currentMetrics.rainfall    = rainEstimate || Math.floor(Math.random() * 60) + 20; // fallback
    currentMetrics.temperature = temp;
    currentMetrics.reservoir   = Math.max(20, Math.min(95, humidity)); // proxy
    currentMetrics.population  = Math.round(30 + Math.random() * 100);
    currentMetrics.agri        = Math.round(20 + Math.random() * 50);

    statusEl.textContent = `✓ Live data loaded for ${city} at ${formatTime()}`;
    statusEl.className = 'api-status success';

  } catch (err) {
    // Fallback to simulated data
    console.warn('OWM API error — using simulated data:', err.message);
    currentMetrics.rainfall    = Math.floor(Math.random() * 80) + 15;
    currentMetrics.temperature = Math.floor(Math.random() * 12) + 30;
    currentMetrics.reservoir   = Math.floor(Math.random() * 50) + 30;
    currentMetrics.population  = Math.round(20 + Math.random() * 80);
    currentMetrics.agri        = Math.round(15 + Math.random() * 45);

    statusEl.textContent = `⚠ Using simulated data (${err.message})`;
    statusEl.className = 'api-status error';
  } finally {
    btn.classList.remove('loading');
    renderMetricCards(currentMetrics);
    updateAlertStatus(currentMetrics);
    checkExtremeDrought(currentMetrics);
  }
}

// Wire up the fetch button and city selector
document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('citySelect').value;
  fetchWeatherData(city);
});

document.getElementById('citySelect').addEventListener('change', () => {
  const city = document.getElementById('citySelect').value;
  fetchWeatherData(city);
});

/* ────────────────────────────────────────────────────────────────
   8. LEAFLET MAP — CHOROPLETH + HEATMAP
──────────────────────────────────────────────────────────────── */

let map, geoJsonLayer, heatLayer;
let currentYear = 2025;

/**
 * Initialize the Leaflet map centered on India
 */
function initMap() {
  map = L.map('indiaMap', {
    center: [22.5, 82.0],
    zoom: 5,
    minZoom: 4,
    maxZoom: 10,
    zoomControl: true,
  });

  // Dark-themed tile layer (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  loadGeoJSON(currentYear);
  addHeatmap();

  // Controls
  document.getElementById('yearSelect').addEventListener('change', (e) => {
    currentYear = parseInt(e.target.value, 10);
    loadGeoJSON(currentYear);
  });

  document.getElementById('heatmapToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      heatLayer.addTo(map);
    } else {
      map.removeLayer(heatLayer);
    }
  });

  document.getElementById('choroplethToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      if (geoJsonLayer) geoJsonLayer.addTo(map);
    } else {
      if (geoJsonLayer) map.removeLayer(geoJsonLayer);
    }
  });
}

/**
 * Load India GeoJSON and apply choropleth styling
 */
function loadGeoJSON(year) {
  const data = STATE_DATA[year] || STATE_DATA[2025];

  // Remove existing layer
  if (geoJsonLayer) map.removeLayer(geoJsonLayer);

  fetch(CONFIG.INDIA_GEOJSON_URL)
    .then(r => r.json())
    .then(geojson => {
      geoJsonLayer = L.geoJSON(geojson, {
        style: feature => styleFeature(feature, data),
        onEachFeature: (feature, layer) => bindPopup(feature, layer, data),
      }).addTo(map);
    })
    .catch(() => {
      // If GeoJSON fetch fails, fall back to circle markers for known state centroids
      console.warn('GeoJSON fetch failed — rendering state markers instead');
      renderStateFallbackMarkers(data);
    });
}

/**
 * State centroids fallback (if GeoJSON URL is unavailable)
 */
const STATE_CENTROIDS = {
  'Rajasthan':        [26.45, 73.10],
  'Gujarat':          [22.30, 71.19],
  'Haryana':          [29.06, 76.09],
  'Punjab':           [31.15, 75.34],
  'Uttar Pradesh':    [26.85, 80.91],
  'Madhya Pradesh':   [22.97, 78.66],
  'Maharashtra':      [19.75, 75.71],
  'Karnataka':        [15.31, 75.71],
  'Andhra Pradesh':   [15.91, 79.74],
  'Tamil Nadu':       [11.13, 78.66],
  'Kerala':           [10.85, 76.27],
  'Telangana':        [17.37, 79.01],
  'Odisha':           [20.95, 85.09],
  'West Bengal':      [22.98, 87.85],
  'Bihar':            [25.09, 85.31],
  'Jharkhand':        [23.61, 85.28],
  'Chhattisgarh':     [21.30, 81.83],
  'Uttarakhand':      [30.06, 79.55],
  'Himachal Pradesh': [31.10, 77.17],
  'Assam':            [26.20, 92.93],
  'Delhi':            [28.65, 77.22],
  'Goa':              [15.30, 74.12],
};

function renderStateFallbackMarkers(data) {
  Object.entries(STATE_CENTROIDS).forEach(([state, latlng]) => {
    const d = data[state] || { rainfall:50, temp:32 };
    const sev = getDroughtSeverity(d.rainfall, d.temp || d.temperature);
    const color = getSeverityColor(sev);

    L.circleMarker(latlng, {
      radius: 14,
      fillColor: color,
      color: '#1e3a4a',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.75,
    })
    .bindPopup(buildPopupHTML(state, d, sev))
    .addTo(map);
  });
}

/**
 * Style each GeoJSON feature (state) by drought severity
 */
function styleFeature(feature, data) {
  const name = getStateName(feature);
  const d = data[name];
  if (!d) return { fillColor:'#1a3a50', color:'#2a5a70', weight:1, fillOpacity:0.3 };

  const sev = getDroughtSeverity(d.rainfall, d.temp || d.temperature);
  const s = SEVERITY[sev];
  return {
    fillColor:   s.color,
    color:       '#0a1f2e',
    weight:      1.5,
    fillOpacity: s.fillOpacity,
    opacity:     1,
  };
}

/**
 * Extract state name from GeoJSON feature properties
 */
function getStateName(feature) {
  const p = feature.properties;
  return p.NAME_1 || p.name || p.ST_NM || p.state || '';
}

/**
 * Build popup HTML for a state
 */
function buildPopupHTML(name, d, sev) {
  const rainfall = d.rainfall || '—';
  const temp = d.temp || d.temperature || '—';
  const reservoir = d.reservoir || '—';
  const sevColor = getSeverityColor(sev);

  return `
    <div class="state-popup">
      <h4><i class="fas fa-map-marker-alt" style="color:${sevColor}"></i> ${name}</h4>
      <table>
        <tr><td>🌧 Rainfall</td><td>${rainfall} mm/month</td></tr>
        <tr><td>🌡 Temperature</td><td>${temp}°C</td></tr>
        <tr><td>💧 Reservoir</td><td>${reservoir}%</td></tr>
        <tr><td>🌱 Groundwater Depth</td><td>${d.groundwater || '—'} m</td></tr>
      </table>
      <span class="popup-severity" style="background:${sevColor}22;color:${sevColor};border:1px solid ${sevColor}44">
        ${SEVERITY[sev].label} Drought
      </span>
    </div>
  `;
}

/**
 * Bind interactive popups and hover effects to each state layer
 */
function bindPopup(feature, layer, data) {
  const name = getStateName(feature);
  const d = data[name] || { rainfall:50, temperature:32, reservoir:60, groundwater:20 };
  const sev = getDroughtSeverity(d.rainfall, d.temp || d.temperature);

  layer.bindPopup(buildPopupHTML(name, d, sev), { maxWidth: 260 });

  layer.on('mouseover', function () {
    this.setStyle({ weight: 2.5, fillOpacity: Math.min(SEVERITY[sev].fillOpacity + 0.15, 1) });
    this.openPopup();
  });
  layer.on('mouseout', function () {
    geoJsonLayer.resetStyle(this);
    this.closePopup();
  });
  layer.on('click', function () {
    map.fitBounds(this.getBounds(), { padding: [40, 40] });
    this.openPopup();
  });
}

/**
 * Add water stress heatmap layer
 */
function addHeatmap() {
  heatLayer = L.heatLayer(HEATMAP_POINTS, {
    radius: 35,
    blur: 22,
    maxZoom: 9,
    gradient: {
      0.0: '#003366',
      0.2: '#0369a1',
      0.4: '#facc15',
      0.6: '#f97316',
      0.8: '#ef4444',
      1.0: '#7f1d1d',
    },
  }).addTo(map);
}

/* ────────────────────────────────────────────────────────────────
   9. CHART.JS ANALYTICS
──────────────────────────────────────────────────────────────── */

// Shared Chart.js defaults for the dark theme
Chart.defaults.color = '#6b8ba4';
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.borderColor = 'rgba(14, 165, 233, 0.1)';

const CHART_COLORS = {
  blue:     'rgba(14, 165, 233, 1)',
  blueA:    'rgba(14, 165, 233, 0.2)',
  green:    'rgba(34, 197, 94, 1)',
  greenA:   'rgba(34, 197, 94, 0.2)',
  yellow:   'rgba(250, 204, 21, 1)',
  orange:   'rgba(249, 115, 22, 1)',
  red:      'rgba(239, 68, 68, 1)',
};

/**
 * Rainfall Trend Line Chart
 */
let rainfallChart;
function initRainfallChart(region = 'All India') {
  const ctx = document.getElementById('rainfallChart').getContext('2d');
  const d = MONTHLY_RAINFALL[region] || MONTHLY_RAINFALL['All India'];

  if (rainfallChart) rainfallChart.destroy();

  rainfallChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHLY_RAINFALL.labels,
      datasets: [
        {
          label: 'Actual Rainfall (mm)',
          data: d.actual,
          borderColor: CHART_COLORS.blue,
          backgroundColor: CHART_COLORS.blueA,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: CHART_COLORS.blue,
        },
        {
          label: '30-Year Normal (mm)',
          data: d.normal,
          borderColor: CHART_COLORS.yellow,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [6, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: CHART_COLORS.yellow,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 16 } },
        tooltip: {
          backgroundColor: '#061825',
          borderColor: 'rgba(14,165,233,0.3)',
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true,
             title: { display: true, text: 'Rainfall (mm)' } },
      },
    },
  });
}

/**
 * Reservoir Storage Bar Chart
 */
function initReservoirChart() {
  const ctx = document.getElementById('reservoirChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: RESERVOIR_DATA.labels,
      datasets: [
        {
          label: 'Current Storage (BCM)',
          data: RESERVOIR_DATA.current,
          backgroundColor: RESERVOIR_DATA.current.map(v =>
            v / RESERVOIR_DATA.capacity[RESERVOIR_DATA.current.indexOf(v)] < 0.4
              ? CHART_COLORS.red
              : v / RESERVOIR_DATA.capacity[RESERVOIR_DATA.current.indexOf(v)] < 0.6
                ? CHART_COLORS.orange
                : CHART_COLORS.blue
          ),
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Total Capacity (BCM)',
          data: RESERVOIR_DATA.capacity,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { usePointStyle: true } },
        tooltip: { backgroundColor: '#061825', borderColor: 'rgba(14,165,233,0.3)', borderWidth: 1, padding: 12 },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 35, font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, title: { display: true, text: 'BCM' } },
      },
    },
  });
}

/**
 * Groundwater Depletion Line Chart
 */
function initGroundwaterChart() {
  const ctx = document.getElementById('groundwaterChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: GROUNDWATER_DATA.labels,
      datasets: [{
        label: 'Depth to Water Table (m)',
        data: GROUNDWATER_DATA.depth,
        borderColor: CHART_COLORS.orange,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: CHART_COLORS.orange,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { usePointStyle: true } },
        tooltip: { backgroundColor: '#061825', borderColor: 'rgba(249,115,22,0.3)', borderWidth: 1, padding: 12 },
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' } },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          title: { display: true, text: 'Depth (m below surface)' },
          reverse: false,
        },
      },
    },
  });
}

/**
 * Water Usage Doughnut Chart
 */
function initUsagePieChart() {
  const ctx = document.getElementById('usagePieChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: WATER_USAGE.labels,
      datasets: [{
        data: WATER_USAGE.data,
        backgroundColor: WATER_USAGE.colors,
        borderColor: '#061825',
        borderWidth: 3,
        hoverOffset: 12,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } },
        tooltip: {
          backgroundColor: '#061825',
          borderColor: 'rgba(14,165,233,0.3)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    },
  });
}

// Wire region selector for rainfall chart
document.getElementById('rainfallStateSelect').addEventListener('change', (e) => {
  initRainfallChart(e.target.value);
});

/* ────────────────────────────────────────────────────────────────
   10. ALERT SYSTEM
──────────────────────────────────────────────────────────────── */

/**
 * Populate the alert feed with seed + generated entries
 */
function renderAlertFeed() {
  const list = document.getElementById('alertList');
  list.innerHTML = '';

  SEED_ALERTS.forEach(alert => {
    const color = getSeverityColor(alert.severity.toUpperCase());
    const item = document.createElement('div');
    item.className = 'alert-item';
    item.innerHTML = `
      <div class="alert-dot" style="background:${color}"></div>
      <div class="alert-item-text">
        <strong style="color:${color}">${alert.state}</strong> — ${alert.message}
        <div class="alert-item-time">${alert.time}</div>
      </div>
    `;
    list.appendChild(item);
  });
}

/**
 * Update the alert status card based on current metrics
 */
function updateAlertStatus(metrics) {
  const sev = getDroughtSeverity(metrics.rainfall, metrics.temperature);
  const fillEl = document.getElementById('severityFill');
  const labelEl = document.getElementById('severityLabel');
  const statusEl = document.getElementById('alertSystemStatus');

  const fillMap = { NORMAL:15, MODERATE:40, SEVERE:70, EXTREME:100 };
  const colorMap = { NORMAL:'#22c55e', MODERATE:'#facc15', SEVERE:'#f97316', EXTREME:'#ef4444' };
  const classMap = { NORMAL:'normal', MODERATE:'moderate', SEVERE:'severe', EXTREME:'extreme' };

  fillEl.style.width = fillMap[sev] + '%';
  fillEl.style.background = colorMap[sev];
  labelEl.textContent = SEVERITY[sev].label + ' Risk';
  labelEl.className = 'severity-label ' + classMap[sev];
  statusEl.textContent = sev === 'EXTREME' ? '🚨 Critical Alert Active' : 'Monitoring Active';
}

/**
 * Show extreme drought modal if triggered
 */
function checkExtremeDrought(metrics) {
  const sev = getDroughtSeverity(metrics.rainfall, metrics.temperature);
  if (sev === 'EXTREME') {
    const modal = document.getElementById('droughtModal');
    const msg = document.getElementById('modalMessage');
    const smsBadge = document.getElementById('smsSentBadge');

    msg.textContent = `Critical conditions detected — Rainfall: ${metrics.rainfall}mm/month, Temperature: ${metrics.temperature}°C. Immediate water conservation measures required.`;

    // Show SMS sent badge if SMS alerts enabled
    const prefs = JSON.parse(localStorage.getItem('jaldrishti_prefs') || '{}');
    smsBadge.style.display = prefs.sms ? 'flex' : 'none';

    modal.classList.add('active');
    addAlertToFeed('EXTREME', 'Detected Region', `Rainfall ${metrics.rainfall}mm, Temp ${metrics.temperature}°C — Auto-triggered`);
  }
}

/**
 * Dynamically add an alert entry to the feed
 */
function addAlertToFeed(severity, state, message) {
  const list = document.getElementById('alertList');
  const color = getSeverityColor(severity);
  const item = document.createElement('div');
  item.className = 'alert-item';
  item.style.animation = 'fadeUp 0.4s ease forwards';
  item.innerHTML = `
    <div class="alert-dot" style="background:${color}"></div>
    <div class="alert-item-text">
      <strong style="color:${color}">${state}</strong> — ${message}
      <div class="alert-item-time">Just now</div>
    </div>
  `;
  list.prepend(item);
}

// Modal close buttons
document.getElementById('modalAck').addEventListener('click', () => {
  document.getElementById('droughtModal').classList.remove('active');
  showToast('Alert acknowledged. Response protocol initiated.');
});
document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('droughtModal').classList.remove('active');
});

// Navbar SMS alert button (opens alert section)
document.getElementById('smsAlertBtn').addEventListener('click', () => {
  document.getElementById('alerts').scrollIntoView({ behavior: 'smooth' });
});

// Save preferences to localStorage
document.getElementById('saveAlertBtn').addEventListener('click', () => {
  const prefs = {
    sms:   document.getElementById('smsCheck').checked,
    email: document.getElementById('emailCheck').checked,
    push:  document.getElementById('pushCheck').checked,
    phone: document.getElementById('phoneInput').value,
  };
  localStorage.setItem('jaldrishti_prefs', JSON.stringify(prefs));
  showToast('Alert preferences saved successfully!');

  // Simulate SMS confirmation
  if (prefs.sms && prefs.phone) {
    setTimeout(() => showToast(`SMS alert configured for ${prefs.phone}`, 4000), 1000);
  }
});

// Load saved preferences from localStorage
function loadAlertPrefs() {
  const prefs = JSON.parse(localStorage.getItem('jaldrishti_prefs') || '{}');
  if (prefs.sms   !== undefined) document.getElementById('smsCheck').checked   = prefs.sms;
  if (prefs.email !== undefined) document.getElementById('emailCheck').checked = prefs.email;
  if (prefs.push  !== undefined) document.getElementById('pushCheck').checked  = prefs.push;
  if (prefs.phone) document.getElementById('phoneInput').value = prefs.phone;
}

/* ────────────────────────────────────────────────────────────────
   11. POLICY & SDG SECTION
──────────────────────────────────────────────────────────────── */

function renderPolicyCards() {
  const grid = document.getElementById('policyGrid');
  POLICY_DATA.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'policy-card fade-in';
    card.innerHTML = `
      <div class="policy-icon"><i class="${p.icon}"></i></div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <ul>${p.items.map(item => `<li>${item}</li>`).join('')}</ul>
    `;
    grid.appendChild(card);
  });
}

function renderSDGBars() {
  const container = document.getElementById('sdgBars');
  SDG_INDICATORS.forEach(ind => {
    const pct = ((ind.value / ind.target) * 100).toFixed(0);
    const bar = document.createElement('div');
    bar.className = 'sdg-bar-item fade-in';
    bar.innerHTML = `
      <div class="sdg-bar-label">
        <span>${ind.label}</span>
        <span>${ind.value}% of ${ind.target}% target</span>
      </div>
      <div class="sdg-bar-track">
        <div class="sdg-bar-fill" data-fill="${pct}"></div>
      </div>
    `;
    container.appendChild(bar);
  });

  // Animate bars on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sdg-bar-fill').forEach(fill => {
          fill.style.width = fill.dataset.fill + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  container.querySelectorAll('.sdg-bar-item').forEach(item => observer.observe(item));
}

/* ────────────────────────────────────────────────────────────────
   12. INTERSECTION OBSERVER (Fade-In Animations)
──────────────────────────────────────────────────────────────── */
function initFadeObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling cards
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        siblings.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────────────────────────
   13. INIT — Bootstrap everything on DOMContentLoaded
──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Render static content first
  renderMetricCards(currentMetrics);
  renderPolicyCards();
  renderSDGBars();
  renderAlertFeed();
  loadAlertPrefs();

  // Initialize map
  initMap();

  // Initialize charts (lazy — when section is in view for performance)
  let chartsInitialized = false;
  const chartsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !chartsInitialized) {
      chartsInitialized = true;
      initRainfallChart();
      initReservoirChart();
      initGroundwaterChart();
      initUsagePieChart();
      chartsObserver.disconnect();
    }
  }, { threshold: 0.1 });
  chartsObserver.observe(document.getElementById('analytics'));

  // Fade-in observer
  initFadeObserver();

  // Update alert status with default metrics
  updateAlertStatus(currentMetrics);

  // Auto-fetch weather on load (Delhi as default)
  // Slight delay to let page render first
  setTimeout(() => fetchWeatherData('Delhi'), 1200);

  // Simulate periodic metric refresh every 5 minutes
  setInterval(() => {
    const city = document.getElementById('citySelect').value;
    fetchWeatherData(city);
  }, 300000);

  console.log('%c🌊 JalDrishti Dashboard Loaded', 'color:#0ea5e9;font-weight:bold;font-size:14px;');
  console.log('%cIndia Water Security & Drought Management System', 'color:#6b8ba4;');
});
