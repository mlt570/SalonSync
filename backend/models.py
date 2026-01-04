from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class Appointment(BaseModel):
    appointment_id: int
    date: date
    start_time: time
    service_type: str
    technician: str
    duration_minutes: int
    price: float
    tip: Optional[float]
    status: str

class SummaryStats(BaseModel):
    total_revenue: float
    total_appointments: int
    average_duration: float

