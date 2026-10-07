-- Database schema (SQLite).
-- Run automatically by the backend when the SQLite file has no tables yet.

CREATE TABLE IF NOT EXISTS dummy (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_dummy_name_lower ON dummy (lower(name));
