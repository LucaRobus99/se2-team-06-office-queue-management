import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app.js';

describe('Black Box Test - GET /api/services', () => {

  
  it('should return status 200 and all the available services', async () => {
    const mockDb = {
      query: vi.fn().mockResolvedValue({
        rows: [
          { code: 'SHIP', name: 'shipping and packets', description:'Send and collect packages',  active: 1 },
          { code: 'EXTRA', name: 'new service',description:'Other available services', active: 1}
        ]
      })
    };

    const app = createApp({ db: mockDb });
    const response = await request(app).get('/api/services');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { code: 'SHIP', name: 'shipping and packets', description:'Send and collect packages',  active: 1 },
      { code: 'EXTRA', name: 'new service',description:'Other available services', active: 1}
    ]);
  });

  
  it('should return status 500 if the database fails', async () => {
    const mockDb = {
      query: vi.fn().mockRejectedValue(new Error('Database error'))
    };

    const app = createApp({ db: mockDb });
    const response = await request(app).get('/api/services');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 'ERR-500',
      message: 'An error occurred, please try later'
    });
  });

});