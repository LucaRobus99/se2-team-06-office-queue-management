PRAGMA foreign_keys = ON ;

-- Database schema (SQLite).
-- Run automatically by the backend when the SQLite file has no tables yet.

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  service_time_minutes INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

-- A numbering period of a service: ticket numbers restart from 1 in every new period.
-- The open period of a service is the one with ended_at NULL.
CREATE TABLE IF NOT EXISTS sequence_periods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  last_value INTEGER NOT NULL DEFAULT 0 CHECK (last_value >= 0),
  FOREIGN KEY (service_id) REFERENCES services (id)
);

-- At most one open period per service.
CREATE UNIQUE INDEX IF NOT EXISTS ux_sequence_periods_open
  ON sequence_periods (service_id)
  WHERE ended_at IS NULL;

CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  period_id INTEGER NOT NULL,
  sequence_number INTEGER NOT NULL CHECK (sequence_number > 0),
  status TEXT NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'IN_SERVICE', 'SERVED')),
  issued_at TEXT NOT NULL,
  UNIQUE (period_id, sequence_number),
  FOREIGN KEY (service_id) REFERENCES services (id),
  FOREIGN KEY (period_id) REFERENCES sequence_periods (id)
);
