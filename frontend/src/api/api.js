/**
 * Client-side API layer: the only place where the frontend talks to the backend.
 * Requests go to `/api/...` and are forwarded to the Express server by the Vite dev proxy
 * (see vite.config.js).
 */

const BASE_URL = '/api';

/**
 * Performs a request to the backend and parses the JSON response.
 * Throws an Error with the backend's `detail` (or `title`) message when the response is not OK.
 * Exported so it can be unit-tested on its own.
 */
export async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // The backend returns errors as JSON: { title, status, detail }
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const error = await response.json();
      message = error.detail ?? error.title ?? message;
    } catch {
      // body was not JSON, keep the generic message
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

/** GET /api/services → list of the services a customer can request a ticket for. */
export function getServices() {
  // TODO: restore the real call once the backend endpoint is available
  return request('/services');
}

/** POST /api/tickets → issues a new ticket for the given service. */
export function requestTicket(serviceId) {
  // TODO: restore the real call once the backend endpoint is available
  // return request('/tickets', {
  //   method: 'POST',
  //   body: JSON.stringify({ serviceId }),
  // });

  mockTicketId += 1;
  return mockResponse({
    id: mockTicketId,
    serviceId,
    status: 'WAITING',
    issuedAt: new Date().toISOString(),
  });
}

/* ---------- Mock helpers (remove when the backend is ready) ---------- */

let mockTicketId = 4; // the seed data already contains tickets 1–4

/** Resolves with `data` after a short delay, to simulate a network call. */
function mockResponse(data, delayMs = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
