/**
 * DAO layer: manages SQL queries for services.
 */

export function createServiceDao(db) {
  return {
    async findAll() {
      const { rows } = await db.query(
        'SELECT code, name, active FROM services ORDER BY name COLLATE NOCASE, code'
      );

      return rows;
    },
  };
}