import bcrypt
from globals import db_exec, select

unam = input("Please enter the username: ")
pasw = input("Please enter the password: ")
hashed_pw = bcrypt.hashpw(pasw.encode(encoding='utf8'), bcrypt.gensalt()).decode('utf8')

db_exec("INSERT INTO USERS VALUES (:1, :2)", [unam, hashed_pw])
print(f"User {unam} created!")

# How to compare passwords:
"""
pw_db = select("SELECT PASW FROM USERS WHERE UNAM = %s", [unam])[0][0].encode(encoding='utf8')

if bcrypt.checkpw(pasw.encode(encoding='utf8'), pw_db):
    print("Passwords match")
else:
    print("No match")
"""