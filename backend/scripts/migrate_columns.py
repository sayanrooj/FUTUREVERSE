import sqlite3
import sys
from pathlib import Path

DB_PATH = Path(r"C:\Users\sayan\.gemini\antigravity-ide\scratch\futureverse\backend\futureverse.db")

def upgrade_database():
    if not DB_PATH.exists():
        print("[Migrate] Database does not exist yet. It will be created on startup.")
        return

    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()

    # 1. Check support_tickets columns
    cursor.execute("PRAGMA table_info(support_tickets)")
    ticket_cols = [row[1] for row in cursor.fetchall()]
    
    if "priority" not in ticket_cols:
        cursor.execute("ALTER TABLE support_tickets ADD COLUMN priority VARCHAR(20) DEFAULT 'MEDIUM'")
        print("[Migrate] Added column 'priority' to support_tickets")
    
    if "closed_at" not in ticket_cols:
        cursor.execute("ALTER TABLE support_tickets ADD COLUMN closed_at DATETIME")
        print("[Migrate] Added column 'closed_at' to support_tickets")

    # 2. Check applications columns
    cursor.execute("PRAGMA table_info(applications)")
    app_cols = [row[1] for row in cursor.fetchall()]

    if "final_decision" not in app_cols:
        cursor.execute("ALTER TABLE applications ADD COLUMN final_decision VARCHAR(50)")
        print("[Migrate] Added column 'final_decision' to applications")

    if "final_decision_at" not in app_cols:
        cursor.execute("ALTER TABLE applications ADD COLUMN final_decision_at DATETIME")
        print("[Migrate] Added column 'final_decision_at' to applications")

    if "final_decision_by" not in app_cols:
        cursor.execute("ALTER TABLE applications ADD COLUMN final_decision_by VARCHAR(150)")
        print("[Migrate] Added column 'final_decision_by' to applications")

    if "final_decision_notes" not in app_cols:
        cursor.execute("ALTER TABLE applications ADD COLUMN final_decision_notes TEXT")
        print("[Migrate] Added column 'final_decision_notes' to applications")

    conn.commit()
    conn.close()
    print("[Migrate] Database schema verified & updated successfully.")

if __name__ == "__main__":
    upgrade_database()
