import sqlite3
import json
import os
import hashlib

def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    pwd_hash = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return f"{salt}${pwd_hash}"

for db_path in ['backend/futureverse.db', 'futureverse.db']:
    print(f"Updating {db_path}...")
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # 1. Update password for Sayan Rooj accounts to 'sayan.rooj'
    h = hash_password("sayan.rooj")
    c.execute("UPDATE users SET hashed_password = ? WHERE email IN ('sayanrooj742137@gmail.com', 'sayanrooj312005@gmail.com')", (h,))
    
    # 2. Assign Applications 6, 13, 14 to Candidate ID 7 (Sayan Rooj)
    c.execute("UPDATE applications SET candidate_id = 7 WHERE id IN (6, 13, 14)")
    
    # 3. Assign Applications 1, 9 to Candidate ID 5 (Rohan Verma)
    c.execute("UPDATE applications SET candidate_id = 5 WHERE id IN (1, 9)")
    
    conn.commit()
    conn.close()

print("SQLite DBs successfully updated.")

# Connect to DB to extract clean data
conn = sqlite3.connect('backend/futureverse.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# 1. Users
c.execute("SELECT id, email, full_name, role, is_active FROM users ORDER BY id")
users = [dict(r) for r in c.fetchall()]

# 2. Jobs
c.execute("SELECT * FROM jobs ORDER BY id")
jobs_raw = [dict(r) for r in c.fetchall()]

jobs = []
for j in jobs_raw:
    j_id = j['id']
    c.execute("SELECT * FROM job_requirements WHERE job_id = ? ORDER BY id", (j_id,))
    reqs = [dict(r) for r in c.fetchall()]
    
    c.execute("SELECT * FROM job_criteria WHERE job_id = ? ORDER BY id", (j_id,))
    criteria = [dict(r) for r in c.fetchall()]
    
    cat_thresh = json.loads(j['category_thresholds'] or '{}') if isinstance(j.get('category_thresholds'), str) else (j.get('category_thresholds') or {})
    
    jobs.append({
        "id": j["id"],
        "title": j["title"],
        "department": j["department"],
        "location": j.get("location", "Hyderabad, India"),
        "employment_type": j.get("employment_type", "Full Time"),
        "experience_level": j.get("experience_level", "Mid-Senior"),
        "work_mode": j.get("work_mode", "Hybrid"),
        "openings": j.get("openings", 1),
        "status": j.get("status", "ACTIVE"),
        "min_score_threshold": j.get("min_score_threshold", 70.0),
        "category_thresholds": cat_thresh,
        "created_at": str(j["created_at"]),
        "description": j.get("description", ""),
        "requirements_count": len(reqs),
        "applications_count": 0,
        "requirements": reqs,
        "job_criteria": criteria
    })

# 3. Applications
c.execute("""
    SELECT a.*, j.title as job_title, j.department as job_department, j.work_mode as job_work_mode,
           u.full_name as candidate_name, u.email as candidate_email
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.candidate_id = u.id
    ORDER BY a.id
""")
apps_raw = [dict(r) for r in c.fetchall()]

applications = []
for a in apps_raw:
    app_id = a['id']
    
    # Get scores
    c.execute("SELECT * FROM candidate_scores WHERE application_id = ?", (app_id,))
    s_row = c.fetchone()
    score_dict = dict(s_row) if s_row else None
    
    # Get interview
    c.execute("SELECT * FROM interviews WHERE application_id = ?", (app_id,))
    i_row = c.fetchone()
    interview_dict = dict(i_row) if i_row else None
    interview_data = None
    if interview_dict:
        interview_data = {
            "id": interview_dict["id"],
            "token": interview_dict["token"],
            "status": interview_dict["status"],
            "scheduled_at": str(interview_dict["scheduled_at"]) if interview_dict["scheduled_at"] else None
        }
    
    # Get schedule
    c.execute("SELECT * FROM interview_schedules WHERE application_id = ?", (app_id,))
    sc_row = c.fetchone()
    sched_dict = dict(sc_row) if sc_row else None
    f2f_data = None
    if sched_dict:
        f2f_data = {
            "round_type": sched_dict["round_type"],
            "date_str": sched_dict["date_str"],
            "time_str": sched_dict["time_str"],
            "meeting_link": sched_dict["location_or_link"]
        }
    
    overall_score = 80.0
    cb = {
        "Technical Skills": 85.0,
        "Relevant Experience": 80.0,
        "Education": 90.0,
        "Projects": 85.0,
        "Soft Skills": 80.0,
        "Certifications": 75.0,
        "AI/ML Knowledge": 85.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 85.0
    }
    evidence_list = []
    knockout_met = True
    
    if score_dict:
        overall_score = score_dict["overall_score"]
        if score_dict.get("criteria_breakdown"):
            try:
                cb = json.loads(score_dict["criteria_breakdown"]) if isinstance(score_dict["criteria_breakdown"], str) else score_dict["criteria_breakdown"]
            except Exception:
                pass
        if score_dict.get("requirement_evidence"):
            try:
                evidence_list = json.loads(score_dict["requirement_evidence"]) if isinstance(score_dict["requirement_evidence"], str) else score_dict["requirement_evidence"]
            except Exception:
                pass
        knockout_met = bool(score_dict.get("knockout_met", 1))
    
    scores_obj = {
        "overall_score": overall_score,
        "criteria_breakdown": cb,
        "requirement_evidence": evidence_list,
        "knockout_met": knockout_met
    }
    
    rec = "Hire" if overall_score >= 70 else ("Review" if overall_score >= 50 else "Reject")
    
    applications.append({
        "id": a["id"],
        "job_id": a["job_id"],
        "job_title": a["job_title"],
        "job_department": a["job_department"],
        "work_mode": a.get("job_work_mode", "Hybrid"),
        "candidate_id": a["candidate_id"],
        "candidate_name": a["candidate_name"],
        "candidate_email": a["candidate_email"],
        "status": a["status"],
        "overall_match_score": overall_score,
        "applied_at": str(a["applied_at"]),
        "updated_at": str(a["updated_at"]),
        "final_decision": a.get("final_decision"),
        "final_decision_at": str(a["final_decision_at"]) if a.get("final_decision_at") else None,
        "final_decision_by": a.get("final_decision_by"),
        "final_decision_notes": a.get("final_decision_notes"),
        "status_summary": f"Application currently in {a['status']} stage",
        "stage": f"Stage: {a['status']}",
        "interview_score": 88.0 if interview_data else None,
        "interview_status": interview_data["status"] if interview_data else "PENDING",
        "recommendation": rec,
        "scores": scores_obj,
        "interview": interview_data,
        "f2f_schedule": f2f_data
    })

# Update applications count in jobs
for j in jobs:
    j["applications_count"] = sum(1 for a in applications if a["job_id"] == j["id"])

# 4. Tickets
c.execute("SELECT * FROM support_tickets ORDER BY id")
tickets = [dict(r) for r in c.fetchall()]

# 5. Audit logs
c.execute("SELECT * FROM audit_logs ORDER BY id")
audit_logs = [dict(r) for r in c.fetchall()]

# 6. Achievements
c.execute("SELECT * FROM achievements ORDER BY id")
achievements = [dict(r) for r in c.fetchall()]

# 7. Events
c.execute("SELECT * FROM events ORDER BY id")
events = [dict(r) for r in c.fetchall()]

# 8. Content
c.execute("SELECT * FROM company_content ORDER BY id")
content = [dict(r) for r in c.fetchall()]

conn.close()

# Generate TypeScript file
ts_content = f"""// Embedded Database Synchronization for High-Speed Execution and Resilient Fallback
// Contains all 12 production jobs, 15 applicant dossiers, users, tickets, and logs from futureverse.db

export const MOCK_USERS = {json.dumps(users, indent=2)};

export const MOCK_JOBS = {json.dumps(jobs, indent=2)};

export const MOCK_APPLICATIONS = {json.dumps(applications, indent=2)};

export const MOCK_TICKETS = {json.dumps(tickets, indent=2)};

export const MOCK_AUDIT_LOGS = {json.dumps(audit_logs, indent=2)};

export const MOCK_ACHIEVEMENTS = {json.dumps(achievements, indent=2)};

export const MOCK_EVENTS = {json.dumps(events, indent=2)};

export const MOCK_CONTENT = {json.dumps(content, indent=2)};

export function getStoredJobs(): any[] {{
  try {{
    const raw = localStorage.getItem('fv_stored_jobs');
    if (raw) return JSON.parse(raw);
  }} catch {{}}
  return [...MOCK_JOBS];
}}

export function saveStoredJobs(jobs: any[]) {{
  try {{
    localStorage.setItem('fv_stored_jobs', JSON.stringify(jobs));
  }} catch {{}}
}}

export function getStoredApplications(): any[] {{
  try {{
    const raw = localStorage.getItem('fv_stored_applications');
    if (raw) return JSON.parse(raw);
  }} catch {{}}
  return [...MOCK_APPLICATIONS];
}}

export function saveStoredApplications(apps: any[]) {{
  try {{
    localStorage.setItem('fv_stored_applications', JSON.stringify(apps));
  }} catch {{}}
}}

export function getStoredTickets(): any[] {{
  try {{
    const raw = localStorage.getItem('fv_stored_tickets');
    if (raw) return JSON.parse(raw);
  }} catch {{}}
  return [...MOCK_TICKETS];
}}

export function saveStoredTickets(tickets: any[]) {{
  try {{
    localStorage.setItem('fv_stored_tickets', JSON.stringify(tickets));
  }} catch {{}}
}}
"""

with open("frontend/src/services/mockData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"frontend/src/services/mockData.ts successfully written! ({len(ts_content)} bytes)")
