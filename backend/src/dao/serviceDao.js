/**
 * DAO layer: manages SQL queries for services.
 */

export function createServiceDao(db) {
  return {
    async findAll() {
      const { rows } = await db.query(
        'SELECT code, name, description, active FROM services ORDER BY name COLLATE NOCASE, code'
      );

      return rows;
    },

    async findByCode(code) {
      const { rows } = await db.query(
        'SELECT id, code, name, active FROM services WHERE code = ?',
        [code]
      );

      return rows[0] ?? null;
    },
  };
}