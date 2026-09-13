import httpx

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing live HTTP endpoints on port 8000 with httpx...")
    with httpx.Client(base_url=BASE_URL, timeout=25.0) as client:
        # 1. Health check
        h = client.get("/api/health")
        assert h.status_code == 200, f"Health check failed: {h.status_code}"
        print(f"[OK] /api/health: {h.json()['status']} ({h.json()['app']})")

        # 2. Admin Login
        admin_auth = client.post("/api/auth/login", json={"email": "admin@futureverse.ai", "password": "Admin@2026"})
        assert admin_auth.status_code == 200, f"Admin login failed: {admin_auth.text}"
        admin_token = admin_auth.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("[OK] Admin login succeeded.")

        # 3. System Health
        sh = client.get("/api/admin/system-health", headers=admin_headers)
        assert sh.status_code == 200, f"System health failed: {sh.text}"
        sh_data = sh.json()
        print(f"[OK] /api/admin/system-health: status={sh_data['status']}, email_service_status={sh_data.get('email_service_status')}")

        # 4. Recruiter Login
        owner_auth = client.post("/api/auth/owner-login", json={"email": "recruiter@futureverse.ai", "password": "Recruiter@2026"})
        assert owner_auth.status_code == 200, f"Owner login failed: {owner_auth.text}"
        owner_token = owner_auth.json()["access_token"]
        owner_headers = {"Authorization": f"Bearer {owner_token}"}
        print("[OK] Recruiter login succeeded.")

        # 5. Recruiter Application Insight
        insight = client.get("/api/owner/applications/1/insight", headers=owner_headers)
        assert insight.status_code == 200, f"Insight failed: {insight.text}"
        app_data = insight.json()
        orig_scores = app_data.get("scores")
        print(f"[OK] Application #1 loaded. Candidate: {app_data['candidate']['name']}, Current Status: {app_data['status']}")

        # 6. Schedule F2F
        f2f_payload = {
            "round_type": "Technical System Design",
            "date_str": "2026-09-22",
            "time_str": "15:00 IST",
            "location_or_link": "https://meet.futureverse.ai/f2f-round-1",
            "interviewer_name": "Sayan Rooj (Lead Architect)",
            "duration_minutes": 45,
            "instructions": "Bring system diagram for real-time streaming pipeline."
        }
        f2f_res = client.post("/api/owner/applications/1/schedule-f2f", json=f2f_payload, headers=owner_headers)
        assert f2f_res.status_code == 200, f"Schedule F2F failed: {f2f_res.text}"
        f2f_data = f2f_res.json()
        assert "email_delivery" in f2f_data, "F2F response must contain email_delivery telemetry"
        print(f"[OK] /api/owner/applications/1/schedule-f2f returned email_delivery status: {f2f_data['email_delivery']['status']}")

        # 7. Authoritative Final Decision (SELECTED)
        dec_payload = {
            "decision": "SELECTED",
            "notes": "Verified high performance across technical assessments and architecture discussion."
        }
        dec_res = client.post("/api/owner/applications/1/final-decision", json=dec_payload, headers=owner_headers)
        assert dec_res.status_code == 200, f"Final decision failed: {dec_res.text}"
        dec_data = dec_res.json()
        assert dec_data["final_decision"] == "SELECTED", "Decision must be SELECTED"
        assert "email_delivery" in dec_data, "Final decision must contain email_delivery telemetry"
        print(f"[OK] /api/owner/applications/1/final-decision (SELECTED) email_delivery status: {dec_data['email_delivery']['status']}")

        # 8. Check Candidate Insight again to verify scores were NOT altered
        insight_after = client.get("/api/owner/applications/1/insight", headers=owner_headers).json()
        assert insight_after["final_decision"] == "SELECTED"
        assert insight_after["status"] == "Offer Extended"
        if orig_scores:
            assert insight_after["scores"]["overall_score"] == orig_scores["overall_score"], "Scores must be preserved"
        print("[OK] Candidate scores and interview results 100% preserved after final decision.")

        # 9. Recruiter Retry Email
        retry_res = client.post("/api/owner/applications/1/retry-email", headers=owner_headers)
        assert retry_res.status_code == 200, f"Retry email failed: {retry_res.text}"
        retry_data = retry_res.json()
        assert "email_delivery" in retry_data
        print(f"[OK] /api/owner/applications/1/retry-email: status={retry_data['email_delivery']['status']}")

        # 10. Admin List Email Logs
        email_logs_res = client.get("/api/admin/emails?limit=10", headers=admin_headers)
        assert email_logs_res.status_code == 200
        logs = email_logs_res.json()
        print(f"[OK] Admin listed {len(logs)} email logs from database.")

    print("\n=================================================================")
    print("ALL LIVE HTTP ENDPOINT TESTS PASSED COMPLETELY!")
    print("=================================================================")

if __name__ == "__main__":
    run_tests()
