# FUTUREVERSE — Autonomous AI-Powered Recruitment Operating System
**Created, Architected & Developed by Sayan Rooj**  
*FUTUREVERSE © 2026 • Production Edition • India Standard Time (IST, UTC+05:30) Standard*

[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-LIVE-2ea44f?style=for-the-badge&logo=githubpages)](https://sayanrooj.github.io/FUTUREVERSE/)
[![Live Platform](https://img.shields.io/badge/Tunnel_Live-Operational-emerald?style=for-the-badge&logo=cloudflare)](https://d7b55d3a57a4c2.lhr.life)
[![GitHub Repository](https://img.shields.io/badge/GitHub-FUTUREVERSE-indigo?style=for-the-badge&logo=github)](https://github.com/sayanrooj/FUTUREVERSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.12-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Vite React](https://img.shields.io/badge/Frontend-Vite_8_React_TypeScript-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_Glassmorphism-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## 🌐 Live Access Links

* 🌟 **Official GitHub Pages Website:** **[https://sayanrooj.github.io/FUTUREVERSE/](https://sayanrooj.github.io/FUTUREVERSE/)**
* 🚀 **Interactive Full-Stack Live Tunnel:** [https://d7b55d3a57a4c2.lhr.life](https://d7b55d3a57a4c2.lhr.life)
* 💻 **Local Development Server:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
* 📖 **Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* 🐙 **GitHub Repository:** [https://github.com/sayanrooj/FUTUREVERSE](https://github.com/sayanrooj/FUTUREVERSE)

---

## 🌟 Executive Overview

**FUTUREVERSE** is a high-performance talent acquisition operating system engineered to replace subjective, legacy hiring cycles with explainable artificial intelligence, strict criteria engineering, proctored adaptive interviews, and human-in-the-loop decision governance.

Unlike black-box keyword parsers, FUTUREVERSE combines **deep resume schema extraction**, **recruiter-defined 100% weighted rubrics**, an **adaptive proctored AI interview chamber**, and an automated **Domain Intelligence Communication Suite** that keeps candidates notified part-by-part across every stage of recruitment.

---

## 🏛️ Core Architecture & Tech Stack

```
                               ┌─────────────────────────────────────────┐
                               │       FUTUREVERSE CLIENT INTERFACE      │
                               │  (Vite 8 • React 18 • TypeScript • CSS) │
                               └────────────────────┬────────────────────┘
                                                    │
                                         HTTPS Reverse Proxy
                                                    │
                               ┌────────────────────▼────────────────────┐
                               │        FASTAPI ASYNC ENGINE             │
                               │  (Python 3.12 • SQLAlchemy 2.0 • Async) │
                               └───────┬────────────┬────────────┬───────┘
                                       │            │            │
             ┌─────────────────────────┴──┐         │         ┌──┴─────────────────────────┐
             │                            │         │         │                            │
 ┌───────────▼──────────┐      ┌──────────▼──────┐  │ ┌───────▼───────────┐      ┌─────────▼──────────┐
 │ SQLite Database      │      │ AI Proctored    │  │ │ Domain Intel      │      │ Non-Blocking       │
 │ Relational Data Store│      │ Interview Room  │  │ │ Communication     │      │ Threaded SMTP      │
 │ (12 Jobs • 14 Apps)  │      │ Telemetry Engine│  │ │ (5 Tech Tracks)   │      │ (Gmail TLS Engine) │
 └──────────────────────┘      └─────────────────┘  │ └───────────────────┘      └────────────────────┘
                                                    │
                                       ┌────────────▼───────────┐
                                       │ Real IST System Clock  │
                                       │ (UTC+05:30 Standard)   │
                                       └────────────────────────┘
```

* **Frontend:** Vite v8, React 18, TypeScript, TailwindCSS, Lucide Icons, Glassmorphism UI, Responsive Mobile Design.
* **Backend:** FastAPI (Python 3.12), SQLAlchemy 2.0 Async ORM, SQLite + `aiosqlite`, Pydantic v2 validation.
* **Email Engine:** Dual-MIME multipart transactional email service with non-blocking worker threads via `asyncio.to_thread(_dispatch_smtp_sync)`.
* **Time Engine:** Standardized India Standard Time (IST, UTC+05:30) with real-time ticking clock on public interfaces.
* **Security:** PBKDF2/Salted SHA-256 password hashing, JWT Bearer tokens, Role-Based Access Control (`SUPER_ADMIN`, `OWNER`, `CANDIDATE`).

---

## 🎯 Key Platform Capabilities

### 1. Multi-Step Job Requirement Builder
* 12 distinct requirement categories (Technical Skills, Frameworks, Architecture, Cloud & Infrastructure, Education, Experience).
* Required vs. Preferred weighting with mathematical validation guaranteeing category weight sums equal exactly 100%.
* Automatic candidate ranking based on weighted similarity scores with explainable evidence badges:
  * 🟢 **Met** — Verified match in candidate dossier
  * 🟡 **Partially Met** — Found related competence
  * ⚪ **Unclear** — Flagged for recruiter interview inspection
  * 🔴 **Not Met** — Gap identified

### 2. Proctored AI Interview Room
* In-browser camera preview & real-time audio level monitoring.
* Adaptive AI Interviewer avatar asking contextual questions synthesized from the candidate's actual projects.
* Behavioral integrity detection: Window blur, tab switching, and fullscreen tracking with graceful network reconnection handling.
* Instant multidimensional rubric evaluation across 5 vectors: Technical Knowledge, Problem Solving, Role Competence, Project Depth, and Communication.

### 3. Stage-by-Stage Domain Communication Suite
Recruiters have permanent access to 4 distinct communication stages per candidate, dynamically customized to one of 5 engineering tracks:
* 🧠 **AI & Cognitive Systems Track**
* ☁️ **Cloud Infrastructure & DevOps Track**
* 🌐 **Full Stack & Distributed Systems Track**
* 🎨 **Frontend Architecture & UI/UX Track**
* 📊 **Data Analytics & Strategic Intelligence Track**

#### The 4 Recruitment Stages:
1. **Stage 1: AI Technical Assessment** — Tailored evaluation window, test parameters, and room link.
2. **Stage 2: Face-to-Face Interview Round** — Date, time in IST, Google Meet link, and domain technical deep-dive agenda.
3. **Stage 3: Extend Domain Job Offer** — Formal offer letter, Application ID, compensation details, and onboarding timeline.
4. **Stage 4: Cohort Evaluation Update** — Respectful update with all completed interview scores and transcripts 100% preserved.

### 4. Super Admin Governance & Support Desk
* Persistent two-way support desk connecting candidates with platform administrators.
* Immutable audit logs recording all job edits, status transitions, recruiter overrides, and email dispatches.
* Public CMS management for company news, milestones, and tech events.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sayanrooj/FUTUREVERSE.git
cd FUTUREVERSE
```

### 2. Backend Setup
```bash
# Create and activate Python virtual environment
python -m venv backend/venv
.\backend\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://127.0.0.1:5173`.

---

## 👨‍💻 Developer Attribution

Designed, engineered, and maintained by **Sayan Rooj**.  
For inquiries, collaborations, or enterprise deployments, visit:  
👉 **[https://github.com/sayanrooj](https://github.com/sayanrooj)**
