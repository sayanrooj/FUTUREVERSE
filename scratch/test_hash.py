import sqlite3
from backend.services.auth_service import hash_password, verify_password

conn = sqlite3.connect('backend/futureverse.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("SELECT id, email, hashed_password FROM users WHERE email = 'sayanrooj742137@gmail.com'")
row = cur.fetchone()
print("Found user:", dict(row))

new_hash = hash_password("sayan.rooj")
print("New hash generated:", new_hash)
print("Verify with new hash:", verify_password("sayan.rooj", new_hash))
print("Verify existing hash in DB:", verify_password("sayan.rooj", row['hashed_password']))

cur.execute("UPDATE users SET hashed_password = ? WHERE email = 'sayanrooj742137@gmail.com'", (new_hash,))
conn.commit()

cur.execute("SELECT id, email, hashed_password FROM users WHERE email = 'sayanrooj742137@gmail.com'")
row2 = cur.fetchone()
print("After update verify:", verify_password("sayan.rooj", row2['hashed_password']))

conn.close()
