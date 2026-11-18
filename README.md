# ✦ FLOWSTATE — Productivity Dashboard & Kinetic Liquid Atmosphere

> A calm, visually distinctive productivity dashboard that turns a busy mind into a clear next step — powered by a living, interactive three-dimensional kinetic lightfield and fluid cursor.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-liquid--wallpaper.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://liquid-wallpaper.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

🔗 **Live Deployment**: [https://liquid-wallpaper.vercel.app/](https://liquid-wallpaper.vercel.app/)

---

## ✨ Features

- **Productivity Dashboard**:
  - **Overview**: Real-time summary metrics (tasks completed, focus minutes logged, upcoming deadlines), quick-capture input, and Up Next priorities.
  - **Task Management**: Filterable task list with priority tags (Urgent, High, Medium, Low), deadline countdowns, inline completion toggles, and edit modals.
  - **Dedicated Focus Mode**: Integrated focus timer (custom duration, pause/resume, session tracking) to get in the zone without distraction.
  - **Persistent Local Storage**: Offline-first architecture automatically saving tasks, sessions, and preferences locally.

- **3D Kinetic Tubes Cursor & Liquid Atmosphere**:
  - WebGL-powered dynamic fluid tubes cursor created with Three.js that weaves glowing ribbons trailing cursor and touch interactions.
  - Interactive color morphing with smooth organic transitions.
  - **Curated Atmosphere Presets**: Nebula 🌌, Cyberpunk ⚡, Ocean 🌊, Solar 🔥, and Acid 🌿.
  - **Zen Mode & Fullscreen**: Toggle off HUD elements for an immersive, distraction-free kinetic ambient backdrop.
  - Mobile touch optimized with zero bounce.

- **Vercel Production Ready**: Configured with `vercel.json` for single-page routing and instant continuous deployment.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushpatil5408/Liquid-Wallpaper.git
   cd Liquid-Wallpaper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deploy to Vercel

This repository is pre-configured for seamless deployment on [Vercel](https://vercel.com):

### Option 1: Import via Vercel Dashboard (Recommended)
1. Push this repository to your GitHub account (`https://github.com/ayushpatil5408/Liquid-Wallpaper.git`).
2. Log into [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **"Add New..."** → **"Project"**.
4. Select `Liquid-Wallpaper` from your GitHub repositories (use lowercase `liquid-wallpaper` if prompted for project name).
5. Vercel automatically detects the Vite framework and settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your site will be live on a `*.vercel.app` URL in seconds!

### Option 2: Deploy using Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **3D Graphics Engine**: Three.js WebGL Tubes
- **Styling**: Vanilla CSS (Glassmorphism, CSS Custom Properties, Responsive Media Queries)
- **Deployment**: Vercel

---

## 📄 License

MIT License © 2026 Ayush Patil
