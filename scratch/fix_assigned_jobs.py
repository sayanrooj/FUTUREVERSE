import sqlite3

def fix_applications(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Sayan Rooj (candidate_id = 5) will have EXACTLY 3 jobs:
    # 1. Job 1: Senior AI / Machine Learning Engineer
    # 2. Job 11: CSE (AI) Engineer
    # 3. Job 10: new in company

    # Update App #4 (DevOps) -> candidate_id 3 (Rohan Verma)
    cur.execute("UPDATE applications SET candidate_id = 3 WHERE id = 4")
    
    # Update App #5 (DevOps) -> candidate_id 3 (Rohan Verma)
    cur.execute("UPDATE applications SET candidate_id = 3 WHERE id = 5")
    
    # App #6 is Job 1 (Senior AI) -> Keep candidate_id = 5 (Sayan Rooj), Status = 'Offer Extended'
    cur.execute("UPDATE applications SET candidate_id = 5, status = 'Offer Extended' WHERE id = 6")
    
    # Update App #7 (Frontend UI/UX) -> candidate_id 2 (Priya Patel)
    cur.execute("UPDATE applications SET candidate_id = 2 WHERE id = 7")
    
    # Update App #8 (Data Analyst) -> candidate_id 1 (Aarav Sharma)
    cur.execute("UPDATE applications SET candidate_id = 1 WHERE id = 8")
    
    # Update App #9 (Full Stack) -> candidate_id 1 (Aarav Sharma)
    cur.execute("UPDATE applications SET candidate_id = 1 WHERE id = 9")
    
    # Update App #10 (Intern) -> candidate_id 4 (Ananya Sen)
    cur.execute("UPDATE applications SET candidate_id = 4 WHERE id = 10")
    
    # App #13 is Job 10 (new in company) -> Keep candidate_id = 5 (Sayan Rooj), Status = 'Face-to-Face Scheduled'
    cur.execute("UPDATE applications SET candidate_id = 5, status = 'Face-to-Face Scheduled' WHERE id = 13")
    
    # App #14 is Job 9 (new requirment) -> Change to Job 11 (CSE (AI) Engineer) for candidate_id = 5 (Sayan Rooj), Status = 'AI Interview Invited'
    cur.execute("UPDATE applications SET candidate_id = 5, job_id = 11, status = 'AI Interview Invited' WHERE id = 14")

    conn.commit()
    print(f"Fixed applications in {db_path}")

    # Verify Sayan's applications
    cur.execute('''
        SELECT a.id, a.job_id, j.title, a.status, u.email
        FROM applications a
        JOIN candidate_profiles cp ON a.candidate_id = cp.id
        JOIN users u ON cp.user_id = u.id
        JOIN jobs j ON a.job_id = j.id
        WHERE u.email = 'sayanrooj742137@gmail.com'
    ''')
    rows = cur.fetchall()
    print(f"Sayan Rooj has {len(rows)} applications:")
    for r in rows:
        print(f"  App #{r[0]}: Job #{r[1]} '{r[2]}' - Status: {r[3]}")

    conn.close()

fix_applications("backend/futureverse.db")
fix_applications("futureverse.db")
