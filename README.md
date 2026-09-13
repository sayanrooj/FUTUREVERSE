# FUTUREVERSE — Complete AI-Powered Recruitment Platform
**Created & Developed by Sayan Rooj**
*FUTUREVERSE © 2026*

> Intelligent Recruitment. Better Talent. Future Ready.  
> An enterprise-grade AI-powered talent operating platform connecting organizations and candidates through explainable AI screening, dynamic criteria weighting, adaptive proctored interviews, and human-in-the-loop decisions.

---

## 🌟 Core Architectural Philosophy

FUTUREVERSE is architected on three foundational tenets:
1. **Admin / Recruiter defines WHAT matters:** The human team controls 12-section requirements, required vs. preferred criteria, knockout mandates, and strict 100% criteria weights.
2. **AI evaluates HOW WELL the candidate matches:** Modular AI services extract verified ground truth from CVs, calculate multidimensional scores, conduct adaptive interviews, and generate grounded natural language evidence (`Met 🟢`, `Not Met 🔴`, `Partially Met 🟡`, `Unclear ⚪`).
3. **Human Recruiter makes the FINAL decision:** Recruiter reviews interview transcripts, checks proctoring telemetry, schedules Face-to-Face interviews, and applies human discretion overrides with audited justifications.

---

## 🚀 Key Features & Capabilities

### 1. Three Strict RBAC Roles
- **Super Admin / Maker:** Highest governance level. Manages recruiter accounts, public CMS, platform analytics, system health telemetry, and tamper-evident audit logs.
- **Owner / Recruiter:** Dedicated `/owner-login` strictly **WITHOUT** public registration buttons. Features the 12-section Job Requirement Builder, 100% Criteria Weight Manager, candidate ranking & side-by-side comparison, deep candidate dossiers with evidence badges, private notes, and F2F scheduling.
- **Candidate:** Registration, private encrypted CV upload, interactive AI parsing confirmation, dynamic application pipeline tracking, skill-gap analysis, and the live proctored AI Interview Room.

### 2. Proctored Live AI Interview Room
- Candidate camera preview and real-time microphone telemetry
- Speaking AI interviewer avatar with audio prompts
- Dynamically generated questions tailored to the candidate's actual projects & CV
- Adaptive probing follow-up questions triggered by candidate answer depth
- Responsible integrity monitoring: window blur, tab switching, and fullscreen tracking with gentle warning banners
- Graceful technical reconnect handling clearly segregated from cheating flags
- Immediate multidimensional evaluation rubric (Technical, Problem Solving, Role Knowledge, Project Depth, Communication)

### 3. Preloaded Realistic Demo Positions
1. **Senior AI / Machine Learning Engineer:** Hybrid, 3 openings, Min Score: 70%, 100% weighted criteria
2. **Full Stack Software Engineer:** Hybrid, 2 openings, Min Score: 70%
3. **Data Analyst & BI Specialist:** Remote, 2 openings, Min Score: 65%
4. **Frontend UI/UX Engineer:** Remote, 2 openings, Min Score: 65%
5. **Software Engineering Intern:** On-site, 5 openings, Min Score: 60% (No prior work exp required)

---

## 🔑 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Preloaded Context |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@futureverse.ai` | `Admin@2026` | Master console, Owner management, CMS, Audit logs |
| **Owner / Recruiter** | `recruiter@futureverse.ai` | `Recruiter@2026` | Alex Morgan, 5 active jobs, candidate ranking |
| **Candidate (AI/ML)** | `aarav.sharma@example.com` | `Candidate@2026` | Aarav Sharma (92.4% match, interview completed, F2F scheduled) |
| **Candidate (Full Stack)** | `priya.patel@example.com` | `Candidate@2026` | Priya Patel (88.5% match, shortlisted) |
| **Candidate (Data)** | `rohan.verma@example.com` | `Candidate@2026` | Rohan Verma (82.0% match, review recommended) |
| **Candidate (Intern)** | `ananya.sen@example.com` | `Candidate@2026` | Ananya Sen (CS student, projects extracted) |

---

## 💻 Local Windows Quickstart

### Prerequisites
- Node.js 18+ (Tested on v24.14.1)
- Python 3.12+ (or Python 3.14 with standard venv)

### 1. Backend Setup & Startup
```powershell
cd C:\Users\sayan\.gemini\antigravity-ide\scratch\futureverse\backend

# Activate the dedicated Python 3.12 virtual environment:
.\venv\Scripts\activate

# (Optional: If rebuilding dependencies)
# pip install -r requirements.txt

# Run the backend dev server (auto-seeds database on startup):
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API Docs will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)*

### 2. Frontend Setup & Startup
```powershell
cd C:\Users\sayan\.gemini\antigravity-ide\scratch\futureverse\frontend

# Start Vite dev server:
npm.cmd run dev
```
*Frontend application will be live at: [http://localhost:5173](http://localhost:5173)*

---

## 🛡️ Responsible AI & Ethical Standards
- **Zero Protected Characteristic Inferences:** FUTUREVERSE strictly disallows facial emotion classification, accent discrimination, or demographic scoring.
- **Explainable Natural Language Citations:** Every score is supported by transparent evidence items pointing directly to candidate credentials.
- **Human Authority:** All hiring decisions, invitations, and contractual offers require explicit human recruiter authorization. Recruiter overrides are logged in the compliance audit trail.

---

## 👨‍💻 Developer Credit
**FUTUREVERSE** was designed, architected, and developed by **Sayan Rooj**.  
FUTUREVERSE © 2026. All rights reserved.
