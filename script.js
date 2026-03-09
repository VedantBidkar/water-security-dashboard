/* ═══════════════════════════════════════════════════════
   script.js — JalDrishti v2.0
   Water Security & Drought Intelligence Dashboard
═══════════════════════════════════════════════════════ */
'use strict';

/* ────────────────────────────────
   CONFIG
──────────────────────────────── */
const CONFIG = {
  OWM_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY', // ← Replace with your key
  OWM_URL: 'https://api.openweathermap.org/data/2.5/weather',
  RAIN_EXTREME: 20, RAIN_SEVERE: 40,
  TEMP_EXTREME: 40, TEMP_SEVERE: 36,
  GEOJSON_URL: 'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson',
};

/* ────────────────────────────────
   SIMULATED DATA
──────────────────────────────── */
const STATE_DATA = {
  2025: {
    'Rajasthan':        {rainfall:15,temperature:42,reservoir:28,groundwater:45},
    'Gujarat':          {rainfall:22,temperature:38,reservoir:40,groundwater:52},
    'Haryana':          {rainfall:30,temperature:37,reservoir:55,groundwater:38},
    'Punjab':           {rainfall:45,temperature:34,reservoir:62,groundwater:41},
    'Uttar Pradesh':    {rainfall:50,temperature:36,reservoir:58,groundwater:35},
    'Madhya Pradesh':   {rainfall:32,temperature:39,reservoir:48,groundwater:42},
    'Maharashtra':      {rainfall:28,temperature:37,reservoir:45,groundwater:48},
    'Karnataka':        {rainfall:60,temperature:33,reservoir:72,groundwater:28},
    'Andhra Pradesh':   {rainfall:35,temperature:38,reservoir:50,groundwater:40},
    'Tamil Nadu':       {rainfall:55,temperature:34,reservoir:68,groundwater:30},
    'Kerala':           {rainfall:180,temperature:30,reservoir:90,groundwater:12},
    'Telangana':        {rainfall:40,temperature:37,reservoir:55,groundwater:38},
    'Odisha':           {rainfall:75,temperature:33,reservoir:78,groundwater:22},
    'West Bengal':      {rainfall:90,temperature:32,reservoir:80,groundwater:20},
    'Bihar':            {rainfall:65,temperature:35,reservoir:70,groundwater:28},
    'Jharkhand':        {rainfall:70,temperature:33,reservoir:74,groundwater:25},
    'Chhattisgarh':     {rainfall:68,temperature:34,reservoir:72,groundwater:26},
    'Uttarakhand':      {rainfall:95,temperature:28,reservoir:85,groundwater:18},
    'Himachal Pradesh': {rainfall:100,temperature:22,reservoir:88,groundwater:16},
    'Assam':            {rainfall:120,temperature:29,reservoir:92,groundwater:14},
    'Goa':              {rainfall:190,temperature:29,reservoir:94,groundwater:11},
    'Delhi':            {rainfall:25,temperature:38,reservoir:38,groundwater:48},
  },
  2024: {
    'Rajasthan':        {rainfall:12,temperature:43,reservoir:22,groundwater:50},
    'Gujarat':          {rainfall:18,temperature:39,reservoir:35,groundwater:55},
    'Haryana':          {rainfall:25,temperature:38,reservoir:50,groundwater:42},
    'Punjab':           {rainfall:38,temperature:35,reservoir:58,groundwater:44},
    'Uttar Pradesh':    {rainfall:44,temperature:37,reservoir:52,groundwater:38},
    'Madhya Pradesh':   {rainfall:28,temperature:40,reservoir:42,groundwater:45},
    'Maharashtra':      {rainfall:24,temperature:38,reservoir:40,groundwater:52},
    'Karnataka':        {rainfall:52,temperature:34,reservoir:66,groundwater:32},
    'Andhra Pradesh':   {rainfall:30,temperature:39,reservoir:44,groundwater:44},
    'Tamil Nadu':       {rainfall:48,temperature:35,reservoir:62,groundwater:34},
    'Kerala':           {rainfall:160,temperature:31,reservoir:87,groundwater:15},
    'Telangana':        {rainfall:35,temperature:38,reservoir:50,groundwater:42},
    'Odisha':           {rainfall:68,temperature:34,reservoir:74,groundwater:26},
    'West Bengal':      {rainfall:82,temperature:33,reservoir:76,groundwater:24},
    'Bihar':            {rainfall:58,temperature:36,reservoir:65,groundwater:32},
    'Jharkhand':        {rainfall:62,temperature:34,reservoir:68,groundwater:28},
    'Chhattisgarh':     {rainfall:60,temperature:35,reservoir:68,groundwater:30},
    'Uttarakhand':      {rainfall:88,temperature:29,reservoir:80,groundwater:22},
    'Himachal Pradesh': {rainfall:92,temperature:23,reservoir:84,groundwater:19},
    'Assam':            {rainfall:110,temperature:30,reservoir:88,groundwater:18},
    'Goa':              {rainfall:180,temperature:30,reservoir:92,groundwater:13},
    'Delhi':            {rainfall:20,temperature:39,reservoir:32,groundwater:52},
  },
  2023: {
    'Rajasthan':        {rainfall:18,temperature:41,reservoir:32,groundwater:42},
    'Gujarat':          {rainfall:26,temperature:37,reservoir:46,groundwater:49},
    'Haryana':          {rainfall:34,temperature:36,reservoir:60,groundwater:36},
    'Punjab':           {rainfall:50,temperature:33,reservoir:66,groundwater:38},
    'Uttar Pradesh':    {rainfall:55,temperature:35,reservoir:62,groundwater:32},
    'Madhya Pradesh':   {rainfall:36,temperature:38,reservoir:52,groundwater:40},
    'Maharashtra':      {rainfall:32,temperature:36,reservoir:50,groundwater:44},
    'Karnataka':        {rainfall:65,temperature:32,reservoir:76,groundwater:25},
    'Andhra Pradesh':   {rainfall:40,temperature:37,reservoir:54,groundwater:36},
    'Tamil Nadu':       {rainfall:60,temperature:33,reservoir:70,groundwater:27},
    'Kerala':           {rainfall:190,temperature:29,reservoir:92,groundwater:10},
    'Telangana':        {rainfall:44,temperature:36,reservoir:58,groundwater:35},
    'Odisha':           {rainfall:80,temperature:32,reservoir:80,groundwater:20},
    'West Bengal':      {rainfall:96,temperature:31,reservoir:82,groundwater:18},
    'Bihar':            {rainfall:70,temperature:34,reservoir:74,groundwater:26},
    'Jharkhand':        {rainfall:75,temperature:32,reservoir:78,groundwater:22},
    'Chhattisgarh':     {rainfall:72,temperature:33,reservoir:76,groundwater:24},
    'Uttarakhand':      {rainfall:100,temperature:27,reservoir:87,groundwater:16},
    'Himachal Pradesh': {rainfall:105,temperature:21,reservoir:90,groundwater:15},
    'Assam':            {rainfall:125,temperature:28,reservoir:93,groundwater:13},
    'Goa':              {rainfall:195,temperature:28,reservoir:95,groundwater:10},
    'Delhi':            {rainfall:28,temperature:37,reservoir:42,groundwater:44},
  }
};

