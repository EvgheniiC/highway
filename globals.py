import cx_Oracle
from decouple import config
import time

try:
    project_pool = cx_Oracle.SessionPool(user=config('DB_PROJECT_USER'),
                                        password=config('DB_PROJECT_PW'),
                                        dsn=config('DB_PROJECT_DSN'),
                                        min=2, max=20, increment=1, encoding="UTF-8"
                                        )
    if (project_pool):
        print("Project connection pool created successfully")
except (Exception) as error:
    print("Error while creating DB pool ", error)
    exit()


def db_exec(stmt, params=[]):
    try:
        try:
            conn = project_pool.acquire()
        except Exception as e:
            print(e)
            time.sleep(1/100)
            db_exec(stmt, params)
        cur = conn.cursor()
        cur.execute(stmt, params)
        conn.commit()
        cur.close()
        project_pool.release(conn)
        return True
    except Exception as e:
        print(e)
        print(stmt)
        print(params)
        return False

def select(stmt, params=[]):
    rows = []
    try:
        try:
            conn = project_pool.acquire()
        except Exception as e:
            print(e)
            time.sleep(1/100)
            db_exec(stmt, params)
        cur = conn.cursor()
        cur.execute(stmt, params)
        rows = cur.fetchall()
        cur.close()
        project_pool.release(conn)
    except Exception as e:
        print(e)
        print(stmt)
        print(params)
    finally:
        return rows
    
def new_seq(seq_name):
    seq_rows = select("SELECT nextval(%s)", [seq_name])
    for row in seq_rows:
        return row[0]
    return 0