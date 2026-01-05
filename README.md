SalonSync – Nail Salon Analytics Dashboard

SalonSync is a full-stack analytics dashboard for a nail salon, designed to visualize appointment patterns, revenue, technician workload, peak hours, and optimization for nail salon scheduling. 
It demonstrates a production-style architecture with a cloud-hosted API, managed database, and a lightweight frontend dashboard.

Tech Stack:

Backend
- Python
- FastAPI
- PostgreSQL
- psycopg2
- Docker
- Google Cloud Run
- Google Cloud SQL (Postgres)

Frontend
- HTML / CSS / JavaScript
- Chart.js

Data and Analytics:
- SQL (joins, aggregation, grouping)
- R (ggplot2, dplyr)

Features
- View recent appointments
- Revenue and service popularity analytics
- Individualized technician workload analysis
- Cloud-hosted API with managed database
- Dockerized backend for reproducible deployments

Architecture Overview:
Frontend (static HTML/JS)
        ↓ fetch()
FastAPI API (Cloud Run)
        ↓
PostgreSQL (Cloud SQL)

Running Locally (No Docker)