const MONTHLY_RAINFALL = {
  labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  'All India': {actual:[12,10,14,18,30,110,285,265,190,80,32,16], normal:[15,13,12,15,28,120,280,270,195,85,30,18]},
  'Rajasthan': {actual:[4,3,4,5,10,30,85,90,50,15,6,3], normal:[5,4,4,5,12,35,95,100,55,18,7,4]},
  'Maharashtra':{actual:[5,4,8,15,25,130,310,290,185,80,25,8], normal:[6,5,9,16,28,140,320,295,195,90,28,10]},
  'Kerala':    {actual:[35,28,48,95,210,450,560,430,295,260,160,65], normal:[32,26,44,90,205,440,550,420,285,255,155,60]},
  'Punjab':    {actual:[30,28,22,15,20,55,175,190,95,22,12,24], normal:[35,30,25,17,22,60,185,200,100,25,14,28]},
};

const RESERVOIR_DATA = {
  labels:['Indirasagar','Nagarjunasagar','Bhakra','Hirakud','Srisailam','Koyna','Ukai','Tungabhadra','Bansagar','Rana Pratap'],
  current:[7.4,5.9,7.0,3.9,8.6,2.8,4.5,2.1,3.6,1.2],
  capacity:[12.2,11.5,9.9,8.1,11.1,2.8,8.5,3.6,5.4,2.9],
};

const HEATMAP_POINTS = [
  [26.91,70.90,0.9],[25.33,74.63,0.85],[27.02,74.22,0.88],[28.01,73.31,0.92],[26.45,73.10,0.87],
  [23.22,72.65,0.7],[22.30,70.78,0.75],[29.05,76.08,0.65],[28.65,77.22,0.72],
  [20.93,77.75,0.70],[20.00,76.83,0.65],[17.38,78.49,0.55],[16.50,80.63,0.58],
  [14.46,77.31,0.55],[11.12,78.65,0.50],[26.85,80.91,0.55],
  [15.33,74.99,0.1],[8.51,76.96,0.05],[25.47,90.36,0.05],[22.98,88.45,0.08],
];

const STATE_CENTROIDS = {
  'Rajasthan':[26.45,73.10],'Gujarat':[22.30,71.19],'Haryana':[29.06,76.09],
  'Punjab':[31.15,75.34],'Uttar Pradesh':[26.85,80.91],'Madhya Pradesh':[22.97,78.66],
  'Maharashtra':[19.75,75.71],'Karnataka':[15.31,75.71],'Andhra Pradesh':[15.91,79.74],
  'Tamil Nadu':[11.13,78.66],'Kerala':[10.85,76.27],'Telangana':[17.37,79.01],
  'Odisha':[20.95,85.09],'West Bengal':[22.98,87.85],'Bihar':[25.09,85.31],
  'Jharkhand':[23.61,85.28],'Chhattisgarh':[21.30,81.83],'Uttarakhand':[30.06,79.55],
  'Himachal Pradesh':[31.10,77.17],'Assam':[26.20,92.93],'Delhi':[28.65,77.22],'Goa':[15.30,74.12],
};

const SEED_ALERTS = [
  {sev:'extreme', state:'Rajasthan',   msg:'Extreme drought — rainfall 15mm (deficit 70%)',        time:'2h ago'},
  {sev:'severe',  state:'Gujarat',     msg:'Severe water stress — reservoir at 40% capacity',       time:'5h ago'},
  {sev:'moderate',state:'Maharashtra', msg:'Moderate drought — groundwater depth +18% above normal',time:'12h ago'},
  {sev:'severe',  state:'Haryana',     msg:'Severe heat wave — temperature 39°C (+3° above normal)',time:'1d ago'},
  {sev:'normal',  state:'Kerala',      msg:'Normal conditions — above-average rainfall recorded',    time:'1d ago'},
];

const POLICY_DATA = [
  {icon:'fas fa-hand-holding-water',title:'National Drought Mitigation Scheme',desc:'Centrally-sponsored scheme for drought relief, crop insurance & water harvesting.',items:['₹2,250 crore annual outlay','250+ drought-prone districts','Integrated with MGNREGS']},
  {icon:'fas fa-tint',title:'Jal Jeevan Mission (JJM)',desc:'Flagship program to provide functional household tap connections to every rural household.',items:['19+ crore connections delivered','Safe drinking water focus','₹3.6 lakh crore investment']},
  {icon:'fas fa-water',title:'Atal Bhujal Yojana (ABY)',desc:'Groundwater management in water-stressed states via community-led conservation.',items:['7 states covered','Community-driven approach','Over-exploited aquifer focus']},
  {icon:'fas fa-seedling',title:'Pradhan Mantri Fasal Bima Yojana',desc:'Crop insurance protecting farmers against drought, flood & other perils.',items:['5.5 crore farmers covered','Subsidized premium rates','₹1.4 lakh crore claims settled']},
  {icon:'fas fa-chart-pie',title:'Water Allocation Policy (WAP 2022)',desc:'Inter-state water sharing framework under National Water Framework Law principles.',items:['Basin-level water budgeting','Priority: drinking > irrigation','Groundwater regulation boards']},
  {icon:'fas fa-dam',title:'Reservoir Management Guidelines',desc:'CWC-mandated real-time flood forecasting, storage optimization & drought protocols.',items:['143 reservoirs with telemetry','Dynamic rule curves','Integrated flood–drought management']},
];

const SDG_DATA = [
  {label:'Safe drinking water access (rural)', val:76},
  {label:'Sanitation & open defecation free',  val:89},
  {label:'Water-use efficiency improvement',    val:42},
  {label:'Integrated water resources mgmt',     val:55},
  {label:'Transboundary water cooperation',     val:38},
];

