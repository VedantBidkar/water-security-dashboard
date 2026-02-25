# water-security-dashboard
# 💧 JalDrishti — Water Security & Drought Management Dashboard

> Real-time hydrology intelligence, drought severity mapping & climate resilience analytics for India.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-22c55e?style=flat-square)
![States Monitored](https://img.shields.io/badge/States%20Monitored-36-0ea5e9?style=flat-square)
![Data Points](https://img.shields.io/badge/Data%20Points%2FDay-1200K+-06b6d4?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-f97316?style=flat-square)

---

## 🌊 Overview

**JalDrishti** (जलदृष्टि — *Vision of Water*) is a full-stack frontend dashboard for monitoring water security and drought conditions across all 36 states and union territories of India. It integrates live weather data, interactive choropleth maps, historical analytics, and an early warning alert system — all in a single-page application.

Built with India's official boundary data, IMD drought thresholds, and SDG 6 progress tracking.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌙 **Dark / Light Mode** | Toggle with localStorage persistence |
| 📊 **Live Metrics** | 6 real-time water security indicators via OpenWeatherMap API |
| 🗺️ **Interactive India Map** | Choropleth drought map with official GoI boundary (incl. POK & Aksai Chin) |
| 🔥 **Water Stress Heatmap** | Leaflet.heat overlay showing hotspot zones |
| 📈 **Analytics Charts** | Rainfall trends, reservoir levels, groundwater depth, usage breakdown |
| ⚠️ **Early Warning Alerts** | Automated drought severity alerts with SMS/email/push preferences |
| 📋 **Export CSV** | Download full state-wise water data report |
| 🃏 **Flashcard Hover** | Metric cards flip to show detailed contextual stats |
| 🔍 **Tooltip Modals** | Click ⓘ on any metric for source, methodology & threshold info |
| 🌏 **Region Filter** | Filter cities by North / South / East / West / Central / Northeast |
| 📱 **Fully Responsive** | Mobile-first design with hamburger navigation |
| 🏛️ **Policy Hub** | Government schemes, water allocation policies & SDG 6 tracking |

---

## 🛠️ Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — no frontend framework
- **[Leaflet.js](https://leafletjs.com/)** — interactive India map with GeoJSON
- **[Chart.js](https://www.chartjs.org/)** — analytics charts
- **[OpenWeatherMap API](https://openweathermap.org/api)** — live weather data
- **[Syne + DM Sans](https://fonts.google.com/)** — typography
- **[Font Awesome 6](https://fontawesome.com/)** — icons
- **India States GeoJSON** — `india-in-data/india-states-2019` (official GoI boundary)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/VedantBidkar/water-security-dashboard.git
cd water-security-dashboard
```

### 2. Add your OpenWeatherMap API key
Open `script.js` and replace line 21:
```javascript
OWM_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY',
```
Get a free key at [openweathermap.org/api](https://openweathermap.org/api)

### 3. Open in browser
```bash
# Simply open index.html in any browser
open index.html
# or use Live Server in VS Code
```

> No build step, no npm install, no dependencies to manage. Pure HTML/CSS/JS.

---

## 🗺️ Map Details

The India map uses the **official Government of India boundary**, sourced from `india-in-data/india-states-2019`:

- ✅ Full Jammu & Kashmir including Pakistan-administered territory (as per GoI claim)
- ✅ Aksai Chin shown as part of India
- ✅ Arunachal Pradesh fully included
- ✅ Ladakh and J&K as separate UTs (post-2019 reorganisation)
- ✅ All 28 states + 8 union territories colored by drought severity

Drought severity is calculated using **IMD (India Meteorological Department)** thresholds:

| Severity | Rainfall | Temperature |
|---|---|---|
| 🟢 Normal | > 40mm/month | < 36°C |
| 🟡 Moderate | 20–40mm/month | 36–40°C |
| 🟠 Severe | < 40mm/month OR > 36°C | — |
| 🔴 Extreme | < 20mm/month AND > 40°C | — |

---

## 📂 Project Structure
```
water-security-dashboard/
│
├── index.html          # Main dashboard layout & all sections
├── style.css           # Dark/light theme, animations, responsive design
├── script.js           # All logic: map, charts, API, alerts, features
└── README.md           # You are here
```

---

## 📡 Data Sources

| Source | Usage |
|---|---|
| [IMD India](https://imd.gov.in) | Drought thresholds & classification |
| [CWC India](https://cwc.gov.in) | Reservoir level benchmarks |
| [OpenWeatherMap](https://openweathermap.org) | Live temperature & rainfall |
| [UN SDG Portal](https://sdgs.un.org) | SDG 6 progress indicators |
| [india-in-data/india-states-2019](https://github.com/india-in-data/india-states-2019) | Official India GeoJSON boundary |

> **Note:** State-level water data is simulated for demonstration purposes using realistic ranges based on historical IMD records.

---

## 🏛️ Government Schemes Covered

- Jal Jeevan Mission (JJM)
- Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)
- Atal Bhujal Yojana
- National Water Mission (NWM)
- AMRUT 2.0

---

## 🎯 SDG 6 Tracking

The dashboard tracks India's progress on **UN Sustainable Development Goal 6 — Clean Water & Sanitation** across five indicators:
- Safe drinking water access
- Sanitation & hygiene coverage  
- Water use efficiency
- Integrated water resource management
- Transboundary water cooperation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Built for India's Water Future 🇮🇳

*"Jal hi Jeevan hai"* — Water is Life

</div>
