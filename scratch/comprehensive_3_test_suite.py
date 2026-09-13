import urllib.request
import json
import time
import sys

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:8000/api"

def run_request(endpoint, method="GET", body=None, token=None):
    start = time.time()
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    with urllib.request.urlopen(req, timeout=5) as resp:
        elapsed = time.time() - start
        res_data = json.loads(resp.read().decode("utf-8"))
        return elapsed, resp.status, res_data

def test_cycle(cycle_num):
    print(f"\n=======================================================")
    print(f"   STARTING VERIFICATION TEST CYCLE {cycle_num} / 3")
    print(f"=======================================================")
    errors = []

    # ---------------------------------------------------------
    # PASS A: Candidate Workflow
    # ---------------------------------------------------------
    print(f"[Cycle {cycle_num} - Test 1.1] Candidate Login (sayanrooj742137@gmail.com)...")
    elapsed, status, data = run_request("/auth/login", method="POST", body={
        "email": "sayanrooj742137@gmail.com",
        "password": "Candidate@2026"
    })
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Role: {data.get('role')}")
    if elapsed > 1.5:
        errors.append(f"Cycle {cycle_num} Test 1.1: Login too slow ({elapsed:.2f}s)")
    if data.get("role") != "CANDIDATE" or not data.get("access_token"):
        errors.append(f"Cycle {cycle_num} Test 1.1: Token or role mismatch")
    cand_token = data.get("access_token")

    print(f"[Cycle {cycle_num} - Test 1.2] Fetch Candidate Applications...")
    elapsed, status, apps = run_request("/candidate/applications", token=cand_token)
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Applications count: {len(apps)}")
    
    print(f"[Cycle {cycle_num} - Test 1.3] Fetch All Jobs (Careers)...")
    elapsed, status, jobs = run_request("/jobs")
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Total jobs available: {len(jobs)}")
    if len(jobs) < 12:
        errors.append(f"Cycle {cycle_num} Test 1.3: Expected at least 12 jobs, got {len(jobs)}")
    
    # Verify critical jobs exist
    job_titles = [j.get("title", "") for j in jobs]
    for expected in ["CSE (AI) Engineer", "new in company", "new requirment"]:
        found = any(expected.lower() in t.lower() for t in job_titles)
        print(f"  -> Verifying '{expected}': {'FOUND' if found else 'MISSING'}")
        if not found:
            errors.append(f"Cycle {cycle_num} Test 1.3: Job '{expected}' missing from database")

    # ---------------------------------------------------------
    # PASS B: Recruiter / Owner Workflow
    # ---------------------------------------------------------
    print(f"\n[Cycle {cycle_num} - Test 2.1] Recruiter Login (recruiter@futureverse.ai)...")
    elapsed, status, data = run_request("/auth/owner-login", method="POST", body={
        "email": "recruiter@futureverse.ai",
        "password": "Recruiter@2026"
    })
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Role: {data.get('role')}")
    if elapsed > 1.5:
        errors.append(f"Cycle {cycle_num} Test 2.1: Recruiter login too slow ({elapsed:.2f}s)")
    if data.get("role") != "OWNER":
        errors.append(f"Cycle {cycle_num} Test 2.1: Expected OWNER role, got {data.get('role')}")
    owner_token = data.get("access_token")

    print(f"[Cycle {cycle_num} - Test 2.2] Recruiter Dashboard Analytics...")
    elapsed, status, dash = run_request("/owner/dashboard", token=owner_token)
    metrics = dash.get("metrics", {})
    total_apps = metrics.get('total_applications', metrics.get('total_candidates', 0))
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Total Jobs: {metrics.get('total_jobs')} | Total Applications: {total_apps}")
    if metrics.get("total_jobs", 0) < 12:
        errors.append(f"Cycle {cycle_num} Test 2.2: Expected >=12 jobs in dashboard metrics")

    print(f"[Cycle {cycle_num} - Test 2.3] Candidate Insight & Explainable Evidence (App #13)...")
    elapsed, status, insight = run_request("/owner/applications/13/insight", token=owner_token)
    scores = insight.get("scores") or insight
    score_val = scores.get("overall_score")
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Overall Score: {score_val}%")
    if not scores.get("criteria_breakdown"):
        errors.append(f"Cycle {cycle_num} Test 2.3: Criteria breakdown missing")

    # ---------------------------------------------------------
    # PASS C: Super Admin Workflow
    # ---------------------------------------------------------
    print(f"\n[Cycle {cycle_num} - Test 3.1] Super Admin Login (admin@futureverse.ai)...")
    elapsed, status, data = run_request("/auth/admin-login", method="POST", body={
        "email": "admin@futureverse.ai",
        "password": "Admin@2026"
    })
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Role: {data.get('role')}")
    if elapsed > 1.5:
        errors.append(f"Cycle {cycle_num} Test 3.1: Admin login too slow ({elapsed:.2f}s)")
    if data.get("role") != "SUPER_ADMIN":
        errors.append(f"Cycle {cycle_num} Test 3.1: Expected SUPER_ADMIN role")
    admin_token = data.get("access_token")

    print(f"[Cycle {cycle_num} - Test 3.2] Admin Audit Logs Inspection...")
    elapsed, status, logs = run_request("/admin/audit-logs?limit=10", token=admin_token)
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Retrieved {len(logs)} audit entries")
    if len(logs) == 0:
        errors.append(f"Cycle {cycle_num} Test 3.2: No audit logs returned")

    print(f"[Cycle {cycle_num} - Test 3.3] Platform System Health Check...")
    elapsed, status, health = run_request("/admin/system-health", token=admin_token)
    print(f"  -> Latency: {elapsed*1000:.2f}ms | Status: {status} | Health: {health.get('status')}")
    if elapsed > 1.5:
        errors.append(f"Cycle {cycle_num} Test 3.3: System health check too slow ({elapsed:.2f}s)")

    if errors:
        print(f"\n[CYCLE {cycle_num} FAILED WITH {len(errors)} ERROR(S)]")
        for err in errors:
            print(f"   - {err}")
        return False
    else:
        print(f"\n[CYCLE {cycle_num} PASSED 100% WITH ZERO ERRORS!]")
        return True

if __name__ == "__main__":
    print("STARTING 3-CONSECUTIVE TEST EXECUTION SUITE...")
    all_passed = True
    for i in range(1, 4):
        passed = test_cycle(i)
        if not passed:
            all_passed = False
            break
        time.sleep(1) # brief pause between runs
    
    if all_passed:
        print("\n" + "="*60)
        print("ALL 3 CONSECUTIVE TEST CYCLES COMPLETED AND PASSED!")
        print("="*60)
        sys.exit(0)
    else:
        print("\n" + "="*60)
        print("TEST SUITE FAILED DURING EXECUTION!")
        print("="*60)
        sys.exit(1)
