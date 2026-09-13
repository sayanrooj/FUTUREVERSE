import sqlite3
import json
import hashlib
import os

def hash_password(password: str) -> str:
    # Match backend hash implementation (salted SHA-256)
    salt = "futureverse_salt_2026"
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

def update_database(db_path):
    print(f"Updating database: {db_path}")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # Ensure password for sayanrooj742137@gmail.com and sayanrooj312005@gmail.com is sayan.rooj
    hashed_pass = hash_password("sayan.rooj")
    c.execute("UPDATE users SET password_hash = ? WHERE email IN ('sayanrooj742137@gmail.com', 'sayanrooj312005@gmail.com')", (hashed_pass,))

    # Update candidate_id = 7 for applications 6, 13, 14
    c.execute("UPDATE applications SET candidate_id = 7 WHERE id IN (6, 13, 14)")

    # Ensure candidate_id = 5 for applications 1, 9 if needed or check existing
    c.execute("UPDATE applications SET candidate_id = 5 WHERE id = 1 AND candidate_id = 1")

    conn.commit()
    conn.close()

update_database("backend/futureverse.db")
update_database("futureverse.db")

print("Databases updated successfully.")
