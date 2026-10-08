-- Sample data (SQLite).

INSERT INTO services (code, name, service_time_minutes, active) VALUES
  ('SHIP', 'shipping and packets', 5, 1),
  ('PAY', 'payment service', 10, 1),
  ('INFO', 'general information', 3, 1),
  ('EXTRA', 'new service', 0, 0);

INSERT INTO tickets (service_id, status, issued_at) VALUES
  (1, 'WAITING', '2026-10-08T08:30:00.000Z'),
  (1, 'WAITING', '2026-10-08T08:35:00.000Z'),
  (2, 'IN_SERVICE', '2026-10-08T08:20:00.000Z'),
  (3, 'SERVED', '2026-10-08T08:10:00.000Z');