import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSqliteDb } from '../src/db/sqlite.js';

describe('Backend smoke tests', () => {
  it('initializes services and tickets in an in-memory SQLite database', async () => {
    const db = createSqliteDb(':memory:');

    try {
      const { rows: services } = await db.query(
        'SELECT code, active FROM services ORDER BY code'
      );

      expect(services).toEqual([
        { code: 'EXTRA', active: 0 },
        { code: 'INFO', active: 1 },
        { code: 'PAY', active: 1 },
        { code: 'SHIP', active: 1 },
      ]);

      const { rows: tables } = await db.query(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'tickets'"
      );

      expect(tables).toHaveLength(1);
    } finally {
      await db.close();
    }
  });

  it('responds to GET /api/health with database UP', async () => {
    const db = createSqliteDb(':memory:');

    try {
      const response = await request(createApp({ db }))
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'UP',
        database: 'UP'
      });
    } finally {
      await db.close();
    }
  });
});