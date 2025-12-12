CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    service_type TEXT NOT NULL,
    technician TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    tip NUMERIC(10,2),
    status TEXT NOT NULL
);
