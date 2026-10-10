import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSqliteDb } from '../src/db/sqlite.js';

describe('Office Queue Management - Backend Integration Tests', () => {
  let db;
  let app;

  beforeEach(() => {
    // Create a fresh in-memory SQLite database for each test, populated with schema and seed
    db = createSqliteDb(':memory:');
    app = createApp({ db });
  });

  afterEach(async () => {
    await db.close();
  });

  describe('GET /api/services', () => {
    it('returns 200 with all services (active and inactive), ordered by name (case-insensitive)', async () => {
      const response = await request(app).get('/api/services');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);

      // Verify structure of service objects
      const services = response.body;
      for (const service of services) {
        expect(service).toHaveProperty('code');
        expect(service).toHaveProperty('name');
        expect(service).toHaveProperty('active');
        expect([0, 1]).toContain(service.active);
      }

      // Verify inactive service is included
      const inactive = services.find((s) => s.code === 'EXTRA');
      expect(inactive).toBeDefined();
      expect(inactive.active).toBe(0);

      // Verify active services are included
      const active = services.filter((s) => s.active === 1);
      expect(active.length).toBe(3);

      // Verify order by name (case-insensitive)
      const names = services.map((s) => s.name.toLowerCase());
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('returns 200 with an empty array [] when no services are registered', async () => {
      // Clear tickets and services
      await db.query('DELETE FROM tickets');
      await db.query('DELETE FROM services');

      const response = await request(app).get('/api/services');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/tickets', () => {
    it('creates a new ticket for an active service with peopleAhead = 0 (first ticket of the day)', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'SHIP' });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        serviceName: 'shipping and packets',
        peopleAhead: 0,
      });
      expect(response.body.ticketCode).toMatch(/^T-\d{6}$/);
      expect(new Date(response.body.issuedAt).toISOString()).toBe(response.body.issuedAt);

      // Verify ticket is stored in SQLite
      const { rows } = await db.query('SELECT * FROM tickets WHERE id = ?', [
        Number(response.body.ticketCode.replace('T-', '')),
      ]);
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe('WAITING');
    });

    it('increments peopleAhead to 1 for the second ticket of the same service on the same day', async () => {
      const firstRes = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'SHIP' });
      expect(firstRes.status).toBe(201);
      expect(firstRes.body.peopleAhead).toBe(0);

      const secondRes = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'SHIP' });
      expect(secondRes.status).toBe(201);
      expect(secondRes.body.peopleAhead).toBe(1);
      expect(secondRes.body.ticketCode).not.toBe(firstRes.body.ticketCode);
    });

    it('counts peopleAhead independently for a different service', async () => {
      // Issue tickets for SHIP
      await request(app).post('/api/tickets').send({ serviceCode: 'SHIP' });
      await request(app).post('/api/tickets').send({ serviceCode: 'SHIP' });

      // Issue ticket for PAY: should have peopleAhead = 0
      const payRes = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'PAY' });

      expect(payRes.status).toBe(201);
      expect(payRes.body.serviceName).toBe('payment service');
      expect(payRes.body.peopleAhead).toBe(0);
    });

    it('generates unique and monotonic ticketCodes across different services', async () => {
      const res1 = await request(app).post('/api/tickets').send({ serviceCode: 'SHIP' });
      const res2 = await request(app).post('/api/tickets').send({ serviceCode: 'PAY' });
      const res3 = await request(app).post('/api/tickets').send({ serviceCode: 'INFO' });

      const id1 = Number(res1.body.ticketCode.replace('T-', ''));
      const id2 = Number(res2.body.ticketCode.replace('T-', ''));
      const id3 = Number(res3.body.ticketCode.replace('T-', ''));

      expect(id2).toBeGreaterThan(id1);
      expect(id3).toBeGreaterThan(id2);
    });

    it('does not count tickets from previous days towards today peopleAhead', async () => {
      // The seed data has 2 WAITING tickets for SHIP issued on 2026-10-08
      // Any new ticket created today must not count those past tickets
      const res = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'SHIP' });

      expect(res.status).toBe(201);
      expect(res.body.peopleAhead).toBe(0);
    });

    it('returns 500 ERR-102 when requesting a ticket for an inactive service', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'EXTRA' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 'ERR-102',
        message: 'Service is not available',
      });

      // Verify no ticket was inserted for EXTRA
      const { rows } = await db.query(
        'SELECT * FROM tickets JOIN services ON tickets.service_id = services.id WHERE services.code = ?',
        ['EXTRA']
      );
      expect(rows).toHaveLength(0);
    });

    it('returns 500 ERR-100 when requesting a non-existent service', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ serviceCode: 'NON_EXISTENT' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 'ERR-100',
        message: 'Service not found',
      });
    });

    it('returns 500 ERR-101 when serviceCode is empty, missing, or invalid', async () => {
      // Empty body
      const resEmpty = await request(app).post('/api/tickets').send({});
      expect(resEmpty.status).toBe(500);
      expect(resEmpty.body).toEqual({
        code: 'ERR-101',
        message: 'Invalid service code',
      });

      // Empty string
      const resBlank = await request(app).post('/api/tickets').send({ serviceCode: '   ' });
      expect(resBlank.status).toBe(500);
      expect(resBlank.body.code).toBe('ERR-101');

      // Invalid characters / too long
      const resTooLong = await request(app).post('/api/tickets').send({ serviceCode: 'A'.repeat(25) });
      expect(resTooLong.status).toBe(500);
      expect(resTooLong.body.code).toBe('ERR-101');
    });

    it('returns 500 ERR-101 when malformed JSON is sent to POST /api/tickets', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Content-Type', 'application/json')
        .send('{"serviceCode": invalid-json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 'ERR-101',
        message: 'Invalid service code',
      });
    });

    it('handles concurrent ticket requests correctly and gives distinct tickets', async () => {
      const [res1, res2] = await Promise.all([
        request(app).post('/api/tickets').send({ serviceCode: 'PAY' }),
        request(app).post('/api/tickets').send({ serviceCode: 'PAY' }),
      ]);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.ticketCode).not.toBe(res2.body.ticketCode);

      // One of them is first (peopleAhead: 0), the other is second (peopleAhead: 1)
      const peopleAheadValues = [res1.body.peopleAhead, res2.body.peopleAhead].sort();
      expect(peopleAheadValues).toEqual([0, 1]);
    });
  });
});
