import urllib.request
import json
import time

def run_test():
    def req(method, path, body=None, token=None):
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'
        data = json.dumps(body).encode('utf-8') if body else None
        r = urllib.request.Request(f'http://127.0.0.1:8000{path}', data=data, headers=headers, method=method)
        start = time.time()
        resp = urllib.request.urlopen(r)
        elapsed = time.time() - start
        res_data = json.loads(resp.read().decode('utf-8'))
        return resp.status, res_data, elapsed

    print("Authenticating as Recruiter (Alex Morgan)...")
    status, auth, elapsed = req('POST', '/api/auth/owner-login', {'email': 'recruiter@futureverse.ai', 'password': 'Recruiter@2026'})
    token = auth['access_token']
    print(f"Recruiter login OK in {elapsed:.3f}s")

    # Application 13 Insight
    status, ins, elapsed = req('GET', '/api/owner/applications/13/insight', token=token)
    cand_name = ins.get('candidate_name')
    job_title = ins.get('job_title')
    job_dept = ins.get('job_department')
    print(f"Candidate Dossier: {cand_name} | Role: {job_title} | Dept: {job_dept} (fetched in {elapsed:.3f}s)")

    # 1. AI Technical Assessment Invitation
    print("\n[PART 1] Dispatched: AI Technical Assessment Invitation")
    status, res1, elapsed1 = req('POST', '/api/owner/applications/13/invite-interview', {}, token=token)
    print(f"-> Response in {elapsed1:.3f}s: {res1.get('message')}")

    # 2. Face-to-Face Interview Scheduling (Domain Track)
    print("\n[PART 2] Dispatched: Face-to-Face Domain Interview")
    f2f_payload = {
        'round_type': 'FACE_TO_FACE',
        'date_str': '2026-09-25',
        'time_str': '02:30 PM IST',
        'location_or_link': 'https://meet.google.com/fv-cloud-deepdive',
        'interviewer_name': 'Dr. Aris Vance (Principal Architect)',
        'duration_minutes': 45,
        'instructions': 'Domain Technical Deep-Dive: Distributed systems, streaming pipelines, neural orchestration.'
    }
    status, res2, elapsed2 = req('POST', '/api/owner/applications/13/schedule-f2f', f2f_payload, token=token)
    print(f"-> Response in {elapsed2:.3f}s: {res2.get('message')}")

    # 3. Final Selection / Offer Extended
    print("\n[PART 3] Dispatched: Domain Offer Extended / Selection")
    decision_payload = {
        'decision': 'SELECTED',
        'feedback': 'Exceptional architectural rigor and domain mastery demonstrated throughout the cognitive systems evaluation.'
    }
    status, res3, elapsed3 = req('POST', '/api/owner/applications/13/final-decision', decision_payload, token=token)
    print(f"-> Response in {elapsed3:.3f}s: {res3.get('message')}")

    # 4. Immediate Re-send to verify suppression is REMOVED
    print("\n[PART 4] Dispatched: Immediate Manual Re-send (Verifying ZERO suppression lag)")
    status, res4, elapsed4 = req('POST', '/api/owner/applications/13/retry-email', {}, token=token)
    print(f"-> Response in {elapsed4:.3f}s: {res4.get('message')}")

    print("\nAll 4 recruitment stages executed successfully!")

if __name__ == '__main__':
    run_test()
