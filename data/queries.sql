-- Total revenue per day
SELECT date, SUM(price + COALESCE(tip, 0)) AS total_revenue
FROM appointments
WHERE status = 'completed'
GROUP BY date
ORDER BY date;

-- Service popularity
SELECT service_type, COUNT(*) AS count
FROM appointments
GROUP BY service_type
ORDER BY count DESC;

-- Average duration of completed appointments
SELECT AVG(duration_minutes)
FROM appointments
WHERE status = 'completed';

-- Technician workload
SELECT technician, COUNT(*) AS num_appointments
FROM appointments
GROUP BY technician
ORDER BY num_appointments DESC;