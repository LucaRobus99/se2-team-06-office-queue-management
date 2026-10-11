import { TicketError } from '../errors/AppError.js';

/**
 * Service layer: manages ticket creation and queue information.
 *
 * Ticket numbers are a sequence per service and per numbering period: the first ticket
 * issued on a new day (Europe/Rome) closes the previous period and restarts from 1.
 */

export function createTicketService(serviceDao, ticketDao, periodDao, transaction) {
  return {
    async createTicket(serviceCode) {

      // Validate and normalize the service code
      const code = typeof serviceCode === 'string'? serviceCode.trim().toUpperCase(): '';

      if (!/^[A-Z0-9_-]{1,20}$/.test(code)) {
        throw new TicketError('ERR-101', 'Invalid service code');
      }

      const service = await serviceDao.findByCode(code);

      if (!service) {
        throw new TicketError('ERR-100', 'Service not found');
      }

      // Only active services can issue tickets
      if (service.active !== 1) {
        throw new TicketError('ERR-102', 'Service is not available');
      }

      // Generate the issue timestamp
      const issuedAt = new Date().toISOString();

      // Start of the current day in Europe/Rome: periods opened before it are expired
      const startOfDay = getRomeStartOfDay(new Date(issuedAt));

      // Take the next number and store the ticket atomically
      const { sequenceNumber, peopleAhead } = await transaction(async () => {
        const period = await getCurrentPeriod(periodDao, service.id, issuedAt, startOfDay);
        const sequenceNumber = await periodDao.nextSequenceNumber(period.id);

        await ticketDao.insert(service.id, period.id, sequenceNumber, issuedAt);

        // Count previous waiting tickets of the same service in the same period
        const peopleAhead = await ticketDao.countPeopleAhead(period.id, sequenceNumber);

        return { sequenceNumber, peopleAhead };
      });

      return {
        ticketCode: formatTicketCode(service.code, sequenceNumber),
        serviceName: service.name,
        issuedAt,
        peopleAhead,
      };
    },
  };
}


// Returns the open period of the service, starting a new one if there is none
// or if the open one was started on a previous day.
async function getCurrentPeriod(periodDao, serviceId, now, startOfDay) {
  const period = await periodDao.findOpen(serviceId);

  if (period && period.started_at >= startOfDay) {
    return period;
  }

  if (period) {
    await periodDao.close(period.id, now);
  }

  return periodDao.open(serviceId, now);
}


// e.g. ("SHIP", 7) → "SHIP-007"
export function formatTicketCode(serviceCode, sequenceNumber) {
  return `${serviceCode}-${String(sequenceNumber).padStart(3, '0')}`;
}


// Returns the UTC timestamp of the start of the current day in Europe/Rome.
function getRomeStartOfDay(date) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [year, month, day] = formatter.format(date)
    .split('-')
    .map(Number);

  return romeMidnightToUtc(new Date(Date.UTC(year, month - 1, day)));
}


// Converts midnight in Rome into its corresponding UTC timestamp.
function romeMidnightToUtc(date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Rome',
    timeZoneName: 'longOffset',
  });

  const offset = formatter.formatToParts(date).find((part) => part.type === 'timeZoneName').value;
  const [, sign, hours, minutes] = offset.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  const offsetMinutes = (sign === '+' ? 1 : -1) * (Number(hours) * 60 + Number(minutes));

  return new Date(date.getTime() - offsetMinutes * 60_000).toISOString();
}