/* ────────────────────────────────
   UTILITY
──────────────────────────────── */
function getSeverity(rain, temp) {
  if (rain < CONFIG.RAIN_EXTREME && temp > CONFIG.TEMP_EXTREME) return 'EXTREME';
  if (rain < CONFIG.RAIN_EXTREME || temp > CONFIG.TEMP_EXTREME) return 'SEVERE';
  if (rain < CONFIG.RAIN_SEVERE  || temp > CONFIG.TEMP_SEVERE)  return 'MODERATE';
  return 'NORMAL';
}
function sevColor(s) { return {NORMAL:'#22c55e',MODERATE:'#facc15',SEVERE:'#f97316',EXTREME:'#ef4444'}[s]||'#22c55e'; }
function sevLabel(s) { return {NORMAL:'Normal',MODERATE:'Moderate',SEVERE:'Severe',EXTREME:'Extreme'}[s]||'Normal'; }
function sevBadgeClass(s) { return {NORMAL:'b-normal',MODERATE:'b-moderate',SEVERE:'b-severe',EXTREME:'b-extreme'}[s]||'b-normal'; }
function sevChipClass(s) { return s.toLowerCase(); }

function animCount(el, to, dur=1400, suffix='') {
  const start = performance.now();
  const run = now => {
    const p = Math.min((now-start)/dur,1);
    const e = 1 - Math.pow(1-p,3);
    el.textContent = Math.round(e*to) + suffix;
    if(p<1) requestAnimationFrame(run); else el.textContent = to + suffix;
  };
  requestAnimationFrame(run);
}

let toastTimer = {};
function showToast(msg, type='info', dur=3500) {
  const box = document.getElementById('toastBox');
  const id = Date.now();
  const t = document.createElement('div');
  t.className = `toast-item ${type}`;
  const icons = {success:'fa-check-circle',error:'fa-xmark-circle',info:'fa-circle-info'};
  t.innerHTML = `<i class="fas ${icons[type]||icons.info}"></i><span>${msg}</span>`;
  box.appendChild(t);
  toastTimer[id] = setTimeout(()=>{
    t.classList.add('fade-out');
    setTimeout(()=>t.remove(),350);
  }, dur);
}

/* ────────────────────────────────
   LOADER
──────────────────────────────── */
function runLoader() {
  const fill = document.getElementById('loaderFill');
  const pct  = document.getElementById('loaderPct');
  let p = 0;
  const iv = setInterval(()=>{
    p += Math.random()*8 + 2;
    if(p>100) p=100;
    fill.style.width = p+'%';
    pct.textContent = Math.round(p)+'%';
    if(p>=100) {
      clearInterval(iv);
      setTimeout(()=>{
        document.getElementById('loaderScreen').classList.add('out');
        initAll();
      },300);
    }
  },80);
}

/* ────────────────────────────────
   SIDEBAR & TOPBAR
──────────────────────────────── */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const toggle   = document.getElementById('sidebarToggle');
  const overlay  = document.getElementById('sidebarOverlay');
  const mainWrap = document.querySelector('.main-wrap');

  toggle.addEventListener('click', ()=>{
    const mobile = window.innerWidth <= 900;
    if(mobile) {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    } else {
      sidebar.classList.toggle('collapsed');
      mainWrap.classList.toggle('expanded');
    }
  });
  overlay.addEventListener('click', ()=>{
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.snav-item');
  const currentSection = document.getElementById('currentSection');

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        navItems.forEach(item=>{
          const active = item.getAttribute('href') === '#'+id;
          item.classList.toggle('active', active);
          if(active && item.dataset.section) currentSection.textContent = item.dataset.section;
        });
      }
    });
  },{threshold:0.3});
  sections.forEach(s=>io.observe(s));

  // Smooth scroll on nav click
  navItems.forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth'});
      if(window.innerWidth<=900){ sidebar.classList.remove('open'); overlay.classList.remove('show'); }
    });
  });

  // Also wire .smooth-scroll links
  document.querySelectorAll('.smooth-scroll').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if(t) t.scrollIntoView({behavior:'smooth'});
    });
  });
}

/* Live clock */
function startClock() {
  const el = document.getElementById('sidebarClock');
  const tick = ()=>{
    el.textContent = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  };
  tick(); setInterval(tick,1000);
}

/* ────────────────────────────────
   DARK / LIGHT MODE
──────────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const stored = localStorage.getItem('jd_theme') || 'dark';
  html.setAttribute('data-theme', stored);
  icon.className = stored==='dark'?'fas fa-moon':'fas fa-sun';

  btn.addEventListener('click',()=>{
    const now = html.getAttribute('data-theme');
    const next = now==='dark'?'light':'dark';
    html.setAttribute('data-theme',next);
    icon.className = next==='dark'?'fas fa-moon':'fas fa-sun';
    localStorage.setItem('jd_theme',next);
    showToast(`${next==='dark'?'Dark':'Light'} mode activated`,'info',2000);
  });
}

/* ────────────────────────────────
   NOTIFICATIONS
──────────────────────────────── */
const NOTIFICATIONS = [
  {sev:'extreme',text:'Extreme drought alert — Rajasthan & Gujarat',   time:'2 hours ago'},
  {sev:'severe', text:'Reservoir levels critical in Vidarbha region',  time:'5 hours ago'},
  {sev:'moderate',text:'Groundwater depletion rising in NCR belt',     time:'1 day ago'},
];
function initNotifications() {
  const btn   = document.getElementById('notifBtn');
  const panel = document.getElementById('notifPanel');
  const list  = document.getElementById('npList');
  const badge = document.getElementById('notifBadge');

  function render() {
    list.innerHTML = '';
    NOTIFICATIONS.forEach(n=>{
      const c = sevColor(n.sev.toUpperCase());
      const el = document.createElement('div'); el.className='np-item';
      el.innerHTML=`<div class="np-dot" style="background:${c}"></div><div><div class="np-text">${n.text}</div><div class="np-time">${n.time}</div></div>`;
      list.appendChild(el);
    });
    badge.textContent = NOTIFICATIONS.length;
    if(!NOTIFICATIONS.length) badge.style.display='none'; else badge.style.display='flex';
  }
  render();

  btn.addEventListener('click', e=>{
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.getElementById('clearNotifs').addEventListener('click',()=>{
    NOTIFICATIONS.length=0; render(); panel.classList.remove('open');
    showToast('Notifications cleared','info',2000);
  });
  document.addEventListener('click',()=>panel.classList.remove('open'));
}

/* ────────────────────────────────
   STATE SEARCH
──────────────────────────────── */
function initSearch() {
  const input = document.getElementById('stateSearch');
  const drop  = document.getElementById('searchDrop');
  const states = Object.keys(STATE_CENTROIDS);

  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    drop.innerHTML='';
    if(!q){ drop.classList.remove('open'); return; }
    const matches = states.filter(s=>s.toLowerCase().includes(q));
    if(!matches.length){ drop.classList.remove('open'); return; }
    matches.slice(0,6).forEach(s=>{
      const sev = getSeverity(STATE_DATA[currentYear]?.[s]?.rainfall||50, STATE_DATA[currentYear]?.[s]?.temperature||32);
      const c = sevColor(sev);
      const el = document.createElement('div'); el.className='sd-item';
      el.innerHTML=`<i class="fas fa-map-pin" style="color:${c}"></i>${s}<span style="font-size:0.7rem;color:${c};margin-left:auto">${sevLabel(sev)}</span>`;
      el.addEventListener('click',()=>{
        const ll = STATE_CENTROIDS[s];
        if(ll && map) map.flyTo(ll,7,{duration:1.2});
        drop.classList.remove('open');
        input.value='';
        document.getElementById('map-section').scrollIntoView({behavior:'smooth'});
        showToast(`Zooming to ${s}`,'info',2000);
      });
      drop.appendChild(el);
    });
    drop.classList.add('open');
  });
  document.addEventListener('click', e=>{ if(!input.contains(e.target)) drop.classList.remove('open'); });
}

