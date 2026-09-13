import sqlite3
import json

for db_path in ['backend/futureverse.db', 'futureverse.db']:
    print(f"\n=======================================================")
    print(f"DATABASE: {db_path}")
    print(f"=======================================================")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute('''
        SELECT a.id as application_id, 
               a.job_id, 
               j.title as job_title, 
               j.department as job_department,
               j.location as job_location,
               j.employment_type,
               a.status as application_status,
               a.applied_at,
               a.final_decision,
               a.final_decision_notes,
               s.overall_score,
               u.email,
               u.full_name
        FROM applications a
        JOIN candidate_profiles cp ON a.candidate_id = cp.id
        JOIN users u ON cp.user_id = u.id
        JOIN jobs j ON a.job_id = j.id
        LEFT JOIN candidate_scores s ON s.application_id = a.id
        WHERE u.email = 'sayanrooj742137@gmail.com'
        ORDER BY a.id ASC
    ''')
    rows = [dict(r) for r in cur.fetchall()]
    print(f"Total jobs applied by sayanrooj742137@gmail.com: {len(rows)}\n")
    for i, r in enumerate(rows, 1):
        score_display = f"{r['overall_score']:.1f}%" if r['overall_score'] is not None else "N/A"
        print(f"{i}. Position: {r['job_title']} (Job ID: #{r['job_id']})")
        print(f"   - Application Ref: #{r['application_id']}")
        print(f"   - Department: {r['job_department']}")
        print(f"   - Location: {r['job_location']} ({r['employment_type']})")
        print(f"   - Current Pipeline Status: {r['application_status']}")
        print(f"   - AI Suitability Score: {score_display}")
        print(f"   - Applied Timestamp: {r['applied_at']}")
        if r.get('final_decision'):
            print(f"   - Recruiter Decision: {r['final_decision']} ({r.get('final_decision_notes', '')})")
        print()
    conn.close()
