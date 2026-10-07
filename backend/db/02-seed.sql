-- Sample data (SQLite).

INSERT INTO dummy (name, description, created_at) VALUES
    ('Counter 1',        'Handles shipping and payments',        strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-3 days')),
    ('Counter 2',        'Handles account management',           strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-2 days')),
    ('Counter 3',        'General purpose counter',              strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 day')),
    ('Kiosk',            'Ticket dispenser at the entrance',     strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-12 hours')),
    ('Main board',       'Public display in the waiting room',   strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-6 hours')),
    ('Officer station',  NULL,                                   strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