/* ────────────────────────────────
   PARTICLE CANVAS (HERO)
──────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = ()=>{ canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
  resize();
  window.addEventListener('resize',resize);

  const particles = Array.from({length:55},()=>({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    r: Math.random()*2+0.5, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
    o: Math.random()*0.4+0.1,
  }));

  const draw = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(56,189,248,${p.o})`;
      ctx.fill();
    });
    // Draw connecting lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(14,165,233,${0.12*(1-dist/120)})`;
          ctx.lineWidth=0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
}

/* ────────────────────────────────
   HERO COUNTERS
──────────────────────────────── */
function initHeroCounters() {
  const els = document.querySelectorAll('.hkpi-n');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target, to=parseInt(el.dataset.count), suf=el.dataset.suffix||'';
        animCount({set textContent(v){el.textContent=v;}}, to, 1800, suf);
        io.unobserve(el);
      }
    });
  },{threshold:0.5});
  els.forEach(e=>io.observe(e));
}

/* ────────────────────────────────
   METRICS
──────────────────────────────── */
let currentMetrics = {rainfall:45,temperature:36,reservoir:52,population:34,agri:28,groundwater:20,stress:58};

const METRIC_DEFS = [
  {id:'rainfall',   icon:'fas fa-cloud-rain',        label:'Monthly Rainfall',     unit:'mm', sub:'vs 70mm seasonal normal', accent:'#0ea5e9', max:200, get:m=>m.rainfall},
  {id:'temperature',icon:'fas fa-thermometer-half',  label:'Temperature',          unit:'°C', sub:'Current ambient',         accent:'#f97316', max:50,  get:m=>m.temperature},
  {id:'reservoir',  icon:'fas fa-water',             label:'Reservoir Level',      unit:'%',  sub:'National average storage', accent:'#22c55e', max:100, get:m=>m.reservoir},
  {id:'drought',    icon:'fas fa-triangle-exclamation',label:'Drought Severity',   unit:'',   sub:'IMD-based classification', accent:'#ef4444', max:100, get:m=>({NORMAL:15,MODERATE:45,SEVERE:75,EXTREME:100}[getSeverity(m.rainfall,m.temperature)])},
  {id:'population', icon:'fas fa-users',             label:'Population Affected',  unit:'M',  sub:'Estimated millions at risk',accent:'#facc15',max:500, get:m=>m.population},
  {id:'agri',       icon:'fas fa-wheat-awn',         label:'Agricultural Impact',  unit:'%',  sub:'Crop area under stress',   accent:'#8b5cf6', max:100, get:m=>m.agri},
  {id:'groundwater',icon:'fas fa-arrow-trend-down',  label:'Groundwater Depth',    unit:'m',  sub:'Average depth below surface',accent:'#06b6d4',max:60, get:m=>m.groundwater},
  {id:'stress',     icon:'fas fa-gauge-high',        label:'Water Stress Index',   unit:'',   sub:'0–100 composite index',    accent:'#a855f7', max:100, get:m=>m.stress},
];

function renderMetrics(metrics) {
  const grid = document.getElementById('metricsGrid');
  grid.innerHTML='';
  const sev = getSeverity(metrics.rainfall, metrics.temperature);

  METRIC_DEFS.forEach((def,i)=>{
    const val   = def.get(metrics);
    const isStr = def.id==='drought';
    const display = isStr ? sevLabel(sev) : val;
    const fill  = Math.min(isStr?val:(val/def.max)*100,100);

    const card  = document.createElement('div');
    card.className='metric-card';
    card.style.setProperty('--accent', isStr?sevColor(sev):def.accent);

    const sparkData = Array.from({length:8},()=>Math.max(0,val+(Math.random()-0.5)*val*0.3));

    card.innerHTML=`
      <div class="mc-top">
        <div class="mc-icon"><i class="${def.icon}"></i></div>
        <span class="mc-badge ${isStr?sevBadgeClass(sev):'b-normal'}">${isStr?sev:'LIVE'}</span>
      </div>
      <div class="mc-label">${def.label}</div>
      <div class="mc-value" id="mcv-${def.id}">${isStr?display:'0'+def.unit}</div>
      <div class="mc-sub">${def.sub}</div>
      <canvas class="mc-sparkline" id="spark-${def.id}" height="36"></canvas>
      <div class="mc-bar"><div class="mc-bar-fill" style="width:0" data-w="${fill}"></div></div>`;

    grid.appendChild(card);

    // Animate counter
    if(!isStr) {
      const el = card.querySelector('.mc-value');
      setTimeout(()=>animCount({set textContent(v){el.textContent=v+def.unit;}},Math.round(val),1200),i*60);
    }

    // Animate bar
    setTimeout(()=>{
      const b = card.querySelector('.mc-bar-fill');
      b.style.transition='width 1.2s cubic-bezier(0.4,0,0.2,1)';
      b.style.width = b.dataset.w+'%';
    },200+i*60);

    // Sparkline
    setTimeout(()=>drawSparkline(card.querySelector('.mc-sparkline'), sparkData, isStr?sevColor(sev):def.accent), 300+i*60);
  });

  updateGauge(metrics);
  updateAlertStatus(metrics);
  checkExtreme(metrics);
  renderTop5();
  renderAnomalyList();
}

