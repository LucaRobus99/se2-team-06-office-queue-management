/**
 * DAO layer: the ONLY place that writes SQL for the "dummy" table.
 * Returns plain JavaScript objects with camelCase fields.
 */

const COLUMNS = 'id, name, description, created_at AS "createdAt"';

export function createDummyDao(db) {
  return {
    async findAll() {
      const { rows } = await db.query(`SELECT ${COLUMNS} FROM dummy ORDER BY id`);
      return rows;
    },

    async findByName(name) {
      const { rows } = await db.query(
        `SELECT ${COLUMNS} FROM dummy WHERE lower(name) LIKE '%' || lower($1) || '%' ORDER BY id`,
        [name],
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(`SELECT ${COLUMNS} FROM dummy WHERE id = $1`, [id]);
      return rows[0] ?? null;
    },

    async insert({ name, description }) {
      const { rows } = await db.query(
        `INSERT INTO dummy (name, description) VALUES ($1, $2) RETURNING ${COLUMNS}`,
        [name, description ?? null],
      );
      return rows[0];
    },

    /** @returns {Promise<boolean>} true if a row was deleted */
    async deleteById(id) {
      const { rowCount } = await db.query('DELETE FROM dummy WHERE id = $1', [id]);
      return rowCount > 0;
    },
  };
}
