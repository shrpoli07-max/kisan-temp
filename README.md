# 🌾 Kisan IQ — AI-Powered Farming Intelligence Platform

> Empowering India's 100M+ small & marginal farmers with data-driven decisions to maximize profit and minimize risk.

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)

---

## 🎯 Problem Statement

**86% of Indian farmers** are small or marginal, cultivating less than 2 hectares. They lack access to real-time market intelligence, weather analytics, and scientific crop planning — leading to **₹50,000+ annual losses** per farmer due to poor timing, middleman exploitation, and crop disease.

## 💡 Solution

**Kisan IQ** is a mobile-first, multilingual (English + Telugu) web application that acts as a **digital agricultural advisor**, combining AI/ML predictions with real government data sources to deliver actionable insights.

---

## ✨ Features

### 📊 Smart Dashboard
- Location-aware crop recommendations (Top 3 per season)
- Live weather, soil health, and market price widgets
- Animated counters and real-time data pulse indicators

### 💰 Sell Advisor
- AI-powered sell/wait recommendations with confidence scores
- ARIMA + LSTM price trend predictions
- Risk assessment and optimal selling window

### 📈 Income Simulator
- Interactive sliders for acreage, crop type, and budget
- Side-by-side comparison: middleman vs. direct sale
- Seasonal profit projections with breakeven analysis

### 🔬 Disease Detector
- Image upload with simulated CNN (ResNet-50) analysis
- Multi-stage detection progress visualization
- Treatment protocols (organic + chemical) with cost estimates

### 🏆 Crop Ranker
- Multi-criteria ranking: profit, water needs, risk, market demand
- Comparative radar charts
- Region-specific recommendations

### 💧 Water Stress Monitor
- Satellite-derived soil moisture data (NASA SMAP simulation)
- Irrigation scheduling recommendations
- Water usage optimization tips

### 🧪 Fertilizer Optimizer
- NPK ratio recommendations based on soil health data
- Cost-optimized fertilizer plans
- Organic vs. chemical comparison

### 🏪 Direct Buyer Map
- Bypass middlemen — connect directly with FPOs and mandis
- Distance and price comparison
- e-NAM integration simulation

### 📋 Government Schemes Matcher
- Eligibility-based scheme recommendations
- PM-KISAN, PMFBY, KCC, and 10+ schemes
- Application guidance and document checklist

### 📅 Crop Calendar
- Season-wise planting and harvesting schedules
- Task reminders and activity tracking
- Region-customized timelines

### 🤖 Alert Bot
- Conversational AI assistant for farming queries
- Weather alerts, price notifications, pest warnings
- Simulated NLP-powered chat interface

### 🎖️ Farmer IQ Score
- Gamified scoring system (0–100) with radial chart
- Achievement badges for sustainable practices
- Benchmarking against regional averages

### 📚 Data Sources & Methodology
- Full transparency: 22+ real-world datasets cited
- AI model documentation (ARIMA, LSTM, ResNet-50, Random Forest)
- Links to government portals and research papers

---

## 📡 Data Sources

| Category | Source | URL |
|----------|--------|-----|
| Mandi Prices | AGMARKNET | https://agmarknet.gov.in |
| Market Platform | e-NAM | https://enam.gov.in |
| Weather | IMD | https://mausam.imd.gov.in |
| Weather API | Open-Meteo | https://open-meteo.com |
| Soil Health | Soil Health Card | https://soilhealth.dac.gov.in |
| Water Resources | India-WRIS | https://indiawris.gov.in |
| Satellite Data | NASA SMAP | https://smap.jpl.nasa.gov |
| MSP Rates | CACP | https://cacp.dacnet.nic.in |
| Crop Disease | PlantVillage | https://plantvillage.psu.edu |
| Schemes | PM-KISAN | https://pmkisan.gov.in |
| Insurance | PMFBY | https://pmfby.gov.in |
| Agriculture Census | DES | https://desagri.gov.in |
| Genetic Resources | ICAR-NBPGR | https://www.nbpgr.ernet.in |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS 3, Glassmorphism design system |
| Charts | Recharts (RadialBar, Area, Bar, Radar) |
| State | TanStack React Query |
| Routing | React Router v6 |
| Backend | Lovable Cloud (Auth, Database, Edge Functions) |
| i18n | Custom context-based (English + Telugu) |
| UI Components | shadcn/ui + Radix primitives |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd kisan-iq

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Multilingual Support

Kisan IQ supports **English** and **Telugu** (తెలుగు) with a one-click language toggle. The translation system covers all UI labels, feature names, and key agricultural terms.

---

## 📱 Mobile-First Design

- Responsive layouts optimized for smartphones (360px+)
- Touch-friendly controls and large tap targets
- Collapsible sidebar navigation
- Offline-friendly UI with minimal data requirements

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   ├── AnimatedCounter   # Animated number displays
│   ├── AppLayout         # Main layout with sidebar
│   └── NavLink           # Navigation component
├── contexts/            # React contexts (Language)
├── hooks/               # Custom hooks
├── integrations/        # Backend integrations
├── pages/               # Route pages (13 features)
└── index.css            # Design system tokens
```

---

## 👥 Team

Built for hackathon demonstration — showcasing how technology can bridge the information gap for Indian farmers.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>🌱 Kisan IQ — Because every farmer deserves smart decisions.</strong>
</p>
