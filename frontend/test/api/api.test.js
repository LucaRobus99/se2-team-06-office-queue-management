import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTicket, getServices, request, requestTicket } from '../../src/api/api.js';

/** Builds a minimal fetch Response stand-in. */
function mockFetchResponse({ status = 200, body, jsonThrows = false }) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jsonThrows ? vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')) : vi.fn().mockResolvedValue(body),
  };
}

describe('request', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls the backend under /api with JSON headers', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ body: [] }));

    await request('/services');

    expect(fetch).toHaveBeenCalledWith('/api/services', {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('forwards method and body options', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 201, body: { id: 1 } }));

    await request('/tickets', { method: 'POST', body: JSON.stringify({ serviceId: 1 }) });

    expect(fetch).toHaveBeenCalledWith('/api/tickets', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"serviceId":1}',
    });
  });

  it('returns the parsed JSON body on success', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ body: [{ id: 1 }] }));

    await expect(request('/services')).resolves.toEqual([{ id: 1 }]);
  });

  it('returns null for 204 No Content', async () => {
    const response = mockFetchResponse({ status: 204 });
    fetch.mockResolvedValue(response);

    await expect(request('/tickets/1', { method: 'DELETE' })).resolves.toBeNull();
    expect(response.json).not.toHaveBeenCalled();
  });

  it('throws the backend "detail" message on error', async () => {
    fetch.mockResolvedValue(
      mockFetchResponse({
        status: 404,
        body: { type: 'about:blank', title: 'Not Found', status: 404, detail: 'Service 9 not found' },
      }),
    );

    await expect(request('/services/9')).rejects.toThrow('Service 9 not found');
  });

  it('falls back to "title" when the error has no detail', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 400, body: { title: 'Bad Request', status: 400 } }));

    await expect(request('/tickets')).rejects.toThrow('Bad Request');
  });

  it('throws the backend "message" on error when code and message are present', async () => {
    fetch.mockResolvedValue(
      mockFetchResponse({
        status: 500,
        body: { code: 'ERR-100', message: 'Service not found' },
      }),
    );

    await expect(request('/tickets')).rejects.toThrow('Service not found');
  });

  it('throws a generic message when the error body is not JSON', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 500, jsonThrows: true }));

    await expect(request('/services')).rejects.toThrow('Request failed with status 500');
  });

  it('propagates network errors', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(request('/services')).rejects.toThrow('Failed to fetch');
  });
});

describe('getServices', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls /api/services with GET and returns services', async () => {
    const mockServices = [
      { code: 'SHIP', name: 'Shipping', active: 1 },
      { code: 'INFO', name: 'Information', active: 0 },
    ];
    fetch.mockResolvedValue(mockFetchResponse({ body: mockServices }));

    const services = await getServices();

    expect(fetch).toHaveBeenCalledWith('/api/services', {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(services).toEqual(mockServices);
  });
});

describe('requestTicket and createTicket', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls /api/tickets with POST and returns the created ticket response', async () => {
    const mockTicket = {
      ticketCode: 'T-000043',
      serviceName: 'Shipping',
      issuedAt: '2026-10-08T08:30:00.000Z',
      peopleAhead: 3,
    };
    fetch.mockResolvedValue(mockFetchResponse({ status: 201, body: mockTicket }));

    const ticket = await requestTicket('SHIP');

    expect(fetch).toHaveBeenCalledWith('/api/tickets', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ serviceCode: 'SHIP' }),
    });
    expect(ticket).toEqual(mockTicket);
  });

  it('createTicket is an alias of requestTicket and works identically', async () => {
    const mockTicket = {
      ticketCode: 'T-000044',
      serviceName: 'Shipping',
      issuedAt: '2026-10-08T08:35:00.000Z',
      peopleAhead: 4,
    };
    fetch.mockResolvedValue(mockFetchResponse({ status: 201, body: mockTicket }));

    const ticket = await createTicket('SHIP');

    expect(fetch).toHaveBeenCalledWith('/api/tickets', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ serviceCode: 'SHIP' }),
    });
    expect(ticket).toEqual(mockTicket);
  });
});
