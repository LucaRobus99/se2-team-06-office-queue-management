/**
 * Service layer: manages ticket creation and queue information.
 */

export function createTicketService(serviceDao, ticketDao) {
  return {
    async createTicket(serviceCode) {

      // Find the selected service
      const code = typeof serviceCode === 'string' ? serviceCode.trim().toUpperCase(): '';
      const service = await serviceDao.findByCode(code);

      // Only active services can issue tickets
      if (!service || service.active !== 1) {
        throw new Error('Service not found or unavailable');
      }

      // Generate the issue timestamp
      const issuedAt = new Date().toISOString();

      // Create the ticket and retrieve its unique ID
      const ticketId = await ticketDao.insert(service.id, issuedAt);

      // Calculate the current day's boundaries
      const { startOfDay, endOfDay } = getRomeDayBounds(new Date(issuedAt));

      // Count previous waiting tickets for the same service
      const peopleAhead = await ticketDao.countPeopleAhead(
        service.id,
        ticketId,
        startOfDay,
        endOfDay
      );

      return {
        ticketCode: `T-${String(ticketId).padStart(6, '0')}`,
        serviceName: service.name,
        issuedAt,
        peopleAhead,
      };
    },
  };
}


// Returns the UTC boundaries of the current day in Europe/Rome.
function getRomeDayBounds(date) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [year, month, day] = formatter.format(date)
    .split('-')
    .map(Number);

  const currentDay = new Date(Date.UTC(year, month - 1, day));
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1));

  return {
    startOfDay: romeMidnightToUtc(currentDay),
    endOfDay: romeMidnightToUtc(nextDay),
  };
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