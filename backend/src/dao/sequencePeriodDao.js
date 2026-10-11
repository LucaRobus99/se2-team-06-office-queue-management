/**
 * DAO layer: manages SQL queries for the numbering periods of each service.
 */

export function createSequencePeriodDao(db) {
  return {
    async findOpen(serviceId) {
      const { rows } = await db.query(
        `SELECT id, service_id, started_at, last_value
         FROM sequence_periods
         WHERE service_id = ? AND ended_at IS NULL`,
        [serviceId]
      );

      return rows[0] ?? null;
    },

    async open(serviceId, startedAt) {
      const { rows } = await db.query(
        `INSERT INTO sequence_periods (service_id, started_at)
         VALUES (?, ?)
         RETURNING id, service_id, started_at, last_value`,
        [serviceId, startedAt]
      );

      return rows[0];
    },

    async close(periodId, endedAt) {
      await db.query(
        'UPDATE sequence_periods SET ended_at = ? WHERE id = ? AND ended_at IS NULL',
        [endedAt, periodId]
      );
    },

    async nextSequenceNumber(periodId) {
      const { rows } = await db.query(
        `UPDATE sequence_periods
         SET last_value = last_value + 1
         WHERE id = ?
         RETURNING last_value`,
        [periodId]
      );

      return rows[0].last_value;
    },
  };
}
