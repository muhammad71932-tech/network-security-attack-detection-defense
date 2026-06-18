# Network Security — Multi-Layer Attack Detection & Defense System

A full-stack interactive dashboard for analysing, computing, and defending against multi-layer network attacks. Built as a Complex Computing Problem (CCP) submission for the Network Security course, BS Computer Science 2026.

---

## Overview

This project simulates a real-world network security incident affecting a mid-sized e-commerce company operating a hybrid network (`192.168.10.0/24`). The application covers the full attack lifecycle — from threat identification through computational analysis, defence design, and secure architecture redesign.

---

## Features

| Section | Description |
|---------|-------------|
| **Dashboard** | Live network topology diagram, IDS/firewall log feeds, 4 threat stat cards |
| **Part A — Attack Identification** | 4 attack types (ARP Spoofing, DNS Poisoning, Port Scan, Wi-Fi Deauth) with ARP table analysis and full IDS log evidence |
| **Part B — Computational Analysis** | Interactive calculators — ARP traffic % increase, bandwidth impact, port scan time & IDS detectability |
| **Part C — Defence Strategy** | 4-layer defence-in-depth model with 18 controls, attack→defence mapping, tool recommendations |
| **Part D — Secure Architecture** | Side-by-side current vs secure network diagrams, 5-VLAN design, per-zone security controls |
| **Full Report** | Print-ready academic report covering all parts with step-by-step calculations, tables, and conclusion |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS 3
- React Router DOM v6
- Axios

**Backend**
- Python 3 + Flask
- Flask-CORS
- RESTful API (5 endpoint groups)

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- Python 3.10+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py                   # API runs on http://localhost:5001
```

### Frontend

```bash
cd frontend
npm install
npm run dev                     # App runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attacks/` | All attack data |
| GET | `/api/attacks/arp-table` | ARP table with anomaly flags |
| GET | `/api/attacks/ids-logs` | IDS alert log entries |
| GET | `/api/attacks/firewall-logs` | Firewall log entries |
| GET | `/api/attacks/summary` | Threat summary stats |
| GET | `/api/analysis/arp` | ARP traffic calculations |
| GET | `/api/analysis/portscan` | Port scan time & detectability |
| GET | `/api/defense/` | Multi-layer defence mechanisms |
| GET | `/api/architecture/` | Current & secure architecture data |

---

## Key Calculations (Part B)

**ARP Traffic Analysis**
```
% Increase  = ((5000 - 200) / 200) × 100  =  2400%
Bandwidth   = 5000 × 60 bytes × 8         =  2,400,000 bps  (2.4 Mbps)
```

**Port Scan Detectability**
```
Total Time  = 1000 ports × 2 ms           =  2000 ms  =  2 seconds
IDS Threshold = 1 second
2s > 1s  →  DETECTABLE by IDS
```

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── data/network_data.py     # All static scenario data
│   │   └── routes/                  # attacks, analysis, defense, architecture
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── src/
    │   ├── api/index.js
    │   ├── components/common/       # Layout, Sidebar, Header, StatCard
    │   └── pages/                   # Dashboard, AttackIdentification, ComputationalAnalysis,
    │                                #   DefenseStrategy, SecureArchitecture, Report
    └── package.json
```

---

## Academic Context

- **Course:** Network Security
- **Program:** BS Computer Science (CB)
- **Topic:** Multi-Layer Network Attack Detection and Defense Design
- **Mapped CLO:** CLO3
- **WP Attributes:** WP2 (Depth of Analysis), WP3 (Depth of Knowledge)
- **Due Date:** 25-06-2026
