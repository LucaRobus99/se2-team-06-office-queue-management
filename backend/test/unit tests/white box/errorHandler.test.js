import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler, notFoundHandler } from '../../../src/middleware/errorHandler.js';
import { AppError, TicketError } from '../../../src/errors/AppError.js';

describe('White Box Test - errorHandler & notFoundHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', path: '/api/services' };
    res = {
      status: vi.fn().mockReturnThis(), 
      json: vi.fn()
    };
    next = vi.fn();
  });

  
  it('dovrebbe gestire TicketError e restituire status 500 con code e message', () => {
    const err = new TicketError('ERR-101', 'Invalid service code');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 'ERR-101',
      message: 'Invalid service code'
    });
  });

  
  it('dovrebbe restituire ERR-101 (status 500) se fallisce il parsing JSON su POST /api/tickets', () => {
    const err = { type: 'entity.parse.failed' };
    req.method = 'POST';
    req.path = '/api/tickets';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 'ERR-101',
      message: 'Invalid service code'
    });
  });

  // CASO 3: Gestione di AppError generico
  it('dovrebbe gestire un AppError personalizzato e formattare la risposta problem', () => {
    // Creiamo una sottoclasse o un istanza di AppError con parametri personalizzati
    class CustomAppError extends AppError {
      constructor() {
        super(400, 'Bad Request', 'Parametro mancante');
      }
    }
    const err = new CustomAppError();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Parametro mancante'
    });
  });

  // CASO 4: JSON non valido su una qualsiasi altra rotta (es. POST /api/services)
  it('dovrebbe restituire status 400 per JSON non valido su rotte generiche', () => {
    const err = { type: 'entity.parse.failed' };
    req.method = 'POST';
    req.path = '/api/services';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body is not valid JSON'
    });
  });

  // CASO 5: Errore generico/inatteso (Fallback 500)
  it('dovrebbe restituire ERR-500 e fare console.error per errori non gestiti', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('Database connection failed');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 'ERR-500',
      message: 'An error occurred, please try later'
    });
    expect(consoleSpy).toHaveBeenCalledWith(err);

    consoleSpy.mockRestore(); // Ripristina console.error originale
  });

  // CASO 6: Test di notFoundHandler (404)
  it('notFoundHandler dovrebbe restituire status 404 quando la rotta non esiste', () => {
    req.method = 'DELETE';
    req.path = '/api/unknown-route';

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'No route for DELETE /api/unknown-route'
    });
  });
});