function drawSparkline(canvas, data, color) {
  if(!canvas) return;
  canvas.width = canvas.offsetWidth||200;
  const ctx = canvas.getContext('2d');
  const w=canvas.width, h=canvas.height, pad=3;
  const max=Math.max(...data)||1, min=Math.min(...data);
  const xStep=(w-pad*2)/(data.length-1);

  ctx.clearRect(0,0,w,h);
  const grad = ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,color+'40'); grad.addColorStop(1,color+'00');

  ctx.beginPath();
  ctx.moveTo(pad, h-pad-((data[0]-min)/(max-min+0.001))*(h-pad*2));
  data.forEach((v,i)=>{ if(i>0) ctx.lineTo(pad+i*xStep, h-pad-((v-min)/(max-min+0.001))*(h-pad*2)); });
  ctx.lineTo(w-pad,h-pad); ctx.lineTo(pad,h-pad);
  ctx.fillStyle=grad; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(pad, h-pad-((data[0]-min)/(max-min+0.001))*(h-pad*2));
  data.forEach((v,i)=>{ if(i>0) ctx.lineTo(pad+i*xStep, h-pad-((v-min)/(max-min+0.001))*(h-pad*2)); });
  ctx.strokeStyle=color; ctx.lineWidth=1.5; ctx.stroke();
}

/* ────────────────────────────────
   GAUGE
──────────────────────────────── */
function updateGauge(metrics) {
  const sev = getSeverity(metrics.rainfall, metrics.temperature);
  const pct = {NORMAL:10,MODERATE:40,SEVERE:72,EXTREME:100}[sev];
  const color = sevColor(sev);
  const total = 251; // arc length approx
  const offset = total - (total * pct / 100);
  const path = document.getElementById('gaugeFill');
  if(path){ path.style.strokeDashoffset=offset; path.style.stroke=color; }
  const valEl = document.getElementById('gaugeValText');
  const labEl = document.getElementById('gaugeLabText');
  if(valEl) valEl.textContent = pct+'%';
  if(labEl){ labEl.textContent = sevLabel(sev); labEl.style.fill = color; }
}

/* ────────────────────────────────
   TOP 5 + ANOMALY
──────────────────────────────── */
function renderTop5() {
  const list = document.getElementById('top5List');
  if(!list) return;
  const data = STATE_DATA[currentYear]||STATE_DATA[2025];
  const ranked = Object.entries(data)
    .map(([state,d])=>({state,sev:getSeverity(d.rainfall,d.temperature),score:{NORMAL:0,MODERATE:1,SEVERE:2,EXTREME:3}[getSeverity(d.rainfall,d.temperature)],rainfall:d.rainfall}))
    .sort((a,b)=>b.score-a.score||a.rainfall-b.rainfall)
    .slice(0,5);

  list.innerHTML='';
  ranked.forEach((item,i)=>{
    const c = sevColor(item.sev);
    const pct = (1-item.rainfall/200)*100;
    const div = document.createElement('div'); div.className='top5-item';
    div.innerHTML=`
      <span class="top5-rank">${i+1}</span>
      <span class="top5-name">${item.state}</span>
      <div class="top5-bar-wrap"><div class="top5-bar-fill" style="width:0;background:${c}" data-w="${pct}"></div></div>
      <span class="top5-sev" style="background:${c}22;color:${c}">${sevLabel(item.sev)}</span>`;
    list.appendChild(div);
    setTimeout(()=>{ const b=div.querySelector('.top5-bar-fill'); b.style.transition='width 1s ease'; b.style.width=b.dataset.w+'%'; },100+i*80);
  });
}

function renderAnomalyList() {
  const list = document.getElementById('anomalyList');
  if(!list) return;
  const data = STATE_DATA[currentYear]||STATE_DATA[2025];
  const NORMAL_RAIN = 70;
  const items = Object.entries(data).slice(0,8).map(([state,d])=>({state, anomaly:((d.rainfall-NORMAL_RAIN)/NORMAL_RAIN*100).toFixed(0)}));

  list.innerHTML='';
  items.forEach(item=>{
    const pos = parseFloat(item.anomaly)>=0;
    const div=document.createElement('div'); div.className='anomaly-item';
    div.innerHTML=`<span class="anomaly-name">${item.state}</span><span class="anomaly-val ${pos?'anomaly-pos':'anomaly-neg'}">${pos?'+':''}${item.anomaly}%</span>`;
    list.appendChild(div);
  });
}

/* ────────────────────────────────
   WEATHER API
──────────────────────────────── */
async function fetchWeather(city) {
  const btn   = document.getElementById('fetchWeatherBtn');
  const icon  = document.getElementById('fetchIcon');
  const pill  = document.getElementById('apiStatus');
  const upd   = document.getElementById('lastUpdate');

  icon.className='fas fa-sync-alt spin'; btn.disabled=true;
  pill.textContent='Fetching…'; pill.className='api-pill';

  const url = `${CONFIG.OWM_URL}?q=${encodeURIComponent(city)},IN&appid=${CONFIG.OWM_API_KEY}&units=metric`;

  try {
    const r = await fetch(url);
    if(r.status===401) throw new Error('Invalid API key');
    if(!r.ok) throw new Error('API error '+r.status);
    const d = await r.json();

    const rain = d.rain?.['1h']||0;
    currentMetrics.rainfall    = Math.round(rain*720)||Math.floor(Math.random()*60+20);
    currentMetrics.temperature = Math.round(d.main.temp);
    currentMetrics.reservoir   = Math.max(20,Math.min(95,d.main.humidity));
    currentMetrics.population  = Math.round(20+Math.random()*80);
    currentMetrics.agri        = Math.round(15+Math.random()*50);
    currentMetrics.groundwater = Math.round(10+Math.random()*40);
    currentMetrics.stress      = Math.round(20+Math.random()*70);

    pill.textContent='✓ Live'; pill.className='api-pill ok';
    upd.textContent = 'Updated '+new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    showToast(`Live data loaded for ${city}`,'success');
  } catch(err) {
    // Fallback simulated
    currentMetrics.rainfall    = Math.floor(Math.random()*80+15);
    currentMetrics.temperature = Math.floor(Math.random()*12+30);
    currentMetrics.reservoir   = Math.floor(Math.random()*50+30);
    currentMetrics.population  = Math.round(20+Math.random()*80);
    currentMetrics.agri        = Math.round(15+Math.random()*50);
    currentMetrics.groundwater = Math.round(10+Math.random()*40);
    currentMetrics.stress      = Math.round(30+Math.random()*60);

    pill.textContent='⚠ Simulated'; pill.className='api-pill err';
    showToast(`Using simulated data (${err.message})`,'error');
  } finally {
    icon.className='fas fa-sync-alt'; btn.disabled=false;
    renderMetrics(currentMetrics);
    computeAI(currentMetrics);
  }
}

document.getElementById('fetchWeatherBtn').addEventListener('click',()=>fetchWeather(document.getElementById('citySelect').value));
document.getElementById('citySelect').addEventListener('change',()=>fetchWeather(document.getElementById('citySelect').value));
document.getElementById('yearFilter').addEventListener('change',e=>{
  currentYear=parseInt(e.target.value);
  document.getElementById('yearSelect').value=e.target.value;
  loadGeoJSON(currentYear);
  renderTop5(); renderAnomalyList();
  showToast(`Viewing ${currentYear} data`,'info',2000);
});

