import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

/** Fake database: answers the DAO's SQL with canned rows, so the HTTP layer is tested end to end. */
function fakeDb() {
  const rows = [{ id: 1, name: 'Kiosk', description: null, createdAt: '2026-10-06T10:00:00.000Z' }];
  return {
    async query(sql, params = []) {
      if (sql.startsWith('SELECT 1')) return { rows: [{}] };
      if (sql.startsWith('INSERT')) {
        const row = { id: 2, name: params[0], description: params[1], createdAt: '2026-10-06T11:00:00.000Z' };
        return { rows: [row] };
      }
      if (sql.startsWith('DELETE')) return { rowCount: params[0] === 1 ? 1 : 0 };
      if (sql.includes('WHERE id')) return { rows: rows.filter((r) => r.id === params[0]) };
      return { rows };
    },
  };
}

const app = createApp({ db: fakeDb() });

describe('/api/dummies', () => {
  it('GET returns the list', async () => {
    const res = await request(app).get('/api/dummies');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Kiosk');
  });

  it('GET /:id returns 404 problem details when missing', async () => {
    const res = await request(app).get('/api/dummies/42');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ status: 404, detail: 'Dummy 42 not found' });
  });

  it('POST creates and returns 201 with Location', async () => {
    const res = await request(app).post('/api/dummies').send({ name: 'New' });
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/dummies/2');
  });

  it('POST without name returns 400', async () => {
    const res = await request(app).post('/api/dummies').send({});
    expect(res.status).toBe(400);
    expect(res.body.detail).toBe('name is required');
  });

  it('POST with broken JSON returns 400', async () => {
    const res = await request(app).post('/api/dummies').set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
  });

  it('DELETE returns 204, then 404', async () => {
    expect((await request(app).delete('/api/dummies/1')).status).toBe(204);
    expect((await request(app).delete('/api/dummies/7')).status).toBe(404);
  });

  it('unknown route returns 404 JSON', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
  });

  it('health reports UP', async () => {
    expect((await request(app).get('/api/health')).body).toEqual({ status: 'UP', database: 'UP' });
  });
});
