from fastapi import FastAPI, Query
from typing import List, Optional

from models import Appointment, SummaryStats
import queries


app = FastAPI(title="Nail Salon Analytics API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/appointments", response_model=List[Appointment])
def get_appointments(
    limit: int = Query(50, ge=1, le=500),
    status: Optional[str] = Query(None)
):
    rows = queries.fetch_appointments(limit=limit, status=status)
    return rows

@app.get("/stats", response_model=SummaryStats)
def get_stats():
    row = queries.fetch_summary_stats()
    return row

@app.get("/stats/revenue_by_day")
def get_revenue_by_day():
    return queries.fetch_revenue_by_day()

@app.get("/stats/service_popularity")
def get_service_popularity():
    return queries.fetch_service_popularity()
