-- Sample data (SQLite).

INSERT INTO dummy (name, description, created_at) VALUES
                                                      ('Counter 1',        'Handles shipping and payments',        strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-3 days')),
                                                      ('Counter 2',        'Handles account management',           strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-2 days')),
                                                      ('Counter 3',        'General purpose counter',              strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 day')),
                                                      ('Kiosk',            'Ticket dispenser at the entrance',     strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-12 hours')),
                                                      ('Main board',       'Public display in the waiting room',   strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-6 hours')),
                                                      ('Officer station',  NULL,                                   strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));

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