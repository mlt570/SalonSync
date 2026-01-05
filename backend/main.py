from fastapi import FastAPI, Query
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware


from models import Appointment, SummaryStats
import queries

app = FastAPI(title="Nail Salon Analytics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/technicians")
def get_technicians():
    return queries.fetch_technicians()

@app.get("/appointments", response_model=List[Appointment])
def get_appointments(
    limit: int = Query(50, ge=1, le=500),
    status: Optional[str] = Query(None),
    technician: Optional[str] = Query(None),
):
    return queries.fetch_appointments(limit=limit, status=status, technician=technician)

@app.get("/stats", response_model=SummaryStats)
def get_stats(technician: Optional[str] = Query(None)):
    return queries.fetch_summary_stats(technician=technician)

@app.get("/stats/revenue_by_day")
def get_revenue_by_day(technician: Optional[str] = Query(None)):
    return queries.fetch_revenue_by_day(technician=technician)

@app.get("/stats/service_popularity")
def get_service_popularity(technician: Optional[str] = Query(None)):
    return queries.fetch_service_popularity(technician=technician)

@app.get("/stats/revenue_by_technician")
def get_revenue_by_technician():
    return queries.fetch_revenue_by_technician()

@app.get("/stats/utilization_by_tech_day")
def get_utilization_by_tech_day():
    return queries.fetch_utilization_by_tech_day()