/* ────────────────────────────────
   AI DROUGHT PREDICTION
──────────────────────────────── */
function computeAI(metrics) {
  const rain = metrics.rainfall;
  const temp = metrics.temperature;
  const sev  = getSeverity(rain,temp);
  const probMap = {NORMAL:12,MODERATE:38,SEVERE:72,EXTREME:94};
  const prob = probMap[sev] + Math.round((Math.random()-0.5)*8);

  const probEl = document.getElementById('aiProb');
  const riskEl = document.getElementById('aiRisk');
  const fillEl = document.getElementById('aiFill');

  if(probEl) { animCount({set textContent(v){probEl.textContent=v+'%';}}, prob, 1200); }
  if(riskEl) { riskEl.textContent = `Predicted ${sevLabel(sev)} drought risk for next 30 days`; riskEl.style.color=sevColor(sev); }
  if(fillEl) { setTimeout(()=>{ fillEl.style.width=prob+'%'; },200); }
}

/* ────────────────────────────────
   MAP
──────────────────────────────── */
let map, geoLayer, heatLayer;
let currentYear = 2025;

function initMap() {
  map = L.map('indiaMap',{center:[22.5,82],zoom:5,minZoom:4,maxZoom:10});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'&copy; OSM &copy; CARTO', subdomains:'abcd', maxZoom:19,
  }).addTo(map);

  addHeatLayer();
  loadGeoJSON(currentYear);

  document.getElementById('yearSelect').addEventListener('change',e=>{
    currentYear=parseInt(e.target.value);
    document.getElementById('yearFilter').value=e.target.value;
    loadGeoJSON(currentYear);
    renderTop5(); renderAnomalyList();
  });
  document.getElementById('heatmapToggle').addEventListener('change',e=>{
    e.target.checked ? heatLayer.addTo(map) : map.removeLayer(heatLayer);
  });
  document.getElementById('choroplethToggle').addEventListener('change',e=>{
    if(geoLayer) e.target.checked ? geoLayer.addTo(map) : map.removeLayer(geoLayer);
  });
  document.getElementById('resetMapBtn').addEventListener('click',()=>map.flyTo([22.5,82],5,{duration:1}));
}

function loadGeoJSON(year) {
  const loader = document.getElementById('mapLoader');
  loader.classList.remove('hidden');
  const data = STATE_DATA[year]||STATE_DATA[2025];
  if(geoLayer){ map.removeLayer(geoLayer); geoLayer=null; }

  fetch(CONFIG.GEOJSON_URL)
    .then(r=>r.json())
    .then(geo=>{
      geoLayer = L.geoJSON(geo,{
        style: f=>styleFeature(f,data),
        onEachFeature:(f,layer)=>bindFeature(f,layer,data),
      }).addTo(map);
      loader.classList.add('hidden');
    })
    .catch(()=>{
      loader.classList.add('hidden');
      renderFallbackMarkers(data);
    });
}

function styleFeature(f,data) {
  const name = f.properties?.NAME_1||f.properties?.name||f.properties?.ST_NM||'';
  const d = data[name];
  if(!d) return {fillColor:'#1a3a50',color:'#0a1f2e',weight:1,fillOpacity:0.25};
  const s = getSeverity(d.rainfall,d.temperature);
  const clr = sevColor(s);
  return {fillColor:clr,color:'#0a1f2e',weight:1.5,fillOpacity:0.55,opacity:1};
}

function bindFeature(f,layer,data) {
  const name = f.properties?.NAME_1||f.properties?.name||f.properties?.ST_NM||'Unknown';
  const d = data[name]||{rainfall:50,temperature:32,reservoir:60,groundwater:20};
  const sev = getSeverity(d.rainfall,d.temperature);
  const c = sevColor(sev);

  layer.bindPopup(makePopup(name,d,sev,c),{maxWidth:260});

  layer.on('mouseover',function(){
    this.setStyle({weight:2.5,fillOpacity:0.75});
    this.openPopup();
  });
  layer.on('mouseout',function(){
    if(geoLayer) geoLayer.resetStyle(this);
    this.closePopup();
  });
  layer.on('click',function(){ map.fitBounds(this.getBounds(),{padding:[40,40]}); });
}

function makePopup(name,d,sev,c) {
  return `<div class="spopup">
    <h4><i class="fas fa-map-pin" style="color:${c}"></i>${name}</h4>
    <table>
      <tr><td>🌧 Rainfall</td><td>${d.rainfall}mm/mo</td></tr>
      <tr><td>🌡 Temperature</td><td>${d.temperature}°C</td></tr>
      <tr><td>💧 Reservoir</td><td>${d.reservoir}%</td></tr>
      <tr><td>🌱 Groundwater</td><td>${d.groundwater}m depth</td></tr>
    </table>
    <span class="spopup-sev" style="background:${c}22;color:${c};border:1px solid ${c}44">${sevLabel(sev)} Drought</span>
  </div>`;
}

function renderFallbackMarkers(data) {
  Object.entries(STATE_CENTROIDS).forEach(([state,ll])=>{
    const d=data[state]||{rainfall:50,temperature:32,reservoir:60,groundwater:20};
    const sev=getSeverity(d.rainfall,d.temperature), c=sevColor(sev);
    L.circleMarker(ll,{radius:13,fillColor:c,color:'#0a1f2e',weight:1.5,opacity:1,fillOpacity:0.7})
     .bindPopup(makePopup(state,d,sev,c)).addTo(map);
  });
}

function addHeatLayer() {
  heatLayer = L.heatLayer(HEATMAP_POINTS,{
    radius:35,blur:22,maxZoom:9,
    gradient:{0:'#003366',0.2:'#0369a1',0.4:'#facc15',0.6:'#f97316',0.8:'#ef4444',1:'#7f1d1d'},
  }).addTo(map);
}

/* ────────────────────────────────
   CHARTS
──────────────────────────────── */
Chart.defaults.color='#5a7a92';
Chart.defaults.font.family="'Outfit',sans-serif";
Chart.defaults.font.size=12;
Chart.defaults.borderColor='rgba(14,165,233,0.1)';

const CC={
  blue:'rgba(14,165,233,1)', blueA:'rgba(14,165,233,0.15)',
  green:'rgba(34,197,94,1)', greenA:'rgba(34,197,94,0.15)',
  yellow:'rgba(250,204,21,1)', orange:'rgba(249,115,22,1)', red:'rgba(239,68,68,1)',
  purple:'rgba(168,85,247,1)',
};

