/**
 * DAO layer: manages SQL queries for tickets.
 */

export function createTicketDao(db) {
  return {
    async insert(serviceId, periodId, sequenceNumber, issuedAt) {
      const { rows } = await db.query(
        `INSERT INTO tickets (service_id, period_id, sequence_number, status, issued_at)
         VALUES (?, ?, ?, 'WAITING', ?)
         RETURNING id`,
        [serviceId, periodId, sequenceNumber, issuedAt]
      );

      return rows[0].id;
    },

    async countPeopleAhead(periodId, sequenceNumber) {
      const { rows } = await db.query(
        `SELECT COUNT(*) AS peopleAhead
         FROM tickets
         WHERE period_id = ?
           AND status = 'WAITING'
           AND sequence_number < ?`,
        [periodId, sequenceNumber]
      );

      return Number(rows[0].peopleAhead);
    },
  };
}
