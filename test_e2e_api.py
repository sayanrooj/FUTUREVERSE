import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def post(url, data=None, token=None):
    req = urllib.request.Request(
        f"{BASE_URL}{url}",
        data=json.dumps(data).encode("utf-8") if data else None,
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {})
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get(url, token=None):
    req = urllib.request.Request(
        f"{BASE_URL}{url}",
        headers={
            **({"Authorization": f"Bearer {token}"} if token else {})
        },
        method="GET"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def test_full_pipeline():
    print("--------------------------------------------------")
    print("E2E PIPELINE HTTP API VERIFICATION")
    print("--------------------------------------------------")

    # 1. Recruiter Login
    login_res = post("/api/auth/login", {"email": "recruiter@futureverse.ai", "password": "Recruiter@2026"})
    recruiter_token = login_res["access_token"]
    print("[1] Recruiter logged in successfully.")

    # 2. Query Recruiter Dashboard -> Check Jobs
    dash = get("/api/owner/dashboard", recruiter_token)
    jobs = dash.get("jobs", [])
    recent_jobs = dash.get("recent_jobs", [])
    print(f"[2] Dashboard returned {len(jobs)} jobs in 'jobs' and {len(recent_jobs)} in 'recent_jobs'.")
    assert len(jobs) > 0, "Jobs must be present"
    assert any("CSE (AI) Engineer" in j["title"] for j in jobs), "CSE (AI) Engineer must be visible in jobs"
    print(f"[2] First job in dashboard: '{jobs[0]['title']}' (ID: {jobs[0]['id']})")

    # 3. Candidate Login
    cand_login = post("/api/auth/login", {"email": "aarav.sharma@example.com", "password": "Candidate@2026"})
    cand_token = cand_login["access_token"]
    print("[3] Candidate logged in successfully.")

    # 4. Candidate Support Tickets
    cand_tickets = get("/api/candidate/support/tickets", cand_token)
    print(f"[4] Candidate has {len(cand_tickets)} support tickets.")

    # 5. Super Admin Login
    admin_login = post("/api/auth/login", {"email": "admin@futureverse.ai", "password": "Admin@2026"})
    admin_token = admin_login["access_token"]
    print("[5] Super Admin logged in successfully.")

    # 6. Admin Support Tickets
    admin_tickets = get("/api/admin/support-tickets", admin_token)
    print(f"[6] Super Admin retrieved {len(admin_tickets)} tickets from support queue.")
    if admin_tickets:
        ticket_id = admin_tickets[0]["id"]
        detail = get(f"/api/admin/support-tickets/{ticket_id}", admin_token)
        print(f"[6] Fetched details for Ticket #{detail['id']} without changing selection.")

    # 7. Applications Decision & Retry Email Test
    cand_apps = get("/api/candidate/applications", cand_token)
    if cand_apps:
        test_app = cand_apps[0]
        app_id = test_app["id"]
        print(f"[7] Testing retry email endpoint for Application #{app_id}...")
        retry_res = post(f"/api/owner/applications/{app_id}/retry-email", None, recruiter_token)
        print(f"[7] Retry response: status={retry_res['email_delivery']['status']}, error={retry_res['email_delivery']['error']}")
        assert retry_res["email_delivery"]["status"] in ("SENT", "FAILED"), "Status must be valid delivery state"

    print("--------------------------------------------------")
    print("E2E PIPELINE HTTP API VERIFICATION PASSED 100%!")
    print("--------------------------------------------------")

if __name__ == "__main__":
    test_full_pipeline()
