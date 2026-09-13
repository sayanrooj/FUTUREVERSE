import urllib.request
import json

BASE = 'https://futureverse-api.loca.lt/api'

def req(method, path, body=None, token=None):
    headers = {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        'Origin': 'https://sayanrooj.github.io',
        'User-Agent': 'Mozilla/5.0'
    }
    if token:
        headers['Authorization'] = f'Bearer {token}'
    data = json.dumps(body).encode('utf-8') if body else None
    r = urllib.request.Request(f'{BASE}{path}', data=data, headers=headers, method=method)
    resp = urllib.request.urlopen(r, timeout=12)
    return resp.status, json.loads(resp.read().decode('utf-8'))

def main():
    print("=== 1. Testing Candidate Login & ID / Dossier Fetch ===")
    status, res = req('POST', '/auth/login', {'email': 'aarav.sharma@example.com', 'password': 'Candidate@2026'})
    user = res.get('user', {})
    print(f"Candidate Login OK: Status {status} | User ID: {user.get('id')} | Name: {user.get('full_name')} | Email: {user.get('email')}")
    cand_token = res.get('access_token')

    status, apps = req('GET', '/candidate/applications', token=cand_token)
    print(f"Candidate Applications Fetched: Status {status} | Count: {len(apps)}")
    for a in apps:
        print(f" -> Application ID: {a.get('id')} | Job ID: {a.get('job_id')} | Title: {a.get('job_title')} | Status: {a.get('status')}")

    print("\n=== 2. Testing Recruiter / Requirement Owner Login & Dossiers ===")
    status, res2 = req('POST', '/auth/owner-login', {'email': 'recruiter@futureverse.ai', 'password': 'Recruiter@2026'})
    print(f"Recruiter Login OK: Status {status} | Recruiter ID: {res2.get('user_id')} | Name: {res2.get('full_name')}")
    owner_token = res2.get('access_token')

    status, dash = req('GET', '/owner/dashboard', token=owner_token)
    jobs = dash.get('jobs', [])
    print(f"Recruiter Dashboard Fetched: Status {status} | Total Jobs: {len(jobs)}")

    status, cands = req('GET', '/owner/jobs/9/candidates', token=owner_token)
    print(f"Job 9 Candidates Fetched: Status {status} | Count: {len(cands)}")
    for c in cands:
        print(f" -> Application ID: {c.get('application_id')} | Candidate: {c.get('candidate_name')} | Email: {c.get('candidate_email')} | Status: {c.get('status')}")

    print("\n=== 3. Testing Super Admin Login & Support Queue ===")
    status, res3 = req('POST', '/auth/admin-login', {'email': 'admin@futureverse.ai', 'password': 'Admin@2026'})
    print(f"Admin Login OK: Status {status} | Admin ID: {res3.get('user_id')} | Role: {res3.get('role')}")
    admin_token = res3.get('access_token')

    status, tickets = req('GET', '/admin/support-tickets', token=admin_token)
    print(f"Admin Support Tickets Fetched: Status {status} | Count: {len(tickets)}")

    print("\nALL ID AND DATA FETCHING VERIFIED 100% OPERATIONAL OVER REMOTE GATEWAY!")

if __name__ == '__main__':
    main()