function tooltipDefaults() {
  return {backgroundColor:'#071624',borderColor:'rgba(14,165,233,0.3)',borderWidth:1,padding:12,cornerRadius:8};
}

let rfChart;
function initRainfallChart(region='All India') {
  const ctx=document.getElementById('rainfallChart').getContext('2d');
  const d=MONTHLY_RAINFALL[region]||MONTHLY_RAINFALL['All India'];
  if(rfChart) rfChart.destroy();
  rfChart=new Chart(ctx,{
    type:'line',
    data:{
      labels:MONTHLY_RAINFALL.labels,
      datasets:[
        {label:'Actual (mm)',data:d.actual,borderColor:CC.blue,backgroundColor:CC.blueA,borderWidth:2.5,fill:true,tension:0.4,pointRadius:4,pointHoverRadius:7,pointBackgroundColor:CC.blue},
        {label:'30-yr Normal',data:d.normal,borderColor:CC.yellow,backgroundColor:'transparent',borderWidth:2,borderDash:[6,4],tension:0.4,pointRadius:3,pointHoverRadius:5,pointBackgroundColor:CC.yellow},
      ],
    },
    options:{responsive:true,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{usePointStyle:true,padding:16}},tooltip:tooltipDefaults()},
      scales:{x:{grid:{color:'rgba(255,255,255,0.05)'}},y:{grid:{color:'rgba(255,255,255,0.05)'},beginAtZero:true,title:{display:true,text:'mm'}}}},
  });
}

function initReservoirChart() {
  const ctx=document.getElementById('reservoirChart').getContext('2d');
  const pcts=RESERVOIR_DATA.current.map((v,i)=>v/RESERVOIR_DATA.capacity[i]);
  new Chart(ctx,{
    type:'bar',
    data:{
      labels:RESERVOIR_DATA.labels,
      datasets:[
        {label:'Current (BCM)',data:RESERVOIR_DATA.current,backgroundColor:pcts.map(p=>p<0.4?CC.red:p<0.6?CC.orange:CC.blue),borderRadius:5,borderSkipped:false},
        {label:'Capacity (BCM)',data:RESERVOIR_DATA.capacity,backgroundColor:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,borderRadius:5,borderSkipped:false},
      ],
    },
    options:{responsive:true,plugins:{legend:{labels:{usePointStyle:true}},tooltip:tooltipDefaults()},
      scales:{x:{grid:{display:false},ticks:{maxRotation:35,font:{size:10}}},y:{grid:{color:'rgba(255,255,255,0.05)'},title:{display:true,text:'BCM'}}}},
  });
}

function initGroundwaterChart() {
  const ctx=document.getElementById('groundwaterChart').getContext('2d');
  const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data=[18,19,20,22,24,25,21,18,16,15,16,17];
  new Chart(ctx,{
    type:'line',
    data:{labels,datasets:[{label:'Depth (m)',data,borderColor:CC.orange,backgroundColor:'rgba(249,115,22,0.1)',borderWidth:2.5,fill:true,tension:0.4,pointRadius:4,pointHoverRadius:7,pointBackgroundColor:CC.orange}]},
    options:{responsive:true,plugins:{legend:{labels:{usePointStyle:true}},tooltip:tooltipDefaults()},
      scales:{x:{grid:{color:'rgba(255,255,255,0.05)'}},y:{grid:{color:'rgba(255,255,255,0.05)'},title:{display:true,text:'m below surface'}}}},
  });
}

function initCropLossChart() {
  const ctx=document.getElementById('cropLossChart').getContext('2d');
  const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data=[5,6,8,12,18,22,14,10,8,6,5,4];
  new Chart(ctx,{
    type:'bar',
    data:{labels,datasets:[{label:'Crop area affected (%)',data,backgroundColor:data.map(v=>v>18?CC.red:v>12?CC.orange:CC.yellow),borderRadius:4,borderSkipped:false}]},
    options:{responsive:true,plugins:{legend:{labels:{usePointStyle:true}},tooltip:tooltipDefaults()},
      scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(255,255,255,0.05)'},title:{display:true,text:'%'},max:30}}},
  });
}

function initUsagePieChart() {
  const ctx=document.getElementById('usagePieChart').getContext('2d');
  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Agriculture','Domestic','Industrial','Energy','Environment'],
      datasets:[{data:[78,8,7,4,3],backgroundColor:['#0ea5e9','#22c55e','#f97316','#facc15','#8b5cf6'],borderColor:'#071624',borderWidth:3,hoverOffset:12}],
    },
    options:{responsive:true,cutout:'65%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:14}},tooltip:{...tooltipDefaults(),callbacks:{label:c=>` ${c.label}: ${c.parsed}%`}}}},
  });
}

/* Reservoir fill meters */
function renderReservoirMeters() {
  const grid=document.getElementById('rmGrid');
  if(!grid) return;
  grid.innerHTML='';
  RESERVOIR_DATA.labels.forEach((name,i)=>{
    const pct=Math.round((RESERVOIR_DATA.current[i]/RESERVOIR_DATA.capacity[i])*100);
    const c=pct<40?'#ef4444':pct<60?'#f97316':'#0ea5e9';
    const div=document.createElement('div'); div.className='rm-item';
    div.innerHTML=`
      <div class="rm-label-row"><span class="rm-name">${name}</span><span class="rm-pct">${pct}%</span></div>
      <div class="rm-track"><div class="rm-fill" style="width:0;background:${c}" data-w="${pct}"></div></div>`;
    grid.appendChild(div);
    setTimeout(()=>{ const f=div.querySelector('.rm-fill'); f.style.transition='width 1.2s ease'; f.style.width=pct+'%'; },100+i*80);
  });
}

/* ────────────────────────────────
   ALERT SYSTEM
──────────────────────────────── */
function renderAlertFeed() {
  const list=document.getElementById('alertFeedList');
  if(!list) return;
  list.innerHTML='';
  SEED_ALERTS.forEach(a=>{
    const c=sevColor(a.sev.toUpperCase());
    const el=document.createElement('div'); el.className='af-item';
    el.innerHTML=`<div class="af-dot" style="background:${c}"></div><div class="af-text"><strong style="color:${c}">${a.state}</strong> — ${a.msg}<div class="af-time">${a.time}</div></div>`;
    list.appendChild(el);
  });
}

