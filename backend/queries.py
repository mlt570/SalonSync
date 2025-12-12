from database import get_connection


def fetch_appointments(limit: int = 100, status: str | None = None):
    conn = get_connection()
    cur = conn.cursor()
    if status:
        cur.execute(
            """
            SELECT * FROM appointments
            WHERE status = %s
            ORDER BY date DESC, start_time DESC
            LIMIT %s
            """,
            (status, limit),
        )
    else:
        cur.execute(
            """
            SELECT * FROM appointments
            ORDER BY date DESC, start_time DESC
            LIMIT %s
            """,
            (limit,),
        )
    rows = cur.fetchall()
    conn.close()
    return rows

def fetch_summary_stats():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT
          COALESCE(SUM(price + COALESCE(tip, 0)), 0) AS total_revenue,
          COUNT(*) AS total_appointments,
          COALESCE(AVG(duration_minutes), 0) AS average_duration
        FROM appointments
        WHERE status = 'completed'
        """
    )
    row = cur.fetchone()
    conn.close()
    return row

def fetch_revenue_by_day():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT date, SUM(price + COALESCE(tip, 0)) AS total_revenue
        FROM appointments
        WHERE status = 'completed'
        GROUP BY date
        ORDER BY date
        """
    )
    rows = cur.fetchall()
    conn.close()
    return rows

def fetch_service_popularity():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT service_type, COUNT(*) AS count
        FROM appointments
        GROUP BY service_type
        ORDER BY count DESC
        """
    )
    rows = cur.fetchall()
    conn.close()
    return rows
