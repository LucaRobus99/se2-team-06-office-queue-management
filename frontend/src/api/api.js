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
      message = error.message ?? error.detail ?? error.title ?? message;
    } catch {
      // Keep the default message if the response is not valid JSON
    }

    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export function getServices() {
  return request('/services');
}

/**
 * Requests a new ticket for the selected service.
 */
export function requestTicket(serviceCode) {
  return request('/tickets', {
    method: 'POST',
    body: JSON.stringify({ serviceCode }),
  });
}