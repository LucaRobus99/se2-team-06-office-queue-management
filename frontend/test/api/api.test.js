import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getServices, request, requestTicket } from '../../src/api/api.js';

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

  it('throws a generic message when the error body is not JSON', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 500, jsonThrows: true }));

    await expect(request('/services')).rejects.toThrow('Request failed with status 500');
  });

  it('propagates network errors', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(request('/services')).rejects.toThrow('Failed to fetch');
  });
});

// These cover the temporary mocked implementations. Once the real calls are restored,
// replace them with tests that check fetch is called with the right path/method/body.
describe('getServices (mocked)', () => {
  it('returns services with the fields the UI needs', async () => {
    const services = await getServices();

    expect(services.length).toBeGreaterThan(0);
    for (const service of services) {
      expect(service).toEqual(
        expect.objectContaining({ id: expect.any(Number), code: expect.any(String), name: expect.any(String) }),
      );
      expect([0, 1]).toContain(service.active);
    }
  });

  it('includes both active and inactive services', async () => {
    const services = await getServices();

    expect(services.some((s) => s.active === 1)).toBe(true);
    expect(services.some((s) => s.active === 0)).toBe(true);
  });
});

describe('requestTicket (mocked)', () => {
  it('returns a WAITING ticket for the requested service', async () => {
    const ticket = await requestTicket(2);

    expect(ticket).toEqual({
      id: expect.any(Number),
      serviceId: 2,
      status: 'WAITING',
      issuedAt: expect.any(String),
    });
    expect(Number.isNaN(Date.parse(ticket.issuedAt))).toBe(false);
  });

  it('issues a new, increasing ticket id on every call', async () => {
    const first = await requestTicket(1);
    const second = await requestTicket(1);

    expect(second.id).toBe(first.id + 1);
  });
});
