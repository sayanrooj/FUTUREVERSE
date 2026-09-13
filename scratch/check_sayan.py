import sqlite3

conn = sqlite3.connect('backend/futureverse.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("SELECT * FROM users WHERE email LIKE '%sayan%'")
users = [dict(r) for r in cur.fetchall()]
for u in users:
    print('User:', dict(u))
    cur.execute('SELECT * FROM candidate_profiles WHERE user_id = ?', (u['id'],))
    prof = cur.fetchall()
    for p in prof:
        print('  Profile:', dict(p))

cur.execute('''
    SELECT a.id, a.job_id, a.candidate_id, a.status, j.title, u.email, u.full_name
    FROM applications a
    LEFT JOIN candidate_profiles cp ON a.candidate_id = cp.id
    LEFT JOIN users u ON cp.user_id = u.id
    LEFT JOIN jobs j ON a.job_id = j.id
    ORDER BY a.id ASC
''')
apps = [dict(r) for r in cur.fetchall()]
print(f'\nTotal apps in DB: {len(apps)}')
for a in apps:
    print(f"App #{a['id']}: Job '{a['title']}' (Job ID {a['job_id']}) -> Candidate: {a['full_name']} ({a['email']}), Status: {a['status']}")

conn.close()
