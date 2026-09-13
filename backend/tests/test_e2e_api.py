"""
FUTUREVERSE - Complete End-to-End API Integration Verification
Created & Developed by Sayan Rooj
"""
import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode('utf-8') if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode('utf-8')
        try:
            return e.code, json.loads(content)
        except Exception:
            return e.code, {"error": content}

def run_tests():
    passed = 0
    total = 0

    def assert_eq(test_name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {test_name}")
        else:
            print(f"  [FAIL] {test_name} - {details}")

    print("\n--- TEST SUITE 1: Health & Public Content ---")
    status, data = request("GET", "/api/health")
    assert_eq("Health Check Status & Attribution", status == 200 and data.get("creator") == "Sayan Rooj", f"Status {status}, data: {data}")

    status, content = request("GET", "/api/public/content")
    assert_eq("Public CMS Content", status == 200 and "hero" in content, f"Content keys: {list(content.keys()) if isinstance(content, dict) else content}")

    status, achievements = request("GET", "/api/public/achievements")
    assert_eq("Public Achievements", status == 200 and len(achievements) >= 1, f"Achievements: {achievements}")

    status, events = request("GET", "/api/public/events")
    assert_eq("Public Events", status == 200 and len(events) >= 1, f"Events: {events}")

    status, contact_res = request("POST", "/api/public/contact", body={
        "name": "Dr. Ramesh Patel",
        "email": "ramesh.patel@institution.edu",
        "phone": "+91 9876543210",
        "message": "Interested in institutional AI recruitment licensing"
    })
    assert_eq("Public Contact Inquiry Form", status == 200 and "team will connect" in contact_res.get("message", ""), f"Response: {contact_res}")

    print("\n--- TEST SUITE 2: Authentication & RBAC ---")
    # Candidate login
    status, cand_auth = request("POST", "/api/auth/login", {
        "email": "aarav.sharma@example.com",
        "password": "Candidate@2026"
    })
    cand_token = cand_auth.get("access_token")
    assert_eq("Candidate Login", status == 200 and cand_token is not None, f"Status: {status}")

    # Owner dedicated login
    status, owner_auth = request("POST", "/api/auth/owner-login", {
        "email": "recruiter@futureverse.ai",
        "password": "Recruiter@2026"
    })
    owner_token = owner_auth.get("access_token")
    assert_eq("Owner Dedicated Login (/auth/owner-login)", status == 200 and owner_token is not None, f"Status: {status}")

    # Super Admin dedicated login
    status, admin_auth = request("POST", "/api/auth/admin-login", {
        "email": "admin@futureverse.ai",
        "password": "Admin@2026"
    })
    admin_token = admin_auth.get("access_token")
    assert_eq("Super Admin Dedicated Login (/auth/admin-login)", status == 200 and admin_token is not None, f"Status: {status}")

    # Invalid login rejection
    status, _ = request("POST", "/api/auth/login", {
        "email": "fake@futureverse.ai",
        "password": "WrongPassword"
    })
    assert_eq("Invalid Auth Rejection (401)", status == 401, f"Expected 401, got {status}")

    print("\n--- TEST SUITE 3: Candidate Portal & Applications ---")
    status, profile = request("GET", "/api/candidate/profile", token=cand_token)
    assert_eq("Candidate Profile Access", status == 200 and profile.get("email") == "aarav.sharma@example.com", f"Profile: {profile}")

    status, apps = request("GET", "/api/candidate/applications", token=cand_token)
    assert_eq("Candidate Applications List", status == 200 and len(apps) >= 1, f"Apps: {apps}")

    status, notifs = request("GET", "/api/candidate/notifications", token=cand_token)
    assert_eq("Candidate In-App Notifications", status == 200 and isinstance(notifs, list), f"Notifs: {notifs}")

    print("\n--- TEST SUITE 4: Jobs & Strict 100% Criteria Rule ---")
    status, jobs_list = request("GET", "/api/jobs")
    assert_eq("Active Jobs Directory", status == 200 and len(jobs_list) >= 5, f"Jobs count: {len(jobs_list) if isinstance(jobs_list, list) else jobs_list}")

    status, job_templates = request("GET", "/api/jobs/templates/list")
    assert_eq("Criteria Templates Library", status == 200 and len(job_templates) >= 1, f"Templates: {job_templates}")

    # Strict Criteria 100% validation check: Fails when sum != 100%
    invalid_criteria_job = {
        "title": "Cloud Infrastructure Lead (Invalid Weights Test)",
        "department": "Infrastructure",
        "category": "Engineering",
        "description": "Leading cloud infrastructure",
        "responsibilities": "Manage AWS, Scale Kubernetes clusters, oversee deployment pipelines",
        "employment_type": "Full-Time",
        "work_mode": "Remote",
        "location": "Bengaluru / Remote",
        "salary_range": "₹28L - ₹40L",
        "openings": 2,
        "min_score_threshold": 70.0,
        "requirements": [
            {
                "type": "hard_skill",
                "name": "Kubernetes & Terraform",
                "level": "Expert",
                "is_required": True,
                "weight": 35.0,
                "is_knockout": True
            }
        ],
        "criteria": [
            {"category_name": "Technical Hard Skills", "weight_percentage": 40.0},
            {"category_name": "Cloud Architecture", "weight_percentage": 40.0}
            # Sum is 80% != 100% -> MUST BE REJECTED
        ]
    }
    status, err_resp = request("POST", "/api/jobs", body=invalid_criteria_job, token=owner_token)
    assert_eq("Strict Criteria 100% Rule Rejection (Sum != 100%)", (status in (400, 422)) and "100" in str(err_resp), f"Expected validation failure on criteria sum, got {status}: {err_resp}")

    # Valid criteria job creation: Sum == 100.0%
    valid_criteria_job = dict(invalid_criteria_job)
    valid_criteria_job["title"] = "Senior DevOps Architect (100% Criteria Verified)"
    valid_criteria_job["criteria"] = [
        {"category_name": "Technical Hard Skills", "weight_percentage": 40.0},
        {"category_name": "Cloud Architecture", "weight_percentage": 40.0},
        {"category_name": "Leadership & Communication", "weight_percentage": 20.0}
    ] # Exactly 100.0%
    status, created_job = request("POST", "/api/jobs", body=valid_criteria_job, token=owner_token)
    assert_eq("Job Created Successfully With 100% Weight Sum", status == 200 and "id" in created_job, f"Status: {status}, job: {created_job}")

    print("\n--- TEST SUITE 5: Owner / Recruiter Pipeline & Deep Insights ---")
    status, dashboard_metrics = request("GET", "/api/owner/dashboard", token=owner_token)
    assert_eq("Recruiter Funnel & Pipeline Dashboard", status == 200 and "metrics" in dashboard_metrics, f"Dashboard: {dashboard_metrics}")

    status, ranked_candidates = request("GET", "/api/owner/jobs/1/candidates", token=owner_token)
    assert_eq("AI Ranked Candidates on Job #1", status == 200 and len(ranked_candidates) >= 1, f"Candidates: {ranked_candidates}")

    # Deep candidate insight dossier (evidence badges, transcript, integrity)
    status, insight_dossier = request("GET", "/api/owner/applications/1/insight", token=owner_token)
    assert_eq("Deep Candidate Insight Dossier (Evidence & Badges)", status == 200 and "scores" in insight_dossier and "interview" in insight_dossier, f"Insight: {insight_dossier}")

    # Side-by-side comparison of candidates 1 and 2
    status, compare_res = request("POST", "/api/owner/applications/compare", body={"application_ids": [1, 2]}, token=owner_token)
    assert_eq("Side-by-Side Candidate Comparison Matrix", status == 200 and len(compare_res.get("comparison", [])) == 2, f"Comparison: {compare_res}")

    print("\n--- TEST SUITE 6: Proctored AI Interview & Telemetry ---")
    status, session = request("GET", "/api/interview/session/demo-aarav-interview-token-2026")
    assert_eq("Interview Session by Secure Token", status == 200 and "questions" in session, f"Session: {session}")

    # Log integrity event (Tab switch / face focus lost)
    status, int_resp = request("POST", "/api/interview/session/demo-aarav-interview-token-2026/integrity-event", body={
        "event_type": "TAB_SWITCH",
        "severity": "MEDIUM",
        "evidence": "Candidate blurred proctored interview tab for 4.2 seconds"
    })
    assert_eq("Proctoring Integrity Event Logged", status == 200 and "action" in int_resp, f"Integrity resp: {int_resp}")

    # Verify interview result access
    status, interview_res = request("GET", "/api/interview/session/demo-aarav-interview-token-2026/result")
    assert_eq("Comprehensive AI Interview Evaluation & Skill Gaps", status == 200 and "technical_score" in interview_res, f"Result: {interview_res}")

    print("\n--- TEST SUITE 7: Super Admin Governance & Health ---")
    status, owners_list = request("GET", "/api/admin/owners", token=admin_token)
    assert_eq("Super Admin Provisioned Owners Directory", status == 200 and len(owners_list) >= 1, f"Owners: {owners_list}")

    status, audit_logs = request("GET", "/api/admin/audit-logs?limit=10", token=admin_token)
    assert_eq("Super Admin Real-Time Audit Logs", status == 200 and len(audit_logs) >= 1, f"Audit logs: {audit_logs}")

    status, health = request("GET", "/api/admin/system-health", token=admin_token)
    assert_eq("Super Admin System Health Telemetry", status == 200 and health.get("database_status") == "CONNECTED", f"Health: {health}")

    status, support_tickets = request("GET", "/api/admin/support-tickets", token=admin_token)
    assert_eq("Super Admin Support Tickets Desk", status == 200 and isinstance(support_tickets, list), f"Tickets: {support_tickets}")

    print(f"\n==================================================")
    print(f"E2E Integration Verification Summary: {passed}/{total} Passed")
    print(f"==================================================\n")
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
