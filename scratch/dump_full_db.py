import sqlite3
import json

conn = sqlite3.connect('backend/futureverse.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute('SELECT * FROM jobs ORDER BY id ASC')
jobs = [dict(r) for r in cur.fetchall()]

# Parse category_thresholds if string
for j in jobs:
    if isinstance(j.get('category_thresholds'), str):
        try:
            j['category_thresholds'] = json.loads(j['category_thresholds'])
        except:
            pass

cur.execute('''
    SELECT a.*, 
           u.email as candidate_email, u.full_name as candidate_name,
           j.title as job_title, j.department as job_department,
           s.overall_score as score_from_table, s.criteria_breakdown, s.requirement_evidence, s.recruiter_override
    FROM applications a
    LEFT JOIN users u ON a.candidate_id = u.id
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN candidate_scores s ON s.application_id = a.id
    ORDER BY a.id ASC
''')
apps = [dict(r) for r in cur.fetchall()]

cur.execute('SELECT id, email, full_name, role, is_active FROM users ORDER BY id ASC')
users = [dict(r) for r in cur.fetchall()]

cur.execute('SELECT * FROM interviews ORDER BY id ASC')
interviews = [dict(r) for r in cur.fetchall()]

cur.execute('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 20')
audit_logs = [dict(r) for r in cur.fetchall()]

cur.execute('SELECT * FROM support_tickets ORDER BY id ASC')
support_tickets = [dict(r) for r in cur.fetchall()]

print(f"Jobs: {len(jobs)}")
print(f"Apps: {len(apps)}")
print(f"Users: {len(users)}")
print(f"Interviews: {len(interviews)}")

with open('scratch/db_dump.json', 'w', encoding='utf-8') as f:
    json.dump({
        'jobs': jobs,
        'applications': apps,
        'users': users,
        'interviews': interviews,
        'audit_logs': audit_logs,
        'support_tickets': support_tickets
    }, f, indent=2, default=str)

print("Saved to scratch/db_dump.json")
conn.close()
