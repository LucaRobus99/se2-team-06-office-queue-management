/** Shared test data, aligned with backend/scripts/02-seed.sql. */

export const SERVICES = [
  { id: 1, code: 'SHIP', name: 'shipping and packets', service_time_minutes: 5, active: 1 },
  { id: 2, code: 'PAY', name: 'payment service', service_time_minutes: 10, active: 1 },
  { id: 3, code: 'INFO', name: 'general information', service_time_minutes: 3, active: 1 },
  { id: 4, code: 'EXTRA', name: 'new service', service_time_minutes: 0, active: 0 },
];

export const TICKET = {
  id: 5,
  serviceId: 2,
  status: 'WAITING',
  issuedAt: '2026-10-08T09:00:00.000Z',
};

/** A promise plus its resolve/reject functions, to control when a mocked API call finishes. */
export function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
