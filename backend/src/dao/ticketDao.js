/**
 * DAO layer: manages SQL queries for tickets.
 */

export function createTicketDao(db) {
  return {
    async insert(serviceId, issuedAt) {
      const { rows } = await db.query(
        `INSERT INTO tickets (service_id, status, issued_at)
         VALUES (?, 'WAITING', ?)
         RETURNING id`,
        [serviceId, issuedAt]
      );

      return rows[0].id;
    },

    async countPeopleAhead(serviceId, ticketId, startOfDay, endOfDay) {
      const { rows } = await db.query(
        `SELECT COUNT(*) AS peopleAhead
         FROM tickets
         WHERE service_id = ?
           AND status = 'WAITING'
           AND issued_at >= ?
           AND issued_at < ?
           AND id < ?`,
        [serviceId, startOfDay, endOfDay, ticketId]
      );

      return Number(rows[0].peopleAhead);
    },
  };
}