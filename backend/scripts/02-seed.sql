-- Sample data (SQLite).

INSERT INTO services (code, name, description, service_time_minutes, active) VALUES
  ('SHIP', 'shipping and packets', 'Send and collect packages', 5, 1),
  ('PAY', 'payment service', 'Payments and fees', 10, 1),
  ('INFO', 'general information', 'General information and support', 3, 1),
  ('EXTRA', 'new service', 'Other available services', 0, 0);

-- Periods opened on 2026-10-08 (Europe/Rome). They are still open, so the first ticket
-- issued on a later day closes them and starts a new numbering period.
INSERT INTO sequence_periods (service_id, started_at, ended_at, last_value) VALUES
  (1, '2026-10-08T08:30:00.000Z', NULL, 2),
  (2, '2026-10-08T08:20:00.000Z', NULL, 1),
  (3, '2026-10-08T08:10:00.000Z', NULL, 1);

INSERT INTO tickets (service_id, period_id, sequence_number, status, issued_at) VALUES
  (1, 1, 1, 'WAITING', '2026-10-08T08:30:00.000Z'),
  (1, 1, 2, 'WAITING', '2026-10-08T08:35:00.000Z'),
  (2, 2, 1, 'IN_SERVICE', '2026-10-08T08:20:00.000Z'),
  (3, 3, 1, 'SERVED', '2026-10-08T08:10:00.000Z');
