import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app.js';

describe('Black Box Test - POST /api/tickets', () => {

  
  it('should create a new ticket and return status 201', async () => {
    const mockDb = {
      query: vi.fn().mockImplementation(async (sql) => {
        
        if (sql.includes('FROM services WHERE code = ?')) {
          return { rows: [{ id: 1, code: 'SHIP', name: 'shipping and packets', active: 1 }] };
        }
        
        if (sql.includes('INSERT INTO tickets')) {
          return { rows: [{ id: 15 }] };
        }
        // 3. countPeopleAhead
        if (sql.includes('SELECT COUNT(*) AS peopleAhead')) {
          return { rows: [{ peopleAhead: 2 }] };
        }
        return { rows: [] };
      })
    };

    const app = createApp({ db: mockDb });
    const response = await request(app)
      .post('/api/tickets')
      .send({ serviceCode: 'SHIP' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ticketCode: expect.stringMatching(/^T-\d{6}$/),
      serviceName: 'shipping and packets',
      issuedAt: expect.any(String),
      peopleAhead: 2
    });
  });

  
  it('should return status 500 and ERR-101 if service is invalid', async () => {
    const mockDb = { query: vi.fn() };
    const app = createApp({ db: mockDb });

    const response = await request(app)
      .post('/api/tickets')
      .send({ serviceCode: 'INVALID!!' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 'ERR-101',
      message: 'Invalid service code'
    });
  });

  
  it('should return status 500 and ERR-100 if id service does not exist', async () => {
    const mockDb = {
      query: vi.fn().mockResolvedValue({ rows: [] }) 
    };

    const app = createApp({ db: mockDb });
    const response = await request(app)
      .post('/api/tickets')
      .send({ serviceCode: 'NOT_EXIST' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 'ERR-100',
      message: 'Service not found'
    });
  });


  it('should return satus 500 and ERR-102 if service is not active', async () => {
    const mockDb = {
      query: vi.fn().mockResolvedValue({
        rows: [{ id: 2, code: 'EXTRA', name: 'new service', active: 0 }]
      })
    };

    const app = createApp({ db: mockDb });
    const response = await request(app)
      .post('/api/tickets')
      .send({ serviceCode: 'EXTRA' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 'ERR-102',
      message: 'Service is not available'
    });
  });

});