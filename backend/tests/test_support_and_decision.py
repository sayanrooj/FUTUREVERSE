"""
FUTUREVERSE - Two-Way Support & Final Decision Engine Automated Verification
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

    print("\n--- LOGIN AUTHORIZATION TOKENS ---")
    _, cand_auth = request("POST", "/api/auth/login", {"email": "aarav.sharma@example.com", "password": "Candidate@2026"})
    cand_token = cand_auth.get("access_token")
    assert_eq("Candidate Token Acquired", cand_token is not None)

    _, owner_auth = request("POST", "/api/auth/owner-login", {"email": "recruiter@futureverse.ai", "password": "Recruiter@2026"})
    owner_token = owner_auth.get("access_token")
    assert_eq("Owner Token Acquired", owner_token is not None)

    _, admin_auth = request("POST", "/api/auth/admin-login", {"email": "admin@futureverse.ai", "password": "Admin@2026"})
    admin_token = admin_auth.get("access_token")
    assert_eq("Admin Token Acquired", admin_token is not None)

    print("\n--- TEST SUITE 1: TWO-WAY SUPPORT SYSTEM ---")
    # 1. Candidate creates ticket
    status, new_ticket = request("POST", "/api/candidate/support/tickets", body={
        "subject": "Interview Rescheduling Request",
        "category": "Technical Assessment",
        "priority": "HIGH",
        "message": "Hello support team, I would like to reschedule my proctored interview round by 2 days."
    }, token=cand_token)
    ticket_id = new_ticket.get("id")
    assert_eq("Candidate Creates Support Ticket", status == 200 and ticket_id is not None, f"Status {status}: {new_ticket}")

    # 2. Super Admin views support tickets queue
    status, admin_tickets = request("GET", "/api/admin/support-tickets", token=admin_token)
    found_ticket = next((t for t in admin_tickets if t.get("id") == ticket_id), None)
    assert_eq("Admin Sees New Ticket in Queue", status == 200 and found_ticket is not None, f"Queue: {admin_tickets[:2]}")

    # 3. Super Admin sends response
    admin_reply_text = "Hello Aarav, your reschedule has been approved. Your token has been extended by 48 hours."
    status, reply_resp = request("POST", f"/api/admin/support-tickets/{ticket_id}/reply", body={
        "message": admin_reply_text,
        "status": "In Progress"
    }, token=admin_token)
    assert_eq("Admin Replies to Ticket", status == 200 and "notified" in reply_resp.get("message", ""), f"Status {status}: {reply_resp}")

    # 4. Candidate reads conversation thread
    status, thread = request("GET", f"/api/candidate/support/tickets/{ticket_id}", token=cand_token)
    msgs = thread.get("messages", [])
    has_admin_reply = any(m.get("message") == admin_reply_text for m in msgs)
    assert_eq("Candidate Receives Admin Reply in Thread", status == 200 and has_admin_reply, f"Messages count: {len(msgs)}")

    # 5. Candidate sends follow-up response
    candidate_followup = "Thank you so much! I will take the test on Wednesday morning."
    status, cand_msg_resp = request("POST", f"/api/candidate/support/tickets/{ticket_id}/messages", body={
        "message": candidate_followup
    }, token=cand_token)
    assert_eq("Candidate Sends Follow-Up Reply", status == 200 and cand_msg_resp.get("id") is not None, f"Status {status}: {cand_msg_resp}")

    # 6. Admin verifies full multi-turn conversation
    status, admin_thread = request("GET", f"/api/admin/support-tickets/{ticket_id}", token=admin_token)
    admin_msgs = admin_thread.get("messages", [])
    has_cand_followup = any(m.get("message") == candidate_followup for m in admin_msgs)
    assert_eq("Admin Sees Complete Multi-Turn Conversation", status == 200 and has_cand_followup and len(admin_msgs) >= 3, f"Messages: {len(admin_msgs)}")

    print("\n--- TEST SUITE 2: AUTHORITATIVE FINAL DECISION VS INTERVIEW RESULT ---")
    # Fetch Candidate #1 applications
    status, apps = request("GET", "/api/candidate/applications", token=cand_token)
    app = apps[0]
    app_id = app["id"]
    assert_eq("Application Exists", status == 200 and app_id is not None)

    # Initial state check: Interview is completed/passed
    interview_score = app.get("interview", {}).get("status")
    print(f"  [Info] Application #{app_id} initial interview status: {interview_score}")

    # Recruiter marks NOT_SELECTED
    status, dec_resp = request("POST", f"/api/owner/applications/{app_id}/final-decision", body={
        "decision": "NOT_SELECTED",
        "notes": "Candidate had stellar interview scores, but this specific opening was filled by an internal transfer."
    }, token=owner_token)
    assert_eq("Recruiter Issues NOT_SELECTED Decision", status == 200 and dec_resp.get("final_decision") == "NOT_SELECTED", f"Status {status}: {dec_resp}")

    # Candidate fetches applications again: Must authoritatively see NOT SELECTED, while keeping interview scores!
    status, updated_apps = request("GET", "/api/candidate/applications", token=cand_token)
    cand_app = next(a for a in updated_apps if a["id"] == app_id)
    summary = cand_app.get("status_summary", {})

    assert_eq(
        "Candidate Status Strictly Shows NOT SELECTED (Bug Fixed)",
        summary.get("candidate_facing_status") == "NOT SELECTED",
        f"Candidate facing status: {summary.get('candidate_facing_status')}"
    )

    assert_eq(
        "Interview Results and Scores Kept 100% Intact",
        summary.get("interview_breakdown", {}).get("is_completed") is True,
        f"Interview breakdown: {summary.get('interview_breakdown')}"
    )

    print("\n--- TEST SUITE 3: EMAIL AUDITING & LOGS ---")
    status, email_logs = request("GET", "/api/admin/emails?limit=10", token=admin_token)
    assert_eq("Outbound Email Logs Populated", status == 200 and len(email_logs) >= 2, f"Logs count: {len(email_logs)}")

    has_decision_email = any(e.get("email_type") == "FINAL_DECISION_NOT_SELECTED" for e in email_logs)
    assert_eq("Final Rejection Email Logged in DB", has_decision_email)

    has_support_email = any("SUPPORT" in e.get("email_type", "") for e in email_logs)
    assert_eq("Support Email Logged in DB", has_support_email)

    print(f"\n==================================================")
    print(f"Support & Decision Engine Verification: {passed}/{total} Passed")
    print(f"==================================================\n")
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
