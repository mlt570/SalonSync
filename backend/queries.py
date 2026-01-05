from database import get_connection


def fetch_technicians():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT DISTINCT technician
        FROM appointments
        ORDER BY technician
        """
    )
    rows = cur.fetchall()
    conn.close()
    # rows are dicts like {"technician": "Amy"}
    return rows


def fetch_appointments(limit: int = 100, status: str | None = None, technician: str | None = None):
    conn = get_connection()
    cur = conn.cursor()

    where_clauses = []
    params = []

    if status:
        where_clauses.append("status = %s")
        params.append(status)

    if technician:
        where_clauses.append("technician = %s")
        params.append(technician)

    where_sql = ""
    if where_clauses:
        where_sql = "WHERE " + " AND ".join(where_clauses)

    params.append(limit)

    cur.execute(
        f"""
        SELECT *
        FROM appointments
        {where_sql}
        ORDER BY date DESC, start_time DESC
        LIMIT %s
        """,
        tuple(params),
    )

    rows = cur.fetchall()
    conn.close()
    return rows


def fetch_summary_stats(technician: str | None = None):
    conn = get_connection()
    cur = conn.cursor()

    if technician:
        cur.execute(
            """
            SELECT
              COALESCE(SUM(price + COALESCE(tip, 0)), 0) AS total_revenue,
              COUNT(*) AS total_appointments,
              COALESCE(AVG(duration_minutes), 0) AS average_duration
            FROM appointments
            WHERE status = 'completed' AND technician = %s
            """,
            (technician,),
        )
    else:
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


def fetch_revenue_by_day(technician: str | None = None):
    conn = get_connection()
    cur = conn.cursor()

    if technician:
        cur.execute(
            """
            SELECT date, SUM(price + COALESCE(tip, 0)) AS total_revenue
            FROM appointments
            WHERE status = 'completed' AND technician = %s
            GROUP BY date
            ORDER BY date
            """,
            (technician,),
        )
    else:
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


def fetch_service_popularity(technician: str | None = None):
    conn = get_connection()
    cur = conn.cursor()

    if technician:
        cur.execute(
            """
            SELECT service_type, COUNT(*) AS count
            FROM appointments
            WHERE technician = %s
            GROUP BY service_type
            ORDER BY count DESC
            """,
            (technician,),
        )
    else:
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


def fetch_revenue_by_technician():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT
          technician,
          COALESCE(SUM(price + COALESCE(tip, 0)), 0) AS total_revenue,
          COUNT(*) FILTER (WHERE status = 'completed') AS completed_count
        FROM appointments
        GROUP BY technician
        ORDER BY total_revenue DESC
        """
    )
    rows = cur.fetchall()
    conn.close()
    return rows


def fetch_utilization_by_tech_day():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT
          date,
          technician,
          COUNT(*) AS appointments
        FROM appointments
        GROUP BY date, technician
        ORDER BY date, technician
        """
    )
    rows = cur.fetchall()
    conn.close()
    return rows
