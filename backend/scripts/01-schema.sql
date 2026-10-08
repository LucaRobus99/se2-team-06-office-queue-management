PRAGMA foreign_keys = ON ;

-- Database schema (SQLite).
-- Run automatically by the backend when the SQLite file has no tables yet.

CREATE TABLE IF NOT EXISTS dummy (
                                     id          INTEGER PRIMARY KEY AUTOINCREMENT,
                                     name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

CREATE INDEX IF NOT EXISTS idx_dummy_name_lower ON dummy (lower(name));


CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  service_time_minutes INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'IN_SERVICE', 'SERVED')),
  issued_at TEXT NOT NULL,
  FOREIGN KEY (service_id) REFERENCES services (id)
);