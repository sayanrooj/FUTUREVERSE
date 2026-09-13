import sqlite3
import json

conn = sqlite3.connect('backend/futureverse.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute('SELECT * FROM jobs ORDER BY id ASC')
jobs = [dict(r) for r in cur.fetchall()]
print(f'Total jobs: {len(jobs)}')
for j in jobs:
    print(f"  ID {j['id']}: {j['title']} | Dept: {j.get('department')} | Status: {j.get('status')}")

cur.execute('''
    SELECT a.*, u.email as candidate_email, u.full_name as candidate_name, j.title as job_title, j.department as job_department
    FROM applications a
    LEFT JOIN users u ON a.candidate_id = u.id
    LEFT JOIN jobs j ON a.job_id = j.id
    ORDER BY a.id ASC
''')
apps = [dict(r) for r in cur.fetchall()]
print(f'\nTotal applications: {len(apps)}')
for a in apps:
    print(f"  App #{a['id']}: {a.get('candidate_name')} ({a.get('candidate_email')}) -> {a.get('job_title')} (Score: {a.get('overall_score')}, Status: {a.get('status')})")

cur.execute('SELECT id, email, full_name, role FROM users ORDER BY id ASC')
users = [dict(r) for r in cur.fetchall()]
print(f'\nTotal users: {len(users)}')
for u in users:
    print(f"  User #{u['id']}: {u['email']} | Name: {u['full_name']} | Role: {u['role']}")

conn.close()