function updateAlertStatus(metrics) {
  const sev=getSeverity(metrics.rainfall,metrics.temperature);
  const fill=document.getElementById('sevFill');
  const chip=document.getElementById('sevChip');
  const status=document.getElementById('alertSysStatus');
  const map2={NORMAL:10,MODERATE:40,SEVERE:72,EXTREME:100};
  const c=sevColor(sev);
  if(fill){fill.style.width=map2[sev]+'%';fill.style.background=c;}
  if(chip){chip.textContent=sevLabel(sev)+' Risk';chip.className='sev-chip '+sevChipClass(sev);}
  if(status) status.textContent = sev==='EXTREME'?'🚨 Critical Alert Active':'Monitoring Active';
}

function checkExtreme(metrics) {
  const sev=getSeverity(metrics.rainfall,metrics.temperature);
  if(sev==='EXTREME') {
    const modal=document.getElementById('droughtModal');
    const msg=document.getElementById('modalMsg');
    const smsEl=document.getElementById('modalSmsBadge');
    msg.textContent=`Critical — Rainfall: ${metrics.rainfall}mm, Temperature: ${metrics.temperature}°C. Immediate intervention required.`;
    const prefs=JSON.parse(localStorage.getItem('jd_prefs')||'{}');
    smsEl.style.display=prefs.sms?'flex':'none';
    modal.classList.add('open');
    // Add to feed
    const list=document.getElementById('alertFeedList');
    if(list){
      const c=sevColor('EXTREME');
      const el=document.createElement('div'); el.className='af-item';
      el.innerHTML=`<div class="af-dot" style="background:${c}"></div><div class="af-text"><strong style="color:${c}">Auto-Alert</strong> — Extreme drought auto-triggered<div class="af-time">Just now</div></div>`;
      list.prepend(el);
    }
  }
}

function initAlertSystem() {
  document.getElementById('modalAck').addEventListener('click',()=>{
    document.getElementById('droughtModal').classList.remove('open');
    showToast('Alert acknowledged','success');
  });
  document.getElementById('modalClose').addEventListener('click',()=>document.getElementById('droughtModal').classList.remove('open'));

  document.getElementById('saveAlertBtn').addEventListener('click',()=>{
    const prefs={
      sms:document.getElementById('smsCheck').checked,
      email:document.getElementById('emailCheck').checked,
      push:document.getElementById('pushCheck').checked,
      phone:document.getElementById('phoneInput').value,
    };
    localStorage.setItem('jd_prefs',JSON.stringify(prefs));
    showToast('Alert preferences saved','success');
    if(prefs.sms&&prefs.phone) setTimeout(()=>showToast(`SMS configured for ${prefs.phone}`,'info'),1200);
  });

  // Load saved prefs
  const prefs=JSON.parse(localStorage.getItem('jd_prefs')||'{}');
  if(prefs.sms!==undefined) document.getElementById('smsCheck').checked=prefs.sms;
  if(prefs.email!==undefined) document.getElementById('emailCheck').checked=prefs.email;
  if(prefs.push!==undefined) document.getElementById('pushCheck').checked=prefs.push;
  if(prefs.phone) document.getElementById('phoneInput').value=prefs.phone;
}

/* ────────────────────────────────
   POLICY + SDG
──────────────────────────────── */
function renderPolicy() {
  const grid=document.getElementById('policyGrid');
  if(!grid) return;
  POLICY_DATA.forEach((p,i)=>{
    const card=document.createElement('div'); card.className='pol-card';
    card.setAttribute('data-aos','fade-up'); card.setAttribute('data-aos-delay',i*80+'');
    card.innerHTML=`<div class="pol-icon"><i class="${p.icon}"></i></div><h3>${p.title}</h3><p>${p.desc}</p><ul>${p.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    grid.appendChild(card);
  });
}

function renderSDG() {
  const container=document.getElementById('sdgBars');
  if(!container) return;
  SDG_DATA.forEach(d=>{
    const el=document.createElement('div'); el.className='sdg-item';
    el.innerHTML=`<div class="sdg-row"><span>${d.label}</span><span>${d.val}% of 100%</span></div><div class="sdg-track"><div class="sdg-fill" data-w="${d.val}"></div></div>`;
    container.appendChild(el);
  });
  const io=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      container.querySelectorAll('.sdg-fill').forEach(f=>{ f.style.width=f.dataset.w+'%'; });
      io.disconnect();
    }
  },{threshold:0.3});
  io.observe(container);
}

/* ────────────────────────────────
   GSAP ANIMATIONS
──────────────────────────────── */
function initGSAP() {
  if(typeof gsap==='undefined') return;
  // Hero entrance
  gsap.from('.hero-badge',{opacity:0,y:20,duration:0.6,delay:0.1});
  gsap.from('.hero-title', {opacity:0,y:30,duration:0.7,delay:0.2});
  gsap.from('.hero-sub',   {opacity:0,y:20,duration:0.6,delay:0.4});
  gsap.from('.hero-btns',  {opacity:0,y:20,duration:0.5,delay:0.5});
  gsap.from('.hero-kpis',  {opacity:0,y:20,duration:0.5,delay:0.6});
  gsap.from('.gw-center',  {scale:0.5,opacity:0,duration:1,delay:0.3,ease:'back.out(1.7)'});
  gsap.from('.stat-pill',  {opacity:0,scale:0.8,duration:0.5,stagger:0.15,delay:0.7,ease:'back.out(1.5)'});
}

/* ────────────────────────────────
   CHARTS LAZY INIT
──────────────────────────────── */
function initCharts() {
  initRainfallChart();
  initReservoirChart();
  initGroundwaterChart();
  initCropLossChart();
  initUsagePieChart();
  renderReservoirMeters();
  document.getElementById('rainfallStateSelect').addEventListener('change',e=>initRainfallChart(e.target.value));
}

/* ────────────────────────────────
   MAIN INIT
──────────────────────────────── */
function initAll() {
  AOS.init({duration:650,easing:'ease-out-cubic',once:true,offset:60});

  initSidebar();
  startClock();
  initTheme();
  initNotifications();
  initSearch();
  initParticles();
  initHeroCounters();
  initGSAP();

  renderMetrics(currentMetrics);
  renderAlertFeed();
  initAlertSystem();
  renderPolicy();
  renderSDG();
  computeAI(currentMetrics);

  initMap();

  // Lazy-load charts
  const io=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){ initCharts(); io.disconnect(); }
  },{threshold:0.1});
  const analyticsSection=document.getElementById('analytics');
  if(analyticsSection) io.observe(analyticsSection);

  // Auto-fetch weather on load
  setTimeout(()=>fetchWeather('Delhi'),800);

  // Periodic refresh every 5 minutes
  setInterval(()=>fetchWeather(document.getElementById('citySelect').value),300000);

  console.log('%c🌊 JalDrishti v2.0 — Intelligence Platform Ready','color:#38bdf8;font-weight:900;font-size:15px;');
}

/* Boot */
document.addEventListener('DOMContentLoaded', runLoader);