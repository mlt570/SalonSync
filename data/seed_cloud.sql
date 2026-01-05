TRUNCATE TABLE public.appointments RESTART IDENTITY;

WITH days AS (
  SELECT d::date AS d
  FROM generate_series('2025-12-07'::date, '2026-01-05'::date, interval '1 day') AS d
  WHERE d::date <> '2025-12-25'::date
),
per_day AS (
  SELECT
    d,
    CASE
      WHEN extract(dow from d) IN (0,6) THEN (2 + floor(random() * 2))::int  -- weekends: 2-3 appts
      ELSE (3 + floor(random() * 3))::int                                   -- weekdays: 3-5 appts
    END AS n_appts
  FROM days
),
slots AS (
  SELECT
    p.d AS date,
    (time '10:00' + (interval '1 hour' * s.i))::time AS start_time
  FROM per_day p
  JOIN LATERAL generate_series(0, p.n_appts - 1) AS s(i) ON true
),
services AS (
  SELECT
    date,
    start_time,
    (ARRAY['gel','acrylic','dip','pedicure','manicure','fill'])[1 + floor(random()*6)] AS service_type,
    (ARRAY['Amanda','Phuong','Thao','Nhi'])[1 + floor(random()*4)] AS technician,
    (ARRAY[30,45,60,75,90])[1 + floor(random()*5)] AS duration_minutes,
    (ARRAY[35,45,55,65,75,85])[1 + floor(random()*6)]::numeric(10,2) AS price,
    CASE WHEN random() < 0.15 THEN NULL ELSE (5 + floor(random() * 16))::numeric(10,2) END AS tip,
    CASE WHEN random() < 0.80 THEN 'completed' ELSE 'cancelled' END AS status
  FROM slots
)
INSERT INTO public.appointments
  (date, start_time, service_type, technician, duration_minutes, price, tip, status)
SELECT
  date, start_time, service_type, technician, duration_minutes, price, tip, status
FROM services
ORDER BY date, start_time;
