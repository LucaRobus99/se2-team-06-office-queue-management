const BASE_URL = '/api';

export async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const error = await response.json();
      message = error.detail ?? error.title ?? message;
    } catch {
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export function getServices() {
  return request('/services');
}

/** POST /api/tickets → issues a new ticket for the given service. */
export function requestTicket(serviceId) {
  // TODO: restore the real call once the backend endpoint is available
  // return request('/tickets', {
  //   method: 'POST',
  //   body: JSON.stringify({ serviceId }),
  // });

  return mockResponse({});
}

function mockResponse(data, delayMs = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
