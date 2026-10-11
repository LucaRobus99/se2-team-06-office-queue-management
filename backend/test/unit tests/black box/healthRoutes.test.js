import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app.js';

describe('Black Box Test - GET /api/health', () => {

  // CASO 1: Database attivo (Status 200)
  it('dovrebbe restituire status 200 e "UP" quando il database è raggiungibile', async () => {
    // Mock del DB che risponde con successo a SELECT 1
    const mockDb = {
      query: vi.fn().mockResolvedValue([{ 1: 1 }])
    };

    const app = createApp({ db: mockDb });

    // Inviamo una richiesta HTTP GET reale all'endpoint tramite Supertest
    const response = await request(app).get('/api/health');

    // Verifichiamo lo status HTTP e il payload JSON ricevuto
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      database: 'UP'
    });
    expect(mockDb.query).toHaveBeenCalledWith('SELECT 1');
  });

  // CASO 2: Database offline / Errore di connessione (Status 503)
  it('dovrebbe restituire status 503 e "DOWN" se la query sul DB fallisce', async () => {
    // Mock del DB che lancia un errore (es. connessione persa)
    const mockDb = {
      query: vi.fn().mockRejectedValue(new Error('Database connection failed'))
    };

    const app = createApp({ db: mockDb });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'DOWN',
      database: 'DOWN'
    });
  });

});